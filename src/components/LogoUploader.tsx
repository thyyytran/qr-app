"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useQRStore } from "@/store/qrStore";

export default function LogoUploader() {
  const { image, imageOptions, setLogo, removeLogo, setLogoSize } = useQRStore();
  // Keep an object URL of the original file for a crisp preview
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      // Object URL → sharp preview at any size
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Read as data URL so it can be stored in state / shared
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target?.result as string;
        setLogo(dataURL);
      };
      reader.readAsDataURL(file);
    },
    [previewUrl, setLogo]
  );

  const handleRemove = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    removeLogo();
  }, [previewUrl, removeLogo]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".svg"] },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
  });

  const logoSizePct = Math.round(imageOptions.imageSize * 100);
  // Prefer the original object URL; fall back to the stored data URL
  const displaySrc = previewUrl ?? image;

  return (
    <div className="flex flex-col gap-4">
      {!image ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-primary/40 bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDragActive ? "bg-primary/10" : "bg-gray-100"}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
                className={`w-5 h-5 ${isDragActive ? "text-primary" : "text-gray-400"}`}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
              </svg>
            </div>
            <p className={`text-sm font-medium ${isDragActive ? "text-primary" : "text-gray-500"}`}>
              {isDragActive ? "Drop logo here" : "Upload a logo"}
            </p>
            <p className="text-gray-400 text-xs">PNG or SVG with transparent background works best</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {/* Preview at 80×80 using the original file object URL */}
            <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-xl border border-gray-200 p-2 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displaySrc ?? ""}
                alt="Logo preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 text-sm font-medium mb-0.5">Logo overlay active</p>
              <p className="text-gray-400 text-xs">Error correction set to H for best coverage</p>
              <button onClick={handleRemove} className="mt-2 text-xs text-red-500 hover:text-red-600">
                Remove logo
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="section-label">Logo Size</span>
              <span className="text-gray-700 text-sm font-bold tabular-nums">{logoSizePct}%</span>
            </div>
            <input
              type="range" min={10} max={35} step={1} value={logoSizePct}
              onChange={(e) => setLogoSize(Number(e.target.value) / 100)}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-gray-400 text-xs">
              <span>10% — small</span>
              <span>35% — large</span>
            </div>
          </div>

          <div
            {...getRootProps()}
            className="border border-dashed border-gray-200 rounded-xl p-3 text-center cursor-pointer hover:border-primary/40 bg-gray-50 transition-all"
          >
            <input {...getInputProps()} />
            <p className="text-gray-400 text-xs">Drop a new logo to replace</p>
          </div>
        </div>
      )}
    </div>
  );
}
