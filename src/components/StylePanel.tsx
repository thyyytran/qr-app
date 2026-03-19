"use client";

import { useQRStore } from "@/store/qrStore";
import { DotType, CornerSquareType, CornerDotType } from "@/types/qr";
import ColorSection from "./ColorSection";

interface DotOption {
  type: DotType;
  label: string;
  preview: React.ReactNode;
}

interface CornerSquareOption {
  type: CornerSquareType;
  label: string;
  preview: React.ReactNode;
}

interface CornerDotOption {
  type: CornerDotType;
  label: string;
  preview: React.ReactNode;
}

// ---- Dot shape previews ----
const sq = (rx = 0) => (
  <svg viewBox="0 0 24 24" className="w-7 h-7">
    <rect x="2" y="2" width="9" height="9" rx={rx} fill="currentColor"/>
    <rect x="13" y="2" width="9" height="9" rx={rx} fill="currentColor"/>
    <rect x="2" y="13" width="9" height="9" rx={rx} fill="currentColor"/>
    <rect x="13" y="13" width="9" height="9" rx={rx} fill="currentColor"/>
  </svg>
);

const heartSVG = (
  <svg viewBox="-1 -1 2 2" className="w-7 h-7">
    <path d="M 0 0.35 C -0.05 0.2 -0.5 0.08 -0.5 -0.15 C -0.5 -0.44 -0.22 -0.52 0 -0.24 C 0.22 -0.52 0.5 -0.44 0.5 -0.15 C 0.5 0.08 0.05 0.2 0 0.35 Z" fill="currentColor"/>
  </svg>
);

function StarPreview() {
  const pts = 5; const outer = 0.72; const inner = 0.3;
  const d = Array.from({ length: pts * 2 }, (_, i) => {
    const a = (i * Math.PI) / pts - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    return (i === 0 ? "M" : "L") + (Math.cos(a) * r).toFixed(3) + "," + (Math.sin(a) * r).toFixed(3);
  }).join(" ") + "Z";
  return (
    <svg viewBox="-1 -1 2 2" className="w-7 h-7">
      <path d={d} fill="currentColor"/>
    </svg>
  );
}

const diamondSVG = (
  <svg viewBox="-1 -1 2 2" className="w-7 h-7">
    <path d="M 0 -0.8 L 0.8 0 L 0 0.8 L -0.8 0 Z" fill="currentColor"/>
  </svg>
);

const leafSVG = (
  <svg viewBox="-1 -1 2 2" className="w-7 h-7">
    <path d="M 0 -0.68 C 0.68 -0.35 0.68 0.35 0 0.68 C -0.68 0.35 -0.68 -0.35 0 -0.68 Z" fill="currentColor"/>
  </svg>
);

const DOT_STYLES: DotOption[] = [
  { type: "square", label: "Square", preview: sq(0) },
  { type: "rounded", label: "Rounded", preview: sq(2) },
  { type: "dots", label: "Circle", preview: sq(5) },
  { type: "extra-rounded", label: "Pill", preview: sq(4) },
  { type: "heart", label: "Heart", preview: heartSVG },
  { type: "star", label: "Star", preview: <StarPreview /> },
  { type: "diamond", label: "Diamond", preview: diamondSVG },
  { type: "leaf", label: "Leaf", preview: leafSVG },
];

