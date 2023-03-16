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
  const [activeIndex, setActiveIndex] = useState(-1);

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

  const handleClickOutside = (e: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target as Node) &&
      (e.target as HTMLElement).id !== "input" &&
      (e.target as HTMLElement).id !== "suggestion-list" &&
      (e.target as HTMLElement).id !== "suggestion-item"
    ) {
      setIsFocused(false);
    }
  };

  // Closes suggestion menu when clicked outside of input/menu
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    setIsFocused(true);

    switch (key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % matches.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + matches.length) % matches.length);
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          setInputValue(
            matches[activeIndex].highlightedText +
              matches[activeIndex].remainingText
          );
          setMatches([]);
          setActiveIndex(-1);
        }
        setIsFocused(false);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (index: number) => {
    const match = matches[index].highlightedText + matches[index].remainingText;
    setInputValue(match);
    setMatches([]);
    setActiveIndex(-1);
    setIsFocused(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <input
        id="input"
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        className="px-1"
        autoComplete="off"
      />
      {isFocused && matches.length > 0 ? (
        <ul
          className="absolute w-full p-0.5 mt-2 bg-white rounded-sm"
          id="suggestion-list"
        >
          {matches.map((match, index) => (
            <li
              key={`${match.highlightedText}${match.remainingText}`}
              className={
                index === activeIndex ? "bg-[#15357a] brightness-125" : ""
              }
            >
              <button
                id="suggestion-item"
                className={`w-full px-1 text-left ${
                  index === activeIndex ? "text-white" : "text-current"
                }`}
                onClick={() => handleSuggestionClick(index)}
                onMouseDown={(e) => e.preventDefault()}
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
