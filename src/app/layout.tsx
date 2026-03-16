import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QRcraft — Styled QR Code Generator",
  description:
    "Generate beautiful, customizable QR codes with gradients, custom logos, and unique dot styles. Upload an image to extract colors and apply them to your QR code.",
  keywords: ["QR code", "QR generator", "styled QR", "custom QR code"],
  openGraph: {
    title: "QRcraft — Styled QR Code Generator",
    description: "Generate beautiful, customizable QR codes with gradients, custom logos, and unique dot styles.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-background text-white font-body antialiased">
        {children}
      </body>
    </html>
  );
}