const CORNER_SQUARE_STYLES: CornerSquareOption[] = [
  {
    type: "square",
    label: "Square",
    preview: (
      <svg viewBox="0 0 20 20" className="w-6 h-6">
        <rect x="1" y="1" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3"/>
        <rect x="5" y="5" width="10" height="10" fill="currentColor"/>
      </svg>
    ),
  },
  {
    type: "extra-rounded",
    label: "Round",
    preview: (
      <svg viewBox="0 0 20 20" className="w-6 h-6">
        <rect x="1" y="1" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="3"/>
        <rect x="5" y="5" width="10" height="10" rx="2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    type: "dot",
    label: "Circle",
    preview: (
      <svg viewBox="0 0 20 20" className="w-6 h-6">
        <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="3"/>
        <circle cx="10" cy="10" r="4.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    type: "heart",
    label: "Heart",
    preview: (
      <svg viewBox="-1 -1 2 2" className="w-6 h-6">
        <path d="M 0 0.35 C -0.05 0.2 -0.5 0.08 -0.5 -0.15 C -0.5 -0.44 -0.22 -0.52 0 -0.24 C 0.22 -0.52 0.5 -0.44 0.5 -0.15 C 0.5 0.08 0.05 0.2 0 0.35 Z" fill="none" stroke="currentColor" strokeWidth="0.12"/>
        <path d="M 0 0.1 C -0.02 0.05 -0.22 -0.02 -0.22 -0.12 C -0.22 -0.24 -0.1 -0.27 0 -0.14 C 0.1 -0.27 0.22 -0.24 0.22 -0.12 C 0.22 -0.02 0.02 0.05 0 0.1 Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    type: "star",
    label: "Star",
    preview: (() => {
      const pts = 5; const outer = 0.72; const inner = 0.3;
      const d = Array.from({ length: pts * 2 }, (_, i) => {
        const a = (i * Math.PI) / pts - Math.PI / 2;
        const r = i % 2 === 0 ? outer : inner;
        return (i === 0 ? "M" : "L") + (Math.cos(a) * r).toFixed(3) + "," + (Math.sin(a) * r).toFixed(3);
      }).join(" ") + "Z";
      const ds = Array.from({ length: pts * 2 }, (_, i) => {
        const a = (i * Math.PI) / pts - Math.PI / 2;
        const r = i % 2 === 0 ? outer * 0.44 : inner * 0.44;
        return (i === 0 ? "M" : "L") + (Math.cos(a) * r).toFixed(3) + "," + (Math.sin(a) * r).toFixed(3);
      }).join(" ") + "Z";
      return (
        <svg viewBox="-1 -1 2 2" className="w-6 h-6">
          <path d={d} fill="none" stroke="currentColor" strokeWidth="0.12"/>
          <path d={ds} fill="currentColor"/>
        </svg>
      );
    })(),
  },
];

const CORNER_DOT_STYLES: CornerDotOption[] = [
  {
    type: "square",
    label: "Square",
    preview: (
      <svg viewBox="0 0 20 20" className="w-6 h-6">
        <rect x="4" y="4" width="12" height="12" fill="currentColor"/>
      </svg>
    ),
  },
  {
    type: "dot",
    label: "Circle",
    preview: (
      <svg viewBox="0 0 20 20" className="w-6 h-6">
        <circle cx="10" cy="10" r="6" fill="currentColor"/>
      </svg>
    ),
  },
];

export default function StylePanel() {
  const {
    dotsOptions, cornersSquareOptions, cornersDotOptions,
    setDotType, setCornerSquareType, setCornerDotType,
  } = useQRStore();

  return (
    <div className="flex flex-col gap-6">

      {/* Dot Styles */}
      <div>
        <p className="section-label mb-3">Dot Shape</p>
        <div className="grid grid-cols-4 gap-2">
          {DOT_STYLES.map(({ type, label, preview }) => (
            <button
              key={type}
              onClick={() => setDotType(type)}
              title={label}
              className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border text-xs font-semibold transition-all hover-lift ${
                dotsOptions.type === type
                  ? "border-primary bg-primary/8 text-primary shadow-glow"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {preview}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Corner Frame */}
      <div>
        <p className="section-label mb-3">Corner Frame</p>
        <div className="grid grid-cols-5 gap-2">
          {CORNER_SQUARE_STYLES.map(({ type, label, preview }) => (
            <button
              key={type}
              onClick={() => setCornerSquareType(type)}
              title={label}
              className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border text-xs font-semibold transition-all hover-lift ${
                cornersSquareOptions.type === type
                  ? "border-primary bg-primary/8 text-primary shadow-glow"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {preview}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Corner Dot */}
      <div>
        <p className="section-label mb-3">Corner Dot</p>
        <div className="flex gap-2">
          {CORNER_DOT_STYLES.map(({ type, label, preview }) => (
            <button
              key={type}
              onClick={() => setCornerDotType(type)}
              title={label}
              className={`flex flex-col items-center gap-1.5 py-2.5 flex-1 rounded-xl border text-xs font-semibold transition-all hover-lift ${
                cornersDotOptions.type === type
                  ? "border-primary bg-primary/8 text-primary shadow-glow"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {preview}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100" />
      <ColorSection />
    </div>
  );
}
