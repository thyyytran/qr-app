"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useQRStore } from "@/store/qrStore";

function upscaleLogo(dataURL: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Only upscale if smaller than 512 — if already larger, keep original
      if (img.naturalWidth >= 512 && img.naturalHeight >= 512) {
        resolve(dataURL);
        return;
      }
      const SIZE = 512;
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataURL);
        return;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      // Maintain aspect ratio with letterboxing
      const scale = Math.min(SIZE / img.naturalWidth, SIZE / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(dataURL);
    img.src = dataURL;
  });
}

export default function LogoUploader() {
  const { image, imageOptions, setLogo, removeLogo, setLogoSize } = useQRStore();
  // Keep original file URL for crisp preview display
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataURL = e.target?.result as string;
        const upscaled = await upscaleLogo(dataURL);
        setLogo(upscaled);
      };
      reader.readAsDataURL(file);
    },
    [setLogo]
  );

  const handleRemove = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    removeLogo();
  }, [previewUrl, removeLogo]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
  });

  const logoSizePct = Math.round(imageOptions.imageSize * 100);
  const displaySrc = previewUrl ?? image;

  return (
    <div className="flex flex-col gap-4">
      {!image ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-gray-300 bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isDragActive ? "bg-primary/10" : "bg-gray-100"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className={`w-5 h-5 transition-colors ${
                  isDragActive ? "text-primary" : "text-gray-400"
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
                isDragActive ? "text-primary" : "text-gray-500"
              }`}
            >
              {isDragActive ? "Drop logo here" : "Upload a logo"}
            </p>
            <p className="text-gray-400 text-xs">
              PNG or SVG with transparent background works best
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Logo preview — use original object URL for sharpness */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-xl flex items-center justify-center border border-gray-200 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displaySrc ?? ""}
                alt="Logo"
                className="w-full h-full object-contain"
                style={{ imageRendering: "auto" }}
              />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 text-sm font-medium mb-1">Logo overlay active</p>
              <p className="text-gray-400 text-xs">
                Error correction is set to H for best logo coverage
              </p>
              <button
                onClick={handleRemove}
                className="mt-2 text-xs text-red-500 hover:text-red-600 transition-colors"
              >
                Remove logo
              </button>
            </div>
          </div>

          {/* Size slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                Logo Size
              </span>
              <span className="text-gray-700 text-sm font-bold tabular-nums">
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
              className="w-full accent-primary h-2"
            />
            <div className="flex justify-between text-gray-400 text-xs">
              <span>10% (small)</span>
              <span>35% (large)</span>
            </div>
          </div>

          {/* Change logo */}
          <div
            {...getRootProps()}
            className="border border-dashed border-gray-200 rounded-xl p-3 text-center cursor-pointer hover:border-gray-300 transition-all bg-gray-50"
          >
            <input {...getInputProps()} />
            <p className="text-gray-400 text-xs">
              Drop a new logo here to replace
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
