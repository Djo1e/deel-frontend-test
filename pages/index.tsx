import type { NextPage } from "next";

import React, { useEffect, useState } from "react";
import { AutoComplete } from "../components/AutoComplete";
import { useDebounce } from "../hooks/use-debounce";

interface Match {
  highlightedText: string;
  remainingText: string;
}

const Home: NextPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedInputValue = useDebounce(inputValue, 300);

  const fetchMatches = async (query: string): Promise<Match[]> => {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`
    );

    setIsLoading(false);

    if (!response.ok) {
      return [];
    }

    const countries = await response.json();

    const cities = countries
      .map((country: { name: { common: string } }) => country.name.common)
      .filter((capital: string) => capital);

    return cities
      .filter((city: string) =>
        city.toLowerCase().startsWith(query.toLowerCase())
      )
      .map((city: string) => ({
        highlightedText: city.slice(0, query.length),
        remainingText: city.slice(query.length),
      }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const results = await fetchMatches(debouncedInputValue);
      setOptions(results);
    };

    if (debouncedInputValue !== "") {
      fetchData();
    } else {
      setIsLoading(false);
      setOptions([]);
    }
  }, [debouncedInputValue]);

  return (
    <div className="flex bg-[#15357a] flex-col items-center pt-[20%] min-h-screen py-2">
      <AutoComplete
        options={options}
        input={inputValue}
        setInput={(value) => {
          setIsLoading(true);
          setInputValue(value);
        }}
        isLoading={isLoading}
        placeholder="Enter any country"
      />
    </div>
  );
};

export default Home;
