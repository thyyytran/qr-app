"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useQRStore } from "@/store/qrStore";

export default function LogoUploader() {
  const { image, imageOptions, setLogo, removeLogo, setLogoSize } = useQRStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target?.result as string;
        setLogo(dataURL);
      };
      reader.readAsDataURL(file);
    },
    [setLogo]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
  });

  const logoSizePct = Math.round(imageOptions.imageSize * 100);

  return (
    <div className="flex flex-col gap-4">
      {!image ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-accent bg-accent/10"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isDragActive ? "bg-accent/20" : "bg-white/5"
              }`}
            >
              {/* Logo icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className={`w-5 h-5 transition-colors ${
                  isDragActive ? "text-accent" : "text-white/30"
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            </div>
            <p
              className={`text-sm font-medium ${
                isDragActive ? "text-accent" : "text-white/40"
              }`}
            >
              {isDragActive ? "Drop logo here" : "Upload a logo"}
            </p>
            <p className="text-white/25 text-xs">
              PNG or SVG with transparent background works best
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Logo preview */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-xl flex items-center justify-center border border-white/10 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-sm font-medium mb-1">Logo overlay active</p>
              <p className="text-white/30 text-xs">
                Error correction is set to H for best logo coverage
              </p>
              <button
                onClick={removeLogo}
                className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Remove logo
              </button>
            </div>
          </div>

          {/* Size slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs font-semibold uppercase tracking-wide">
                Logo Size
              </span>
              <span className="text-white/70 text-sm font-bold tabular-nums">
                {logoSizePct}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={35}
              step={1}
              value={logoSizePct}
              onChange={(e) => setLogoSize(Number(e.target.value) / 100)}
              className="w-full accent-accent"
            />
            <div className="flex justify-between text-white/20 text-xs">
              <span>10% (small)</span>
              <span>35% (large)</span>
            </div>
          </div>

          {/* Change logo */}
          <div
            {...getRootProps()}
            className="border border-dashed border-white/10 rounded-xl p-3 text-center cursor-pointer hover:border-white/20 transition-all"
          >
            <input {...getInputProps()} />
            <p className="text-white/30 text-xs">
              Drop a new logo here to replace
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
