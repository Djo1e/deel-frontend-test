import { useEffect, useRef, useState } from "react";

interface AutoCompleteProps {
  data: string[];
}

interface Match {
  highlightedText: string;
  remainingText: string;
}

export function AutoComplete({ data }: AutoCompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const fetchMatches = async (query: string): Promise<Match[]> => {
    if (query === "") {
      return data.map((item) => ({
        highlightedText: "",
        remainingText: item,
      }));
    }
    return data
      .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
      .map((item) => ({
        highlightedText: item.slice(0, query.length),
        remainingText: item.slice(query.length),
      }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const results = await fetchMatches(inputValue);
      setMatches(results);
    };

    if (isFocused || inputValue !== "") {
      fetchData();
    } else {
      setMatches([]);
    }
  }, [inputValue, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (index: number) => {
    const match = matches[index].highlightedText + matches[index].remainingText;
    setInputValue(match);
    setMatches([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="px-1"
        autoComplete="off"
      />
      {matches.length > 0 ? (
        <ul className="absolute w-full mt-2 bg-white rounded-sm">
          {matches.map((match, index) => (
            <li key={`${match.highlightedText}${match.remainingText}`}>
              <button
                className="w-full px-1 text-left"
                onClick={() => handleSuggestionClick(index)}
              >
                <strong>{match.highlightedText}</strong>
                {match.remainingText}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}