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
  isDisabled?: boolean;
}

function Spinner() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-6 h-6 text-gray-200 animate-spin fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
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
        disabled={isDisabled}
        autoComplete="off"
      />
      {isLoading && (
        <div className="absolute right-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Spinner />
        </div>
      )}
      {isFocused && options.length > 0 ? (
        <ul
          className="absolute w-full p-1 mt-2 overflow-y-auto bg-white rounded-sm min-h-20 max-h-80"
          id="suggestion-list"
        >
          {options.map((option, index) => (
            <li
              key={`${option.highlightedText}${option.remainingText}`}
              className={index === activeIndex ? "bg-[#ED6A5A]" : ""}
              ref={(el) => (suggestionRefs.current[index] = el)}
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
      {input !== "" && !isLoading && options.length === 0 ? (
        <div className="absolute w-full p-1 mt-2 overflow-y-scroll bg-white rounded-sm text-slate-500 min-h-20 max-h-60">
          No options
        </div>
      ) : null}
    </div>
  );
}
