"use client";

import { useState, useCallback } from "react";
import { useQRStore } from "@/store/qrStore";

export default function URLInput() {
  const { data, setData } = useQRStore();
  const [inputValue, setInputValue] = useState(data);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (!value) { setData(""); return; }
    if (value.length > 3 && !value.startsWith("http") && !value.startsWith("//") && value.includes(".")) {
      setData("https://" + value);
    } else {
      setData(value);
    }
  }, [setData]);

  const isValid = !inputValue || inputValue.startsWith("http://") || inputValue.startsWith("https://") || inputValue.includes(".");
  const isLong = inputValue.length > 100;

  return (
    <div className="flex flex-col gap-3">
      <div className={`flex items-center rounded-xl border transition-all ${
        isFocused ? "border-primary shadow-glow" : inputValue && !isValid ? "border-red-400" : "border-gray-200"
      } bg-gray-50`}>
        <div className="pl-4 pr-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            className={`w-4.5 h-4.5 ${isFocused ? "text-primary" : "text-gray-400"}`}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
        </div>
        <input
          type="text" value={inputValue} onChange={handleChange}
          onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
          placeholder="Paste your link here..."
          className="flex-1 bg-transparent py-3.5 text-gray-900 placeholder-gray-400 text-sm outline-none"
          spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off"
        />
        {inputValue && (
          <div className="flex items-center gap-2 pr-3">
            <span className={`text-xs tabular-nums ${isLong ? "text-amber-500" : "text-gray-400"}`}>
              {inputValue.length}
            </span>
            <button onClick={() => { setInputValue(""); setData(""); }}
              className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3 text-gray-500">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {isLong && <p className="text-amber-500 text-xs px-1">Long URLs make denser QR codes</p>}
      {inputValue && !isValid && <p className="text-red-500 text-xs px-1">Enter a valid URL</p>}

      {!inputValue && (
        <div className="flex flex-wrap gap-2 mt-1">
          <p className="text-gray-400 text-xs w-full">Try an example:</p>
          {["https://github.com", "https://example.com", "https://youtube.com"].map((ex) => (
            <button key={ex} onClick={() => { setInputValue(ex); setData(ex); }}
              className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-primary/8 hover:text-primary border border-gray-200 hover:border-primary/30 text-gray-500 transition-all">
              {ex.replace("https://", "")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
