"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useQRStore } from "@/store/qrStore";
import { isCustomDotType } from "@/types/qr";
import type QRCodeStylingType from "qr-code-styling";

export default function QRPreview() {
  const store = useQRStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRCodeStylingType | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customSVG, setCustomSVG] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const isCustom = isCustomDotType(store.dotsOptions.type) ||
    store.cornersSquareOptions.type === "heart" ||
    store.cornersSquareOptions.type === "star";

  // --- Custom shape renderer ---
  const renderCustom = useCallback(async () => {
    if (!store.data && !customSVG) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const { getQRMatrix, buildCustomQRSVG } = await import("@/lib/customQR");
      const matrix = await getQRMatrix(
        store.data || "https://qrcraft.app",
        store.errorCorrectionLevel
      );
      const svg = buildCustomQRSVG(matrix.data, matrix.size, {
        size: store.width,
        margin: store.margin,
        dotType: store.dotsOptions.type,
        dotsColor: store.dotsOptions.color,
        gradient: store.useGradient ? store.dotsOptions.gradient : undefined,
        backgroundColor: store.backgroundOptions.color,
        cornerSquareColor: store.cornersSquareOptions.color,
        cornerDotColor: store.cornersDotOptions.color,
        cornerSquareType: store.cornersSquareOptions.type,
        image: store.image,
        imageSize: store.imageOptions.imageSize,
      });
      setCustomSVG(svg);
    } catch (e) {
      console.error("Custom QR render error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [store, customSVG]);

  // --- Standard qr-code-styling renderer ---
  const getQROptions = useCallback(
    () => ({
      width: store.width,
      height: store.height,
      data: store.data || "https://qrcraft.app",
      margin: store.margin,
      qrOptions: { errorCorrectionLevel: store.errorCorrectionLevel },
      dotsOptions: store.dotsOptions,
      cornersSquareOptions: store.cornersSquareOptions,
      cornersDotOptions: store.cornersDotOptions,
      backgroundOptions: store.backgroundOptions,
      ...(store.image ? { image: store.image } : {}),
      imageOptions: store.imageOptions,
    }),
    [store]
  );

  // Init standard renderer
  useEffect(() => {
    if (isCustom) {
      setIsInitialized(false);
      return;
    }
    let cancelled = false;
    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      if (cancelled || !containerRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const qr = new QRCodeStyling(getQROptions() as any);
      qrInstanceRef.current = qr;
      containerRef.current.innerHTML = "";
      qr.append(containerRef.current);
      setIsLoading(false);
      setIsInitialized(true);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCustom]);

  // Update standard renderer on config change
  useEffect(() => {
    if (!isInitialized || !qrInstanceRef.current || isCustom) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      qrInstanceRef.current?.update(getQROptions() as any);
    }, 180);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [
    isInitialized, isCustom, getQROptions,
    store.data, store.width, store.height, store.margin,
    store.errorCorrectionLevel, store.dotsOptions, store.cornersSquareOptions,
    store.cornersDotOptions, store.backgroundOptions, store.image, store.imageOptions,
  ]);

  // Custom renderer
  useEffect(() => {
    if (!isCustom) { setCustomSVG(null); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsLoading(true);
    debounceRef.current = setTimeout(() => { renderCustom(); }, 180);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [
    isCustom,
    store.data, store.dotsOptions, store.cornersSquareOptions, store.cornersDotOptions,
    store.backgroundOptions, store.image, store.imageOptions, store.margin,
    store.errorCorrectionLevel, store.useGradient,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ]);

  const PREVIEW = 320;
  const scale = PREVIEW / (store.width || 400);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        className="rounded-2xl overflow-hidden border border-gray-200"
        style={{ width: PREVIEW, height: PREVIEW, background: store.backgroundOptions.color }}
      >
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}

        {/* Custom shape: render SVG inline */}
        {isCustom && customSVG && !isLoading && (
          <div
            style={{ width: PREVIEW, height: PREVIEW }}
            dangerouslySetInnerHTML={{ __html: customSVG.replace(
              /width="\d+" height="\d+"/,
              `width="${PREVIEW}" height="${PREVIEW}"`
            )}}
          />
        )}

        {/* Standard: qr-code-styling canvas */}
        {!isCustom && (
          <div
            ref={containerRef}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: store.width || 400,
              height: store.height || 400,
              visibility: isLoading ? "hidden" : "visible",
            }}
          />
        )}
      </div>

      {!store.data && (
        <p className="text-gray-400 text-xs text-center">
          Enter a URL above to generate your QR code
        </p>
      )}
      {store.data && (
        <p className="text-gray-400 text-xs text-center truncate max-w-xs">
          {store.data}
        </p>
      )}
    </div>
  );
}
