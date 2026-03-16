"use client";

import { useState } from "react";
import { useQRStore } from "@/store/qrStore";
import { isCustomDotType } from "@/types/qr";

const SIZE_OPTIONS = [
  { label: "Small", value: 600 },
  { label: "Medium", value: 1200 },
  { label: "Large", value: 2400 },
];

export default function DownloadSection() {
  const store = useQRStore();
  const [selectedSize, setSelectedSize] = useState(1200);
  const [isDownloading, setIsDownloading] = useState<"png" | "svg" | null>(null);

  const downloadCustomSVG = async (extension: "png" | "svg") => {
    const { getQRMatrix, buildCustomQRSVG } = await import("@/lib/customQR");
    const matrix = await getQRMatrix(
      store.data || "https://qrcraft.app",
      store.errorCorrectionLevel
    );
    const svgStr = buildCustomQRSVG(matrix.data, matrix.size, {
      size: selectedSize,
      margin: Math.round(store.margin * (selectedSize / (store.width || 400))),
      dotType: store.dotsOptions.type as import("@/types/qr").CustomDotType,
      dotsColor: store.dotsOptions.color,
      gradient: store.useGradient ? store.dotsOptions.gradient : undefined,
      backgroundColor: store.backgroundOptions.color,
      cornerSquareColor: store.cornersSquareOptions.color,
      cornerDotColor: store.cornersDotOptions.color,
      cornerSquareType: store.cornersSquareOptions.type,
      image: store.image,
      imageSize: store.imageOptions.imageSize,
    });

    if (extension === "svg") {
      const blob = new Blob([svgStr], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "qrcraft.svg"; a.click();
      URL.revokeObjectURL(url);
    } else {
      // SVG → Canvas → PNG
      const img = new Image();
      const blob = new Blob([svgStr], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = selectedSize; canvas.height = selectedSize;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        canvas.toBlob((b) => {
          if (!b) return;
          const pngUrl = URL.createObjectURL(b);
          const a = document.createElement("a");
          a.href = pngUrl; a.download = "qrcraft.png"; a.click();
          URL.revokeObjectURL(pngUrl);
        }, "image/png");
      };
      img.src = url;
    }
  };

  const download = async (extension: "png" | "svg") => {
    setIsDownloading(extension);
    try {
      if (isCustomDotType(store.dotsOptions.type)) {
        await downloadCustomSVG(extension);
      } else {
        const { default: QRCodeStyling } = await import("qr-code-styling");
        const scale = selectedSize / (store.width || 400);
        const qr = new QRCodeStyling({
          width: selectedSize, height: selectedSize,
          data: store.data || "https://qrcraft.app",
          margin: Math.round(store.margin * scale),
          qrOptions: { errorCorrectionLevel: store.errorCorrectionLevel },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dotsOptions: store.dotsOptions as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cornersSquareOptions: store.cornersSquareOptions as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cornersDotOptions: store.cornersDotOptions as any,
          backgroundOptions: store.backgroundOptions,
          ...(store.image ? { image: store.image } : {}),
          imageOptions: { ...store.imageOptions, margin: Math.round(store.imageOptions.margin * scale) },
        });
        await qr.download({ name: "qrcraft", extension });
      }
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setIsDownloading(null);
    }
  };

  const isDisabled = !store.data;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="section-label mb-2">Resolution</p>
        <div className="flex gap-2">
          {SIZE_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSelectedSize(value)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                selectedSize === value
                  ? "bg-primary/8 border-primary text-primary"
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {label}
              <span className="block text-[10px] font-normal opacity-60">{value}px</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => download("png")}
          disabled={isDisabled || isDownloading !== null}
          className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-700 hover-lift disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {isDownloading === "png" ? (
            <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"/>Exporting...</>
          ) : (
            <><DownloadIcon/>PNG</>
          )}
        </button>
        <button
          onClick={() => download("svg")}
          disabled={isDisabled || isDownloading !== null}
          className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:border-primary/40 hover:text-primary hover-lift disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {isDownloading === "svg" ? (
            <><div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"/>Exporting...</>
          ) : (
            <><DownloadIcon/>SVG</>
          )}
        </button>
      </div>

      {isDisabled && (
        <p className="text-gray-400 text-xs text-center">Enter a URL to enable downloads</p>
      )}
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
    </svg>
  );
}
