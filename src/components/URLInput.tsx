"use client";

import { useState, useCallback } from "react";
import { useQRStore } from "@/store/qrStore";

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function isValidUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function URLInput() {
  const { data, setData } = useQRStore();
  const [inputValue, setInputValue] = useState(data);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      if (value === "") {
        setData("");
        return;
      }

      // Auto-prepend https:// if missing protocol
      if (
        value.length > 3 &&
        !value.startsWith("http://") &&
        !value.startsWith("https://") &&
        !value.startsWith("//") &&
        value.includes(".")
      ) {
        setData("https://" + value);
      } else {
        setData(value);
      }
    },
    [setData]
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    setData("");
  }, [setData]);

  const isValid = inputValue === "" || isValidUrl(inputValue) || inputValue.includes(".");
  const isLong = inputValue.length > 100;

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`relative flex items-center rounded-xl border transition-all duration-200 ${
          isFocused
            ? "border-primary shadow-glow"
            : inputValue && !isValid
            ? "border-red-500/50"
            : "border-gray-200"
        } bg-gray-50`}
      >
        {/* Link icon */}
        <div className="pl-4 pr-2 flex-shrink-0">
          <LinkIcon
            className={`w-5 h-5 transition-colors ${
              isFocused ? "text-primary" : "text-gray-400"
            }`}
          />
        </div>

        {/* Input */}
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Paste your link here..."
          className="flex-1 bg-transparent py-3.5 text-gray-900 placeholder-gray-400 text-sm font-medium outline-none"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />

        {/* Character count + clear */}
        <div className="flex items-center gap-2 pr-3">
          {inputValue && (
            <>
              <span
                className={`text-xs font-medium tabular-nums ${
                  isLong ? "text-amber-500" : "text-gray-400"
                }`}
              >
                {inputValue.length}
              </span>
              <button
                onClick={handleClear}
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                aria-label="Clear URL"
              >
                <XIcon className="w-3 h-3 text-gray-500" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Warnings */}
      <div className="flex items-center justify-between px-1">
        {isLong ? (
          <p className="text-amber-500 text-xs">
            Long URLs make denser QR codes — consider using a URL shortener
          </p>
        ) : inputValue && !isValid ? (
          <p className="text-red-500 text-xs">
            Enter a valid URL (e.g. https://example.com)
          </p>
        ) : (
          <span />
        )}
      </div>

      {/* Quick examples */}
      {!inputValue && (
        <div className="flex flex-wrap gap-2 mt-1">
          <p className="text-gray-400 text-xs w-full mb-1">Try an example:</p>
          {["https://github.com", "https://example.com", "https://youtube.com"].map(
            (example) => (
              <button
                key={example}
                onClick={() => {
                  setInputValue(example);
                  setData(example);
                }}
                className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-primary/10 hover:text-primary border border-gray-200 hover:border-primary/30 text-gray-500 transition-all"
              >
                {example.replace("https://", "")}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
