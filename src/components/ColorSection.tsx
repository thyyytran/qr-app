"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { HexColorPicker } from "react-colorful";
import { useQRStore } from "@/store/qrStore";

function ColorPickerPopover({
  color, onChange, label,
}: {
  color: string; onChange: (c: string) => void; label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600 text-sm">{label}</span>
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-all"
        >
          <div className="w-5 h-5 rounded-md border border-gray-200" style={{ backgroundColor: color }}/>
          <span className="text-xs text-gray-600 font-mono uppercase">{color}</span>
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-2 z-50 rounded-xl shadow-lg border border-gray-200 bg-white p-3 animate-slide-up">
            <HexColorPicker color={color} onChange={onChange}/>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-gray-400 text-xs font-mono">#</span>
              <input
                type="text"
                value={color.replace("#", "")}
                onChange={(e) => {
                  if (/^[0-9A-Fa-f]{0,6}$/.test(e.target.value) && e.target.value.length === 6)
                    onChange("#" + e.target.value);
                }}
                className="flex-1 bg-gray-50 text-gray-800 text-xs font-mono px-2 py-1 rounded border border-gray-200 outline-none"
                maxLength={6} placeholder="2563EB"
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
    dotsOptions, cornersSquareOptions, cornersDotOptions, backgroundOptions,
    useGradient, setDotColor, setDotGradient, setCornerSquareColor,
    setCornerDotColor, setBackgroundColor, setUseGradient,
  } = useQRStore();

  const [gradRot, setGradRot] = useState(dotsOptions.gradient?.rotation ?? 45);
  const [gradType, setGradType] = useState<"linear" | "radial">(dotsOptions.gradient?.type ?? "linear");
  const [c1, setC1] = useState(dotsOptions.gradient?.colorStops[0]?.color ?? dotsOptions.color);
  const [c2, setC2] = useState(dotsOptions.gradient?.colorStops[1]?.color ?? "#60A5FA");

  const pushGrad = useCallback(
    (nc1 = c1, nc2 = c2, rot = gradRot, type = gradType) =>
      setDotGradient({ type, rotation: type === "linear" ? rot : undefined, colorStops: [{ offset: 0, color: nc1 }, { offset: 1, color: nc2 }] }),
    [c1, c2, gradRot, gradType, setDotGradient]
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="section-label">Colors</p>

      {/* Dot color */}
      <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 text-sm font-medium">Dot Color</span>
          <div className="flex gap-0.5 bg-gray-200 rounded-lg p-0.5">
            {(["Solid", "Gradient"] as const).map((label) => {
              const active = label === "Solid" ? !useGradient : useGradient;
              return (
                <button
                  key={label}
                  onClick={() => setUseGradient(label === "Gradient")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    active ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {!useGradient ? (
          <ColorPickerPopover color={dotsOptions.color} onChange={setDotColor} label="Color"/>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Type</span>
              <div className="flex gap-0.5 bg-gray-200 rounded-lg p-0.5">
                {(["linear", "radial"] as const).map((t) => (
                  <button key={t} onClick={() => { setGradType(t); pushGrad(c1, c2, gradRot, t); }}
                    className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                      gradType === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ColorPickerPopover color={c1} label="Start" onChange={(v) => { setC1(v); pushGrad(v, c2, gradRot, gradType); }}/>
            <ColorPickerPopover color={c2} label="End" onChange={(v) => { setC2(v); pushGrad(c1, v, gradRot, gradType); }}/>
            <div className="h-5 rounded-lg border border-gray-200" style={{
              background: gradType === "linear"
                ? `linear-gradient(${gradRot}deg, ${c1}, ${c2})`
                : `radial-gradient(circle, ${c1}, ${c2})`,
            }}/>
            {gradType === "linear" && (
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm flex-shrink-0">Angle</span>
                <input type="range" min={0} max={360} value={gradRot}
                  onChange={(e) => { setGradRot(+e.target.value); pushGrad(c1, c2, +e.target.value, gradType); }}
                  className="flex-1 accent-primary"/>
                <span className="text-gray-400 text-xs w-8 text-right tabular-nums">{gradRot}°</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Corner colors */}
      <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
        <span className="text-gray-700 text-sm font-medium">Corner Colors</span>
        <ColorPickerPopover color={cornersSquareOptions.color} onChange={setCornerSquareColor} label="Frame"/>
        <ColorPickerPopover color={cornersDotOptions.color} onChange={setCornerDotColor} label="Dot"/>
      </div>

      {/* Background */}
      <div className="bg-gray-50 rounded-xl p-4">
        <ColorPickerPopover color={backgroundOptions.color} onChange={setBackgroundColor} label="Background"/>
      </div>
    </div>
  );
}
