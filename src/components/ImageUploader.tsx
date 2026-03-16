"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useQRStore } from "@/store/qrStore";

function rgbToHex([r, g, b]: number[]): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export default function ImageUploader() {
  const { setSourcePalette, applyPalette, sourceImagePalette } = useQRStore();
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(async (file: File) => {
    setIsProcessing(true); setError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataURL = e.target?.result as string;
      setThumbnail(dataURL);
      const img = new Image();
      img.onload = async () => {
        try {
          const mod = await import("color-thief-browser");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const CT = (mod.default ?? mod) as any;
          const thief = new CT();
          const dominant: number[] = thief.getColor(img);
          const raw: number[][] = thief.getPalette(img, 6);
          const palette = [rgbToHex(dominant), ...raw.filter((c) => rgbToHex(c) !== rgbToHex(dominant)).slice(0, 5).map(rgbToHex)];
          setSourcePalette(palette);
        } catch { setError("Could not extract colors."); }
        finally { setIsProcessing(false); }
      };
      img.onerror = () => { setError("Could not load image."); setIsProcessing(false); };
      img.crossOrigin = "anonymous"; img.src = dataURL;
    };
    reader.onerror = () => { setError("Could not read file."); setIsProcessing(false); };
    reader.readAsDataURL(file);
  }, [setSourcePalette]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback((files: File[]) => { if (files.length) processImage(files[0]); }, [processImage]),
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
    multiple: false, maxSize: 10 * 1024 * 1024,
  });

  return (
    <div className="flex flex-col gap-4">
      {!thumbnail ? (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/40 bg-gray-50"
        }`}>
          <input {...getInputProps()}/>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDragActive ? "bg-primary/10" : "bg-gray-100"}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
                className={`w-5 h-5 ${isDragActive ? "text-primary" : "text-gray-400"}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
              </svg>
            </div>
            <p className={`text-sm font-medium ${isDragActive ? "text-primary" : "text-gray-500"}`}>
              {isDragActive ? "Drop image here" : "Drag & drop an image"}
            </p>
            <p className="text-gray-400 text-xs">JPG, PNG, GIF, WebP up to 10MB</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 items-start">
          <div className="relative w-20 h-20 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnail} alt="Uploaded" className="w-full h-full object-cover rounded-xl border border-gray-200"/>
            <button onClick={() => { setThumbnail(null); setSourcePalette([]); setError(null); }}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-3 h-3">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            {isProcessing ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"/>
                Extracting colors...
              </div>
            ) : error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : sourceImagePalette.length > 0 ? (
              <>
                <p className="section-label">Extracted Palette</p>
                <div className="flex flex-wrap gap-2">
                  {sourceImagePalette.map((color, i) => (
                    <div key={i} className="w-7 h-7 rounded-lg border-2 border-white shadow cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: color }} title={color}/>
                  ))}
                </div>
                <button onClick={applyPalette} className="mt-1 px-4 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary-700 hover-lift transition-all">
                  Apply Palette to QR
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
