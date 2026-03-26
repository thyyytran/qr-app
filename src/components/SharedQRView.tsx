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

  const isCustom = isCustomDotType(config.dotsOptions.type) ||
    config.cornersSquareOptions.type === "heart" ||
    config.cornersSquareOptions.type === "star";

  useEffect(() => {
    let cancelled = false;

    if (isCustom) {
      import("@/lib/customQR").then(({ getQRMatrix, buildCustomQRSVG }) =>
        getQRMatrix(config.data, config.errorCorrectionLevel).then((matrix) => {
          if (cancelled) return;
          const svg = buildCustomQRSVG(matrix.data, matrix.size, {
            size: 400,
            margin: config.margin,
            dotType: config.dotsOptions.type,
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
        const DL_SIZE = 1200;
        const opts = {
          size: DL_SIZE, margin: config.margin * 3,
          dotType: config.dotsOptions.type,
          dotsColor: config.dotsOptions.color,
          gradient: config.dotsOptions.gradient,
          backgroundColor: config.backgroundOptions.color,
          cornerSquareColor: config.cornersSquareOptions.color,
          cornerDotColor: config.cornersDotOptions.color,
          cornerSquareType: config.cornersSquareOptions.type,
          image: config.image,
          imageSize: config.imageOptions.imageSize,
        };
        if (extension === "svg") {
          const svgStr = buildCustomQRSVG(matrix.data, matrix.size, opts);
          const blob = new Blob([svgStr], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = "qrcraft-shared.svg"; a.click();
          URL.revokeObjectURL(url);
        } else {
          const svgNoLogo = buildCustomQRSVG(matrix.data, matrix.size, { ...opts, image: undefined, imageSize: undefined });
          const canvas = document.createElement("canvas");
          canvas.width = DL_SIZE; canvas.height = DL_SIZE;
          const ctx = canvas.getContext("2d")!;
          await new Promise<void>((resolve) => {
            const img = new Image();
            const blob = new Blob([svgNoLogo], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);
            img.onload = () => { ctx.drawImage(img, 0, 0, DL_SIZE, DL_SIZE); URL.revokeObjectURL(url); resolve(); };
            img.onerror = () => { URL.revokeObjectURL(url); resolve(); };
            img.src = url;
          });
          if (config.image && config.imageOptions.imageSize) {
            await new Promise<void>((resolve) => {
              const logoImg = new Image();
              logoImg.onload = () => {
                const ls = DL_SIZE * config.imageOptions.imageSize;
                const lx = (DL_SIZE - ls) / 2;
                const ly = (DL_SIZE - ls) / 2;
                const pad = ls * 0.12;
                ctx.fillStyle = config.backgroundOptions.color;
                ctx.beginPath();
                ctx.rect(lx - pad, ly - pad, ls + pad * 2, ls + pad * 2);
                ctx.fill();
                ctx.drawImage(logoImg, lx, ly, ls, ls);
                resolve();
              };
              logoImg.onerror = () => resolve();
              logoImg.src = config.image!;
            });
          }
          canvas.toBlob((b) => {
            if (!b) return;
            const u = URL.createObjectURL(b);
            const a = document.createElement("a");
            a.href = u; a.download = "qrcraft-shared.png"; a.click();
            URL.revokeObjectURL(u);
          }, "image/png");
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
          <svg viewBox="0 0 21 21" fill="white" className="w-5 h-5">
            {/* TL finder ring */}
            <path fillRule="evenodd" d="M0 0h7v7H0zM1 1h5v5H1z"/>
            <rect x="2" y="2" width="3" height="3"/>
            {/* TR finder ring */}
            <path fillRule="evenodd" d="M14 0h7v7H14zM15 1h5v5H15z"/>
            <rect x="16" y="2" width="3" height="3"/>
            {/* BL finder ring */}
            <path fillRule="evenodd" d="M0 14h7v7H0zM1 15h5v5H1z"/>
            <rect x="2" y="16" width="3" height="3"/>
            {/* Timing dots */}
            <rect x="8" y="6" width="1" height="1"/>
            <rect x="10" y="6" width="1" height="1"/>
            <rect x="12" y="6" width="1" height="1"/>
            <rect x="6" y="8" width="1" height="1"/>
            <rect x="6" y="10" width="1" height="1"/>
            <rect x="6" y="12" width="1" height="1"/>
            {/* Data modules */}
            <rect x="8" y="8" width="2" height="1"/>
            <rect x="11" y="8" width="2" height="1"/>
            <rect x="14" y="9" width="2" height="1"/>
            <rect x="8" y="10" width="1" height="2"/>
            <rect x="10" y="10" width="3" height="1"/>
            <rect x="14" y="10" width="2" height="2"/>
            <rect x="9" y="12" width="2" height="2"/>
            <rect x="13" y="12" width="1" height="2"/>
            <rect x="16" y="12" width="2" height="2"/>
            <rect x="8" y="15" width="2" height="2"/>
            <rect x="11" y="14" width="1" height="3"/>
            <rect x="13" y="15" width="4" height="1"/>
            <rect x="13" y="18" width="2" height="1"/>
            <rect x="16" y="17" width="2" height="2"/>
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
