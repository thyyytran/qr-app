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
  const [customSlug, setCustomSlug] = useState("");

  const handleShare = useCallback(async () => {
    if (!store.data) return;
    setIsLoading(true); setError(null); setShareUrl(null);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: {
            data: store.data, width: store.width, height: store.height,
            margin: store.margin, errorCorrectionLevel: store.errorCorrectionLevel,
            dotsOptions: store.dotsOptions, cornersSquareOptions: store.cornersSquareOptions,
            cornersDotOptions: store.cornersDotOptions, backgroundOptions: store.backgroundOptions,
            image: store.image, imageOptions: store.imageOptions,
          },
          palette: store.sourceImagePalette,
          customSlug: customSlug.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to share");
      setShareUrl(data.url);
      setFullUrl(data.fullUrl || window.location.origin + data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [store, customSlug]);

  const handleCopy = useCallback(async () => {
    if (!fullUrl) return;
    try { await navigator.clipboard.writeText(fullUrl); }
    catch {
      const el = document.createElement("textarea");
      el.value = fullUrl; document.body.appendChild(el); el.select();
      document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [fullUrl]);

  if (shareUrl) {
    return (
      <div className="w-full flex flex-col gap-3 animate-fade-in">
        <p className="section-label text-center">Share Link Created</p>
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2">
          <input readOnly value={fullUrl ?? ""} className="flex-1 bg-transparent text-gray-700 text-sm outline-none truncate font-mono"/>
          <button onClick={handleCopy} className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            copied ? "bg-green-100 text-green-700 border border-green-200" : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
          }`}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-gray-400 text-xs text-center">Link works forever, no account needed</p>
        <button onClick={() => { setShareUrl(null); setFullUrl(null); setCustomSlug(""); }}
          className="text-gray-400 text-xs hover:text-gray-600 text-center transition-colors">
          Generate a new link
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
        <span className="text-gray-400 text-xs font-mono flex-shrink-0">/s/</span>
        <input type="text" value={customSlug}
          onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
          placeholder="custom-link (optional)"
          className="flex-1 bg-transparent text-gray-700 text-sm outline-none placeholder-gray-400"
          maxLength={50} spellCheck={false} autoComplete="off"
        />
      </div>
      <button onClick={handleShare} disabled={!store.data || isLoading}
        className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:border-primary/40 hover:text-primary hover-lift disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        {isLoading ? (
          <><div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"/>Saving...</>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/>
            </svg>
            Share Link
          </>
        )}
      </button>
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      {!store.data && <p className="text-gray-400 text-xs text-center">Enter a URL to share this QR code</p>}
    </div>
  );
}
