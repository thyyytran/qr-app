"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useQRStore } from "@/store/qrStore";

function upscaleLogo(dataURL: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
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
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataURL;
  });
}

export default function LogoUploader() {
  const { image, imageOptions, setLogo, removeLogo, setLogoSize } = useQRStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataURL = e.target?.result as string;
        try {
          const upscaled = await upscaleLogo(dataURL);
          setLogo(upscaled);
        } catch {
          setLogo(dataURL);
        }
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
              ? "border-accent bg-accent/5"
              : "border-gray-200 hover:border-gray-300 bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isDragActive ? "bg-accent/10" : "bg-gray-100"
              }`}
            >
              {/* Logo icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className={`w-5 h-5 transition-colors ${
                  isDragActive ? "text-accent" : "text-gray-400"
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
                isDragActive ? "text-accent" : "text-gray-500"
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
          {/* Logo preview */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-xl flex items-center justify-center border border-gray-200 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 text-sm font-medium mb-1">Logo overlay active</p>
              <p className="text-gray-400 text-xs">
                Error correction is set to H for best logo coverage
              </p>
              <button
                onClick={removeLogo}
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
              className="w-full accent-accent"
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
