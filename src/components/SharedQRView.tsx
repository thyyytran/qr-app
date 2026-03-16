"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QRConfig } from "@/types/qr";
import type QRCodeStylingType from "qr-code-styling";

interface SharedQRViewProps {
  config: QRConfig;
}

export default function SharedQRView({ config }: SharedQRViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRCodeStylingType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState<"png" | "svg" | null>(null);

  useEffect(() => {
    let cancelled = false;

    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      if (cancelled || !containerRef.current) return;

      const qr = new QRCodeStyling({
        width: 400,
        height: 400,
        data: config.data,
        margin: config.margin,
        qrOptions: {
          errorCorrectionLevel: config.errorCorrectionLevel,
        },
        dotsOptions: config.dotsOptions,
        cornersSquareOptions: config.cornersSquareOptions,
        cornersDotOptions: config.cornersDotOptions,
        backgroundOptions: config.backgroundOptions,
        ...(config.image ? { image: config.image } : {}),
        imageOptions: config.imageOptions,
      });

      qrInstanceRef.current = qr;

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        qr.append(containerRef.current);
      }

      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [config]);

  const download = async (extension: "png" | "svg") => {
    setIsDownloading(extension);
    try {
      const { default: QRCodeStyling } = await import("qr-code-styling");
      const qr = new QRCodeStyling({
        width: 1200,
        height: 1200,
        data: config.data,
        margin: config.margin * 3,
        qrOptions: { errorCorrectionLevel: config.errorCorrectionLevel },
        dotsOptions: config.dotsOptions,
        cornersSquareOptions: config.cornersSquareOptions,
        cornersDotOptions: config.cornersDotOptions,
        backgroundOptions: config.backgroundOptions,
        ...(config.image ? { image: config.image } : {}),
        imageOptions: config.imageOptions,
      });
      await qr.download({ name: "qrcraft-shared", extension });
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <Link
        href="/"
        className="flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
            <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" />
            <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" />
            <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" />
            <rect x="14" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
            <rect x="18" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
            <rect x="14" y="18" width="3" height="3" rx="0.5" fill="currentColor" />
            <rect x="18" y="18" width="3" height="3" rx="0.5" fill="currentColor" />
          </svg>
        </div>
        <span className="font-heading font-bold text-xl gradient-text">
          QRcraft
        </span>
      </Link>

      {/* QR card */}
      <div className="glass-card rounded-3xl p-8 border border-white/5 flex flex-col items-center gap-6 max-w-sm w-full">
        <p className="text-white/40 text-sm text-center">Shared QR Code</p>

        {/* QR preview */}
        <div className="relative p-[3px] rounded-2xl gradient-border-animated">
          <div
            className="relative rounded-2xl overflow-hidden bg-surface"
            style={{ width: 320, height: 320 }}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface z-10">
                <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            )}
            <div
              ref={containerRef}
              style={{
                transform: `scale(${320 / 400})`,
                transformOrigin: "top left",
                width: 400,
                height: 400,
              }}
            />
          </div>
        </div>

        {/* URL */}
        <a
          href={config.data}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 text-sm hover:text-primary transition-colors text-center break-all max-w-xs"
        >
          {config.data}
        </a>

        {/* Download buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={() => download("png")}
            disabled={isDownloading !== null}
            className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-primary text-white shadow-glow hover-lift disabled:opacity-50 transition-all"
          >
            {isDownloading === "png" ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              "Download PNG"
            )}
          </button>
          <button
            onClick={() => download("svg")}
            disabled={isDownloading !== null}
            className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-white/10 bg-white/5 text-white/80 hover:border-primary/30 hover:text-white hover-lift disabled:opacity-50 transition-all"
          >
            {isDownloading === "svg" ? (
              <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            ) : (
              "Download SVG"
            )}
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-white/30 text-sm mb-3">
          Want to make your own styled QR code?
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-primary text-white shadow-glow hover-lift transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create your own
        </Link>
      </div>
    </div>
  );
}
