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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
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
          </div>
          <p className="text-gray-400 text-sm hidden sm:block">Styled QR Code Generator</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            <span className="gradient-text">Beautiful</span> QR Codes
          </h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            Paste a URL, pick a shape, add a logo — download in seconds.
          </p>
        </div>

        {/* Two-panel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left: controls */}
          <div className="flex flex-col gap-4 order-2 lg:order-1">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card">
              <div className="section-label mb-4">Your Link</div>
              <URLInput />
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card">
              <div className="section-label mb-4">QR Style</div>
              <StylePanel />
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card">
              <div className="section-label mb-4">Extract Colors from Image</div>
              <ImageUploader />
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card">
              <div className="section-label mb-4">Logo Overlay</div>
              <LogoUploader />
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card">
              <div className="section-label mb-4">Export</div>
              <DownloadSection />
            </div>
          </div>

          {/* Right: preview */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-card flex flex-col items-center gap-6">
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
