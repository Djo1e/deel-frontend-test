import type { NextPage } from 'next'

import React, { useState, useEffect, useRef } from 'react';
import citiesJSON from '../cities.json'

interface AutoCompleteProps {
  data: string[];
}


function AutoComplete({ data }: AutoCompleteProps)  {
  const [inputValue, setInputValue] = useState('');
  const [matches, setMatches] = useState([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMatches = async (query: string): Promise<any> => {
    return data.filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
  };

  useEffect(() => {
    const fetchData = async () => {
      if (inputValue) {
        const results = await fetchMatches(inputValue);
        setMatches(results);
      } else {
        setMatches([]);
      }
    };

    fetchData();
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (index: number) => {
    setInputValue(matches[index]);
    setMatches([]);
    inputRef.current?.focus();
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        autoComplete="off"
        className="px-1"
      />
      {matches.length > 0 && (
        <ul className="mt-2 bg-white">
          {matches.map((match, index) => (
            <li
              key={match}
            >
              <button className="w-full px-1 text-left" onClick={() => handleSuggestionClick(index)}>{match}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


const Home: NextPage = () => {
  return (
    <div className="flex bg-[#15357a] flex-col items-center justify-center min-h-screen py-2">
      <AutoComplete data={citiesJSON.cities}/>
    </div>
  )
}

export default Home
