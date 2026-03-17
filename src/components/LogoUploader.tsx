"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useQRStore } from "@/store/qrStore";

export default function LogoUploader() {
  const { image, imageOptions, setLogo, removeLogo, setLogoSize } = useQRStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      setRemoveError(null);
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target?.result as string);
      reader.readAsDataURL(file);
    },
    [previewUrl, setLogo]
  );

  const handleRemoveLogo = useCallback(() => {
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
    setRemoveError(null);
    removeLogo();
  }, [previewUrl, removeLogo]);

  const handleRemoveBackground = useCallback(async () => {
    if (!image) return;
    setIsRemoving(true);
    setRemoveError(null);
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      // Pass the stored data URL directly — library accepts string URLs
      const resultBlob = await removeBackground(image);
      // Convert blob → data URL so it can be stored and shared
      const dataURL = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(resultBlob);
      });
      // Revoke old object URL and switch preview to the new processed image
      if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
      setLogo(dataURL);
    } catch (err) {
      console.error("Background removal error:", err);
      setRemoveError("Could not remove background. Try a different image.");
    } finally {
      setIsRemoving(false);
    }
  }, [image, previewUrl, setLogo]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".svg"] },
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
          {/* Preview row */}
          <div className="flex items-center gap-4">
            {/* Checkerboard bg shows transparency */}
            <div
              className="relative w-16 h-16 flex-shrink-0 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden"
              style={{ backgroundImage: "linear-gradient(45deg,#e5e7eb 25%,transparent 25%,transparent 75%,#e5e7eb 75%),linear-gradient(45deg,#e5e7eb 25%,transparent 25%,transparent 75%,#e5e7eb 75%)", backgroundSize: "10px 10px", backgroundPosition: "0 0,5px 5px", backgroundColor: "#fff" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={displaySrc ?? ""} alt="Logo preview" className="max-w-full max-h-full object-contain p-1.5" />
              {isRemoving && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              )}
            </div>
            <div>
              <p className="text-gray-800 text-sm font-medium">Logo overlay active</p>
              <p className="text-gray-400 text-xs mt-0.5">Error correction set to H</p>
              <button onClick={handleRemoveLogo} className="mt-1.5 text-xs text-red-400 hover:text-red-600 transition-colors">
                Remove logo
              </button>
            </div>
          </div>

          {/* Remove background — full-width prominent button */}
          <button
            onClick={handleRemoveBackground}
            disabled={isRemoving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 bg-primary/5 text-primary text-sm font-semibold hover:bg-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRemoving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                Removing background…
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/>
                </svg>
                Remove Background
              </>
            )}
          </button>
          {isRemoving && (
            <p className="text-gray-400 text-xs text-center -mt-2">
              First run downloads a ~40 MB AI model — takes a moment
            </p>
          )}
          {removeError && <p className="text-red-500 text-xs">{removeError}</p>}

          {/* Size slider */}
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

          {/* Replace logo dropzone */}
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
