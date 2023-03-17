import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Spinner } from "./Spinner";

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
  isDisabled?: boolean;
}

export function AutoComplete({
  options,
  input,
  setInput,
  isLoading,
  placeholder,
  isDisabled,
}: AutoCompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);

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

  // This makes sure the selected items is always in the view
  useEffect(() => {
    if (suggestionRefs.current[activeIndex]) {
      suggestionRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex]);

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
    <div className="relative w-72">
      <input
        id="input"
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        className="w-full h-12 px-4 text-2xl border border-gray-300 rounded focus:border-blue-500 focus:outline-none transition-colors"
        placeholder={placeholder}
        disabled={isDisabled}
        autoComplete="off"
      />
      {isLoading && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <Spinner />
        </div>
      )}
      {isFocused && options.length > 0 ? (
        <ul
          className="absolute z-10 w-full mt-1 overflow-y-auto bg-white rounded shadow-md min-h-20 max-h-80"
          id="suggestion-list"
        >
          {options.map((option, index) => (
            <li
              key={`${option.highlightedText}${option.remainingText}`}
              className={`${
                index === activeIndex ? "bg-blue-500 text-white" : ""
              } hover:bg-blue-500 hover:text-white`}
              ref={(el) => (suggestionRefs.current[index] = el)}
            >
              <button
                id="suggestion-item"
                className="w-full px-4 py-2 text-left"
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
      {input !== "" && !isLoading && options.length === 0 ? (
        <div className="absolute z-10 w-full p-2 mt-1 overflow-y-scroll text-gray-600 bg-white rounded shadow-md min-h-20 max-h-60">
          No options
        </div>
      ) : null}
    </div>
  );
}
