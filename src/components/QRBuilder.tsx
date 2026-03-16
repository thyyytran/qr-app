"use client";

import dynamic from "next/dynamic";
import URLInput from "./URLInput";
import StylePanel from "./StylePanel";
import ImageUploader from "./ImageUploader";
import LogoUploader from "./LogoUploader";
import DownloadSection from "./DownloadSection";
import ShareButton from "./ShareButton";

const QRPreview = dynamic(() => import("./QRPreview"), { ssr: false });

export default function QRBuilder() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/5 bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 text-white"
              >
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
          </div>
          <p className="text-white/40 text-sm hidden sm:block">
            Styled QR Code Generator
          </p>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero text */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-3">
            <span className="gradient-text">Beautiful</span> QR Codes,{" "}
            <span className="gradient-text-cyan">Instantly</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Paste a URL, customize the style, upload a logo — download in
            seconds.
          </p>
        </div>

        {/* Two-panel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left panel: controls */}
          <div className="flex flex-col gap-5 order-2 lg:order-1">
            {/* URL Input */}
            <div className="glass-card rounded-2xl p-5 border border-white/5">
              <div className="section-label mb-4">Your Link</div>
              <URLInput />
            </div>

            {/* Style Panel */}
            <div className="glass-card rounded-2xl p-5 border border-white/5">
              <div className="section-label mb-4">QR Style</div>
              <StylePanel />
            </div>

            {/* Image Uploader for palette */}
            <div className="glass-card rounded-2xl p-5 border border-white/5">
              <div className="section-label mb-4">Extract Colors from Image</div>
              <ImageUploader />
            </div>

            {/* Logo Uploader */}
            <div className="glass-card rounded-2xl p-5 border border-white/5">
              <div className="section-label mb-4">Logo Overlay</div>
              <LogoUploader />
            </div>

            {/* Download */}
            <div className="glass-card rounded-2xl p-5 border border-white/5">
              <div className="section-label mb-4">Export</div>
              <DownloadSection />
            </div>
          </div>

          {/* Right panel: preview */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24">
            <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col items-center gap-6">
              <div className="section-label self-start">Preview</div>
              <QRPreview />
              <ShareButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
