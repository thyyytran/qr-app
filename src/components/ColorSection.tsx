"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { HexColorPicker } from "react-colorful";
import { useQRStore } from "@/store/qrStore";

interface ColorPickerPopoverProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

function ColorPickerPopover({ color, onChange, label }: ColorPickerPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="flex items-center justify-between">
      <span className="text-white/60 text-sm">{label}</span>
      <div ref={ref} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition-all"
        >
          <div
            className="w-5 h-5 rounded-md border border-white/20"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs text-white/60 font-mono uppercase">{color}</span>
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 z-50 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-surface p-3 animate-slide-up">
            <HexColorPicker color={color} onChange={onChange} />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-white/40 text-xs font-mono">#</span>
              <input
                type="text"
                value={color.replace("#", "")}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^[0-9A-Fa-f]{0,6}$/.test(val)) {
                    if (val.length === 6) onChange("#" + val);
                  }
                }}
                className="flex-1 bg-surface-secondary text-white/80 text-xs font-mono px-2 py-1 rounded-md border border-white/10 outline-none"
                maxLength={6}
                placeholder="7C3AED"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ColorSection() {
  const {
    dotsOptions,
    cornersSquareOptions,
    cornersDotOptions,
    backgroundOptions,
    useGradient,
    setDotColor,
    setDotGradient,
    setCornerSquareColor,
    setCornerDotColor,
    setBackgroundColor,
    setUseGradient,
  } = useQRStore();

  const [gradientRotation, setGradientRotation] = useState(
    dotsOptions.gradient?.rotation ?? 45
  );
  const [gradientType, setGradientType] = useState<"linear" | "radial">(
    dotsOptions.gradient?.type ?? "linear"
  );
  const [gradientColor1, setGradientColor1] = useState(
    dotsOptions.gradient?.colorStops[0]?.color ?? dotsOptions.color
  );
  const [gradientColor2, setGradientColor2] = useState(
    dotsOptions.gradient?.colorStops[1]?.color ?? "#EC4899"
  );

  const updateGradient = useCallback(
    (
      c1: string = gradientColor1,
      c2: string = gradientColor2,
      rot: number = gradientRotation,
      gType: "linear" | "radial" = gradientType
    ) => {
      setDotGradient({
        type: gType,
        rotation: gType === "linear" ? rot : undefined,
        colorStops: [
          { offset: 0, color: c1 },
          { offset: 1, color: c2 },
        ],
      });
    },
    [gradientColor1, gradientColor2, gradientRotation, gradientType, setDotGradient]
  );

  const handleGradientColor1 = (c: string) => {
    setGradientColor1(c);
    updateGradient(c, gradientColor2, gradientRotation, gradientType);
  };

  const handleGradientColor2 = (c: string) => {
    setGradientColor2(c);
    updateGradient(gradientColor1, c, gradientRotation, gradientType);
  };

  const handleGradientRotation = (rot: number) => {
    setGradientRotation(rot);
    updateGradient(gradientColor1, gradientColor2, rot, gradientType);
  };

  const handleGradientType = (gType: "linear" | "radial") => {
    setGradientType(gType);
    updateGradient(gradientColor1, gradientColor2, gradientRotation, gType);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">
        Colors
      </p>

      {/* Dot color — solid/gradient toggle */}
      <div className="bg-surface-secondary rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-sm font-medium">Dot Color</span>
          <div className="flex gap-1 bg-surface rounded-lg p-1">
            <button
              onClick={() => setUseGradient(false)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                !useGradient
                  ? "bg-primary text-white shadow-glow"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              Solid
            </button>
            <button
              onClick={() => setUseGradient(true)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                useGradient
                  ? "bg-primary text-white shadow-glow"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              Gradient
            </button>
          </div>
        </div>

        {!useGradient ? (
          <ColorPickerPopover
            color={dotsOptions.color}
            onChange={setDotColor}
            label="Color"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {/* Gradient type */}
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Type</span>
              <div className="flex gap-1 bg-surface rounded-lg p-1">
                <button
                  onClick={() => handleGradientType("linear")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    gradientType === "linear"
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/60"
                  }`}
                >
                  Linear
                </button>
                <button
                  onClick={() => handleGradientType("radial")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    gradientType === "radial"
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/60"
                  }`}
                >
                  Radial
                </button>
              </div>
            </div>

            {/* Colors */}
            <ColorPickerPopover
              color={gradientColor1}
              onChange={handleGradientColor1}
              label="Start color"
            />
            <ColorPickerPopover
              color={gradientColor2}
              onChange={handleGradientColor2}
              label="End color"
            />

            {/* Gradient preview */}
            <div
              className="h-6 rounded-lg border border-white/10"
              style={{
                background:
                  gradientType === "linear"
                    ? `linear-gradient(${gradientRotation}deg, ${gradientColor1}, ${gradientColor2})`
                    : `radial-gradient(circle, ${gradientColor1}, ${gradientColor2})`,
              }}
            />

            {/* Rotation (linear only) */}
            {gradientType === "linear" && (
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm flex-shrink-0">
                  Angle
                </span>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={gradientRotation}
                  onChange={(e) => handleGradientRotation(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="text-white/40 text-xs w-8 text-right tabular-nums">
                  {gradientRotation}°
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Corner colors */}
      <div className="bg-surface-secondary rounded-xl p-4 flex flex-col gap-3">
        <span className="text-white/70 text-sm font-medium">Corner Colors</span>
        <ColorPickerPopover
          color={cornersSquareOptions.color}
          onChange={setCornerSquareColor}
          label="Frame color"
        />
        <ColorPickerPopover
          color={cornersDotOptions.color}
          onChange={setCornerDotColor}
          label="Dot color"
        />
      </div>

      {/* Background color */}
      <div className="bg-surface-secondary rounded-xl p-4">
        <ColorPickerPopover
          color={backgroundOptions.color}
          onChange={setBackgroundColor}
          label="Background"
        />
      </div>
    </div>
  );
}
