"use client";

import { useQRStore } from "@/store/qrStore";
import { DotType, CornerSquareType, CornerDotType } from "@/types/qr";
import ColorSection from "./ColorSection";

const DOT_STYLES: { type: DotType; label: string; preview: React.ReactNode }[] =
  [
    {
      type: "square",
      label: "Square",
      preview: (
        <svg viewBox="0 0 20 20" className="w-8 h-8">
          <rect x="2" y="2" width="7" height="7" fill="currentColor" />
          <rect x="11" y="2" width="7" height="7" fill="currentColor" />
          <rect x="2" y="11" width="7" height="7" fill="currentColor" />
          <rect x="11" y="11" width="7" height="7" fill="currentColor" />
        </svg>
      ),
    },
    {
      type: "rounded",
      label: "Rounded",
      preview: (
        <svg viewBox="0 0 20 20" className="w-8 h-8">
          <rect x="2" y="2" width="7" height="7" rx="2" fill="currentColor" />
          <rect x="11" y="2" width="7" height="7" rx="2" fill="currentColor" />
          <rect x="2" y="11" width="7" height="7" rx="2" fill="currentColor" />
          <rect x="11" y="11" width="7" height="7" rx="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      type: "dots",
      label: "Dots",
      preview: (
        <svg viewBox="0 0 20 20" className="w-8 h-8">
          <circle cx="5.5" cy="5.5" r="3.5" fill="currentColor" />
          <circle cx="14.5" cy="5.5" r="3.5" fill="currentColor" />
          <circle cx="5.5" cy="14.5" r="3.5" fill="currentColor" />
          <circle cx="14.5" cy="14.5" r="3.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      type: "classy",
      label: "Classy",
      preview: (
        <svg viewBox="0 0 20 20" className="w-8 h-8">
          <path d="M2 5a3 3 0 013-3h2v7H2V5z" fill="currentColor" />
          <path d="M11 2h2a3 3 0 013 3v4h-5V2z" fill="currentColor" />
          <rect x="2" y="11" width="7" height="7" rx="1" fill="currentColor" />
          <rect x="11" y="11" width="7" height="7" rx="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      type: "classy-rounded",
      label: "Classy+",
      preview: (
        <svg viewBox="0 0 20 20" className="w-8 h-8">
          <rect x="2" y="2" width="7" height="7" rx="3" fill="currentColor" />
          <rect x="11" y="2" width="7" height="7" rx="3" fill="currentColor" />
          <rect x="2" y="11" width="7" height="7" rx="3" fill="currentColor" />
          <rect x="11" y="11" width="2" height="2" rx="1" fill="currentColor" />
          <rect x="15" y="11" width="2" height="2" rx="1" fill="currentColor" />
          <rect x="11" y="15" width="2" height="2" rx="1" fill="currentColor" />
          <rect x="15" y="15" width="2" height="2" rx="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      type: "extra-rounded",
      label: "Pill",
      preview: (
        <svg viewBox="0 0 20 20" className="w-8 h-8">
          <rect x="2" y="2" width="7" height="7" rx="4" fill="currentColor" />
          <rect x="11" y="2" width="7" height="7" rx="4" fill="currentColor" />
          <rect x="2" y="11" width="7" height="7" rx="4" fill="currentColor" />
          <rect x="11" y="11" width="7" height="7" rx="4" fill="currentColor" />
        </svg>
      ),
    },
  ];

const CORNER_SQUARE_STYLES: {
  type: CornerSquareType;
  label: string;
  preview: React.ReactNode;
}[] = [
  {
    type: "square",
    label: "Square",
    preview: (
      <svg viewBox="0 0 20 20" className="w-7 h-7">
        <rect x="2" y="2" width="16" height="16" rx="0" fill="none" stroke="currentColor" strokeWidth="3" />
        <rect x="6" y="6" width="8" height="8" fill="currentColor" />
      </svg>
    ),
  },
  {
    type: "extra-rounded",
    label: "Rounded",
    preview: (
      <svg viewBox="0 0 20 20" className="w-7 h-7">
        <rect x="2" y="2" width="16" height="16" rx="6" fill="none" stroke="currentColor" strokeWidth="3" />
        <rect x="6" y="6" width="8" height="8" rx="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    type: "dot",
    label: "Dot",
    preview: (
      <svg viewBox="0 0 20 20" className="w-7 h-7">
        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="10" cy="10" r="4" fill="currentColor" />
      </svg>
    ),
  },
];

const CORNER_DOT_STYLES: {
  type: CornerDotType;
  label: string;
  preview: React.ReactNode;
}[] = [
  {
    type: "square",
    label: "Square",
    preview: (
      <svg viewBox="0 0 20 20" className="w-7 h-7">
        <rect x="4" y="4" width="12" height="12" fill="currentColor" />
      </svg>
    ),
  },
  {
    type: "dot",
    label: "Dot",
    preview: (
      <svg viewBox="0 0 20 20" className="w-7 h-7">
        <circle cx="10" cy="10" r="6" fill="currentColor" />
      </svg>
    ),
  },
];

export default function StylePanel() {
  const {
    dotsOptions,
    cornersSquareOptions,
    cornersDotOptions,
    setDotType,
    setCornerSquareType,
    setCornerDotType,
  } = useQRStore();

  return (
    <div className="flex flex-col gap-6">
      {/* Dot Styles */}
      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3">
          Dot Style
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {DOT_STYLES.map(({ type, label, preview }) => (
            <button
              key={type}
              onClick={() => setDotType(type)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all hover-lift ${
                dotsOptions.type === type
                  ? "border-primary bg-primary/10 text-primary shadow-glow"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
              title={label}
            >
              {preview}
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Corner Square Styles */}
      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3">
          Corner Frame
        </p>
        <div className="flex gap-2">
          {CORNER_SQUARE_STYLES.map(({ type, label, preview }) => (
            <button
              key={type}
              onClick={() => setCornerSquareType(type)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all hover-lift flex-1 ${
                cornersSquareOptions.type === type
                  ? "border-accent bg-accent/10 text-accent shadow-glow-pink"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
              title={label}
            >
              {preview}
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Corner Dot Styles */}
      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3">
          Corner Dot
        </p>
        <div className="flex gap-2">
          {CORNER_DOT_STYLES.map(({ type, label, preview }) => (
            <button
              key={type}
              onClick={() => setCornerDotType(type)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all hover-lift flex-1 ${
                cornersDotOptions.type === type
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-600 shadow-glow-cyan"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
              title={label}
            >
              {preview}
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Colors */}
      <ColorSection />
    </div>
  );
}
