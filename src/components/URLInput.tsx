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
            : "border-white/10"
        } bg-surface-secondary`}
      >
        {/* Link icon */}
        <div className="pl-4 pr-2 flex-shrink-0">
          <LinkIcon
            className={`w-5 h-5 transition-colors ${
              isFocused ? "text-primary" : "text-white/30"
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
          className="flex-1 bg-transparent py-3.5 text-white placeholder-white/20 text-sm font-medium outline-none"
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
                  isLong ? "text-amber-400" : "text-white/20"
                }`}
              >
                {inputValue.length}
              </span>
              <button
                onClick={handleClear}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Clear URL"
              >
                <XIcon className="w-3 h-3 text-white/60" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Warnings */}
      <div className="flex items-center justify-between px-1">
        {isLong ? (
          <p className="text-amber-400 text-xs">
            Long URLs make denser QR codes — consider using a URL shortener
          </p>
        ) : inputValue && !isValid ? (
          <p className="text-red-400 text-xs">
            Enter a valid URL (e.g. https://example.com)
          </p>
        ) : (
          <span />
        )}
      </div>

      {/* Quick examples */}
      {!inputValue && (
        <div className="flex flex-wrap gap-2 mt-1">
          <p className="text-white/30 text-xs w-full mb-1">Try an example:</p>
          {["https://github.com", "https://example.com", "https://youtube.com"].map(
            (example) => (
              <button
                key={example}
                onClick={() => {
                  setInputValue(example);
                  setData(example);
                }}
                className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary border border-white/10 hover:border-primary/30 text-white/40 transition-all"
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
