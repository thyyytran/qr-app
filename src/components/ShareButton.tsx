"use client";

import { useState, useCallback } from "react";
import { useQRStore } from "@/store/qrStore";

export default function ShareButton() {
  const store = useQRStore();
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [fullUrl, setFullUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = useCallback(async () => {
    if (!store.data) return;

    setIsLoading(true);
    setError(null);
    setShareUrl(null);

    try {
      const config = {
        data: store.data,
        width: store.width,
        height: store.height,
        margin: store.margin,
        errorCorrectionLevel: store.errorCorrectionLevel,
        dotsOptions: store.dotsOptions,
        cornersSquareOptions: store.cornersSquareOptions,
        cornersDotOptions: store.cornersDotOptions,
        backgroundOptions: store.backgroundOptions,
        image: store.image,
        imageOptions: store.imageOptions,
      };

      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, palette: store.sourceImagePalette }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to share");
      }

      const data = await res.json();
      setShareUrl(data.url);
      setFullUrl(data.fullUrl || window.location.origin + data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [store]);

  const handleCopy = useCallback(async () => {
    if (!fullUrl) return;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = fullUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [fullUrl]);

  const isDisabled = !store.data;

  return (
    <div className="w-full flex flex-col gap-3">
      {!shareUrl ? (
        <>
          <button
            onClick={handleShare}
            disabled={isDisabled || isLoading}
            className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/80 hover:text-white hover-lift disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none transition-all"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                  />
                </svg>
                Share Link
              </>
            )}
          </button>
          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}
          {isDisabled && (
            <p className="text-white/20 text-xs text-center">
              Enter a URL to share this QR code
            </p>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-3 animate-fade-in">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest text-center">
            Share Link Created
          </p>

          {/* URL input + copy */}
          <div className="flex items-center gap-2 bg-surface-secondary rounded-xl border border-white/10 px-3 py-2">
            <input
              type="text"
              readOnly
              value={fullUrl ?? ""}
              className="flex-1 bg-transparent text-white/70 text-sm outline-none truncate font-mono"
            />
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                copied
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
              }`}
            >
              {copied ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>

          <p className="text-white/25 text-xs text-center">
            Link works forever, no account needed
          </p>

          {/* Create another */}
          <button
            onClick={() => {
              setShareUrl(null);
              setFullUrl(null);
            }}
            className="text-white/30 text-xs hover:text-white/50 transition-colors text-center"
          >
            Generate a new link
          </button>
        </div>
      )}
    </div>
  );
}
