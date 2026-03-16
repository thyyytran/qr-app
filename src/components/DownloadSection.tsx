"use client";

import { useState, useRef, useEffect } from "react";
import { useQRStore } from "@/store/qrStore";
import type QRCodeStylingType from "qr-code-styling";

const SIZE_OPTIONS = [
  { label: "Small", value: 600 },
  { label: "Medium", value: 1200 },
  { label: "Large", value: 2400 },
];

export default function DownloadSection() {
  const store = useQRStore();
  const [selectedSize, setSelectedSize] = useState(1200);
  const [isDownloading, setIsDownloading] = useState<"png" | "svg" | null>(null);
  const qrRef = useRef<QRCodeStylingType | null>(null);

  // Build a fresh QR instance for download at the desired resolution
  const download = async (extension: "png" | "svg") => {
    setIsDownloading(extension);

    try {
      const { default: QRCodeStyling } = await import("qr-code-styling");

      const scale = selectedSize / (store.width || 400);
      const qr = new QRCodeStyling({
        width: selectedSize,
        height: selectedSize,
        data: store.data || "https://qrcraft.app",
        margin: Math.round(store.margin * scale),
        qrOptions: {
          errorCorrectionLevel: store.errorCorrectionLevel,
        },
        dotsOptions: store.dotsOptions,
        cornersSquareOptions: store.cornersSquareOptions,
        cornersDotOptions: store.cornersDotOptions,
        backgroundOptions: store.backgroundOptions,
        ...(store.image ? { image: store.image } : {}),
        imageOptions: {
          ...store.imageOptions,
          margin: Math.round(store.imageOptions.margin * scale),
        },
      });

      qrRef.current = qr;

      await qr.download({
        name: "qrcraft",
        extension,
      });
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setIsDownloading(null);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useEffect(() => () => { qrRef.current = null; }, []);

  const isDisabled = !store.data;

  return (
    <div className="flex flex-col gap-4">
      {/* Size selector */}
      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">
          Resolution
        </p>
        <div className="flex gap-2">
          {SIZE_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSelectedSize(value)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                selectedSize === value
                  ? "bg-primary/10 border-primary text-primary shadow-glow"
                  : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {label}
              <span className="block text-[10px] font-normal opacity-60">
                {value}px
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Download buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => download("png")}
          disabled={isDisabled || isDownloading !== null}
          className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-primary text-white shadow-glow hover-lift disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none transition-all"
        >
          {isDownloading === "png" ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              PNG
            </>
          )}
        </button>

        <button
          onClick={() => download("svg")}
          disabled={isDisabled || isDownloading !== null}
          className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:border-primary/40 hover:text-primary hover-lift disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none transition-all"
        >
          {isDownloading === "svg" ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              SVG
            </>
          )}
        </button>
      </div>

      {isDisabled && (
        <p className="text-gray-400 text-xs text-center">
          Enter a URL to enable downloads
        </p>
      )}
    </div>
  );
}
