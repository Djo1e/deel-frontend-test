import type { NextPage } from "next";

import React, { useEffect, useState } from "react";
import { AutoComplete } from "../components/AutoComplete";
import { useDebounce } from "../hooks/use-debounce";

interface Match {
  highlightedText: string;
  remainingText: string;
}

interface CountryResponse {
  name: { common: string };
}

const API_ENDPOINT = "https://restcountries.com/v3.1/all";

const Home: NextPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CountryResponse[]>([]);

  const debouncedInputValue = useDebounce(inputValue, 300, () =>
    setIsLoading(false)
  );

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      const response = await fetch(API_ENDPOINT);
      setIsLoading(false);

      if (!response.ok) {
        setData([]);
      }

      const countries = await response.json();
      setData(countries);
    };

    fetchData();
  }, []);

  const filterOptions = async (
    data: CountryResponse[],
    query: string
  ): Promise<Match[]> => {
    const cities = data
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
    const filterData = async () => {
      const results = await filterOptions(data, debouncedInputValue);
      setOptions(results);
    };

    if (debouncedInputValue !== "") {
      filterData();
    } else {
      setIsLoading(false);
      setOptions([]);
    }
  }, [debouncedInputValue, data]);

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
        isDisabled={data.length === 0 && isLoading}
        placeholder="Enter any country"
      />
    </div>
  );
};

export default Home;
