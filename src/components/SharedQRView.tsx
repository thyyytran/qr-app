"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QRConfig, isCustomDotType } from "@/types/qr";
import type QRCodeStylingType from "qr-code-styling";

interface SharedQRViewProps {
  config: QRConfig;
}

export default function SharedQRView({ config }: SharedQRViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRCodeStylingType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customSVG, setCustomSVG] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<"png" | "svg" | null>(null);

  const isCustom = isCustomDotType(config.dotsOptions.type);

  useEffect(() => {
    let cancelled = false;

    if (isCustom) {
      import("@/lib/customQR").then(({ getQRMatrix, buildCustomQRSVG }) =>
        getQRMatrix(config.data, config.errorCorrectionLevel).then((matrix) => {
          if (cancelled) return;
          const svg = buildCustomQRSVG(matrix.data, matrix.size, {
            size: 400,
            margin: config.margin,
            dotType: config.dotsOptions.type as import("@/types/qr").CustomDotType,
            dotsColor: config.dotsOptions.color,
            gradient: config.dotsOptions.gradient,
            backgroundColor: config.backgroundOptions.color,
            cornerSquareColor: config.cornersSquareOptions.color,
            cornerDotColor: config.cornersDotOptions.color,
            cornerSquareType: config.cornersSquareOptions.type,
            image: config.image,
            imageSize: config.imageOptions.imageSize,
          });
          setCustomSVG(svg);
          setIsLoading(false);
        })
      );
    } else {
      import("qr-code-styling").then(({ default: QRCodeStyling }) => {
        if (cancelled || !containerRef.current) return;
        const qr = new QRCodeStyling({
          width: 400, height: 400, data: config.data, margin: config.margin,
          qrOptions: { errorCorrectionLevel: config.errorCorrectionLevel },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dotsOptions: config.dotsOptions as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cornersSquareOptions: config.cornersSquareOptions as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cornersDotOptions: config.cornersDotOptions as any,
          backgroundOptions: config.backgroundOptions,
          ...(config.image ? { image: config.image } : {}),
          imageOptions: config.imageOptions,
        });
        qrInstanceRef.current = qr;
        containerRef.current.innerHTML = "";
        qr.append(containerRef.current);
        setIsLoading(false);
      });
    }

    return () => { cancelled = true; };
  }, [config, isCustom]);

  const download = async (extension: "png" | "svg") => {
    setIsDownloading(extension);
    try {
      if (isCustom) {
        const { getQRMatrix, buildCustomQRSVG } = await import("@/lib/customQR");
        const matrix = await getQRMatrix(config.data, config.errorCorrectionLevel);
        const svgStr = buildCustomQRSVG(matrix.data, matrix.size, {
          size: 1200, margin: config.margin * 3,
          dotType: config.dotsOptions.type as import("@/types/qr").CustomDotType,
          dotsColor: config.dotsOptions.color,
          gradient: config.dotsOptions.gradient,
          backgroundColor: config.backgroundOptions.color,
          cornerSquareColor: config.cornersSquareOptions.color,
          cornerDotColor: config.cornersDotOptions.color,
          cornerSquareType: config.cornersSquareOptions.type,
          image: config.image,
          imageSize: config.imageOptions.imageSize,
        });
        if (extension === "svg") {
          const blob = new Blob([svgStr], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = "qrcraft-shared.svg"; a.click();
          URL.revokeObjectURL(url);
        } else {
          const img = new Image();
          const blob = new Blob([svgStr], { type: "image/svg+xml" });
          const blobUrl = URL.createObjectURL(blob);
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 1200; canvas.height = 1200;
            canvas.getContext("2d")!.drawImage(img, 0, 0);
            URL.revokeObjectURL(blobUrl);
            canvas.toBlob((b) => {
              if (!b) return;
              const u = URL.createObjectURL(b);
              const a = document.createElement("a");
              a.href = u; a.download = "qrcraft-shared.png"; a.click();
              URL.revokeObjectURL(u);
            }, "image/png");
          };
          img.src = blobUrl;
        }
      } else {
        const { default: QRCodeStyling } = await import("qr-code-styling");
        const qr = new QRCodeStyling({
          width: 1200, height: 1200, data: config.data, margin: config.margin * 3,
          qrOptions: { errorCorrectionLevel: config.errorCorrectionLevel },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dotsOptions: config.dotsOptions as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cornersSquareOptions: config.cornersSquareOptions as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cornersDotOptions: config.cornersDotOptions as any,
          backgroundOptions: config.backgroundOptions,
          ...(config.image ? { image: config.image } : {}),
          imageOptions: config.imageOptions,
        });
        await qr.download({ name: "qrcraft-shared", extension });
      }
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setIsDownloading(null);
    }
  };

  const PREVIEW = 320;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="flex items-center gap-2 mb-12 hover:opacity-75 transition-opacity">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <rect x="3" y="3" width="7" height="7" rx="1" fill="white"/>
            <rect x="14" y="3" width="7" height="7" rx="1" fill="white"/>
            <rect x="3" y="14" width="7" height="7" rx="1" fill="white"/>
            <rect x="14" y="14" width="3" height="3" rx="0.5" fill="white"/>
            <rect x="18" y="14" width="3" height="3" rx="0.5" fill="white"/>
            <rect x="14" y="18" width="3" height="3" rx="0.5" fill="white"/>
            <rect x="18" y="18" width="3" height="3" rx="0.5" fill="white"/>
          </svg>
        </div>
        <span className="font-heading font-bold text-lg text-gray-900">QRcraft</span>
      </Link>

      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-card flex flex-col items-center gap-6 max-w-sm w-full">
        <p className="text-gray-400 text-sm">Shared QR Code</p>

        <div className="rounded-2xl overflow-hidden border border-gray-100" style={{ width: PREVIEW, height: PREVIEW, background: config.backgroundOptions.color }}>
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"/>
            </div>
          )}
          {isCustom && customSVG && !isLoading && (
            <div style={{ width: PREVIEW, height: PREVIEW }}
              dangerouslySetInnerHTML={{ __html: customSVG.replace(/width="\d+" height="\d+"/, `width="${PREVIEW}" height="${PREVIEW}"`) }}/>
          )}
          {!isCustom && (
            <div ref={containerRef} style={{
              transform: `scale(${PREVIEW / 400})`, transformOrigin: "top left",
              width: 400, height: 400, visibility: isLoading ? "hidden" : "visible",
            }}/>
          )}
        </div>

        <a href={config.data} target="_blank" rel="noopener noreferrer"
          className="text-gray-500 text-sm hover:text-primary transition-colors text-center break-all max-w-xs">
          {config.data}
        </a>

        <div className="flex gap-3 w-full">
          <button onClick={() => download("png")} disabled={isDownloading !== null}
            className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center bg-primary text-white hover:bg-primary-700 hover-lift disabled:opacity-50 transition-all">
            {isDownloading === "png"
              ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"/>
              : "Download PNG"}
          </button>
          <button onClick={() => download("svg")} disabled={isDownloading !== null}
            className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center bg-white border border-gray-200 text-gray-700 hover:border-primary/40 hover:text-primary hover-lift disabled:opacity-50 transition-all">
            {isDownloading === "svg"
              ? <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"/>
              : "Download SVG"}
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm mb-3">Want to make your own?</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary-700 hover-lift transition-all">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          Create your own
        </Link>
      </div>
    </div>
  );
}
