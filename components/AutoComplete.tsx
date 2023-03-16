import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface Match {
  highlightedText: string;
  remainingText: string;
}

interface AutoCompleteProps {
  options: Match[];
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  isLoading?: boolean;
  placeholder?: string;
}

export function AutoComplete({
  options,
  input,
  setInput,
  isLoading,
  placeholder,
}: AutoCompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    setIsFocused(true);

    switch (key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          setInput(
            options[activeIndex].highlightedText +
              options[activeIndex].remainingText
          );
          setActiveIndex(-1);
        }
        setIsFocused(false);
        break;
    }
  };

  const handleSuggestionClick = (index: number) => {
    const match = options[index].highlightedText + options[index].remainingText;
    setInput(match);
    setActiveIndex(-1);
    setIsFocused(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <input
        id="input"
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        className="h-12 px-2 text-2xl rounded w-72"
        placeholder={placeholder}
      />
      {isFocused && options.length > 0 ? (
        <ul
          className="absolute w-full p-1 mt-2 overflow-y-auto bg-white rounded-sm min-h-20 max-h-80"
          id="suggestion-list"
        >
          {options.map((option, index) => (
            <li
              key={`${option.highlightedText}${option.remainingText}`}
              className={index === activeIndex ? "bg-[#ED6A5A]" : ""}
            >
              <button
                id="suggestion-item"
                className="w-full px-1 text-left"
                onClick={() => handleSuggestionClick(index)}
                onMouseDown={(e) => e.preventDefault()}
              >
                <strong>{option.highlightedText}</strong>
                {option.remainingText}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {input !== "" && options.length === 0 ? (
        <div className="absolute w-full p-1 mt-2 overflow-y-scroll bg-white rounded-sm min-h-20 max-h-60">
          {isLoading ? "Loading..." : "No options"}
        </div>
      ) : null}
    </div>
  );
}
