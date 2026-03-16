"use client";

import { useEffect, useRef, useState } from "react";
import { useQRStore } from "@/store/qrStore";
import type QRCodeStylingType from "qr-code-styling";

export default function QRPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRCodeStylingType | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const store = useQRStore();

  const getQROptions = () => ({
    width: store.width,
    height: store.height,
    data: store.data || "https://qrcraft.app",
    margin: store.margin,
    qrOptions: {
      errorCorrectionLevel: store.errorCorrectionLevel,
    },
    dotsOptions: store.dotsOptions,
    cornersSquareOptions: store.cornersSquareOptions,
    cornersDotOptions: store.cornersDotOptions,
    backgroundOptions: store.backgroundOptions,
    ...(store.image ? { image: store.image } : {}),
    imageOptions: store.imageOptions,
  });

  // Initial mount: import and create QR instance
  useEffect(() => {
    let cancelled = false;

    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      if (cancelled || !containerRef.current) return;

      const qr = new QRCodeStyling(getQROptions());
      qrInstanceRef.current = qr;

      // Clear existing children
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        qr.append(containerRef.current);
      }

      setIsLoading(false);
      setIsInitialized(true);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update QR on config changes (debounced)
  useEffect(() => {
    if (!isInitialized || !qrInstanceRef.current) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (qrInstanceRef.current) {
        qrInstanceRef.current.update(getQROptions());
      }
    }, 200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isInitialized,
    store.data,
    store.width,
    store.height,
    store.margin,
    store.errorCorrectionLevel,
    store.dotsOptions,
    store.cornersSquareOptions,
    store.cornersDotOptions,
    store.backgroundOptions,
    store.image,
    store.imageOptions,
  ]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Preview wrapper with animated gradient border */}
      <div className="relative p-[3px] rounded-2xl gradient-border-animated">
        <div
          className="relative rounded-2xl overflow-hidden qr-preview-container bg-surface"
          style={{ width: 320, height: 320 }}
        >
          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface z-10">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin"
                />
                <p className="text-white/40 text-sm">Loading...</p>
              </div>
            </div>
          )}

          {/* QR container — scaled to fit 320px */}
          <div
            ref={containerRef}
            className="flex items-center justify-center"
            style={{
              transform: `scale(${320 / (store.width || 400)})`,
              transformOrigin: "top left",
              width: store.width || 400,
              height: store.height || 400,
            }}
          />
        </div>
      </div>

      {/* URL hint */}
      {!store.data && (
        <p className="text-white/30 text-xs text-center">
          Enter a URL above to generate your QR code
        </p>
      )}
      {store.data && (
        <p className="text-white/40 text-xs text-center truncate max-w-xs">
          {store.data}
        </p>
      )}
    </div>
  );
}

// Export the qr instance getter for DownloadSection
export { };
