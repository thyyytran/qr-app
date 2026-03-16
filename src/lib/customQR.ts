import type { CornerSquareType, GradientConfig } from "@/types/qr";
import type { CustomDotType } from "@/types/qr";

// ---------------------------------------------------------------------------
// Dot shape paths — normalized so center is (0,0), fits within radius ~0.75
// ---------------------------------------------------------------------------

function heartPath(): string {
  // Classic heart, centered at 0,0, fits in ~±0.5 x ±0.55
  return [
    "M 0 0.32",
    "C -0.04 0.2 -0.5 0.08 -0.5 -0.15",
    "C -0.5 -0.44 -0.22 -0.52 0 -0.24",
    "C 0.22 -0.52 0.5 -0.44 0.5 -0.15",
    "C 0.5 0.08 0.04 0.2 0 0.32",
    "Z",
  ].join(" ");
}

function starPath(): string {
  const pts = 5;
  const outer = 0.72;
  const inner = 0.3;
  const parts: string[] = [];
  for (let i = 0; i < pts * 2; i++) {
    const angle = (i * Math.PI) / pts - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    const x = (Math.cos(angle) * r).toFixed(4);
    const y = (Math.sin(angle) * r).toFixed(4);
    parts.push((i === 0 ? "M" : "L") + x + "," + y);
  }
  return parts.join(" ") + " Z";
}

function diamondPath(): string {
  return "M 0 -0.7 L 0.7 0 L 0 0.7 L -0.7 0 Z";
}

function leafPath(): string {
  // Vertical leaf
  return [
    "M 0 -0.68",
    "C 0.68 -0.35 0.68 0.35 0 0.68",
    "C -0.68 0.35 -0.68 -0.35 0 -0.68",
    "Z",
  ].join(" ");
}

export function getDotPath(type: CustomDotType): string {
  switch (type) {
    case "heart": return heartPath();
    case "star": return starPath();
    case "diamond": return diamondPath();
    case "leaf": return leafPath();
  }
}

// ---------------------------------------------------------------------------
// Finder-pattern region helpers
// ---------------------------------------------------------------------------

function inFinderZone(r: number, c: number, size: number): boolean {
  if (r < 9 && c < 9) return true;           // top-left (include separator)
  if (r < 9 && c >= size - 8) return true;   // top-right
  if (r >= size - 8 && c < 9) return true;   // bottom-left
  return false;
}

// ---------------------------------------------------------------------------
// Main SVG builder
// ---------------------------------------------------------------------------

export interface CustomQROptions {
  /** Output canvas size in px */
  size: number;
  margin: number;
  dotType: CustomDotType;
  dotsColor: string;
  gradient?: GradientConfig;
  backgroundColor: string;
  cornerSquareColor: string;
  cornerDotColor: string;
  cornerSquareType: CornerSquareType;
  /** Base64 / data URL for logo */
  image?: string;
  imageSize?: number;
}

export function buildCustomQRSVG(
  moduleData: Uint8Array,
  moduleSize: number,
  options: CustomQROptions
): string {
  const { size, margin, dotType, dotsColor, backgroundColor,
          cornerSquareColor, cornerDotColor, cornerSquareType } = options;

  const cell = (size - margin * 2) / moduleSize;
  const isDark = (r: number, c: number) =>
    r >= 0 && r < moduleSize && c >= 0 && c < moduleSize &&
    moduleData[r * moduleSize + c] !== 0;

  const parts: string[] = [];

  // Background
  parts.push(`<rect width="${size}" height="${size}" fill="${backgroundColor}"/>`);

  // Gradient def
  const useGrad = !!options.gradient;
  if (useGrad && options.gradient) {
    const g = options.gradient;
    const GRAD_ID = "dg";
    if (g.type === "linear") {
      const rot = ((g.rotation ?? 0) * Math.PI) / 180;
      const x1 = (50 - Math.cos(rot) * 50).toFixed(1);
      const y1 = (50 - Math.sin(rot) * 50).toFixed(1);
      const x2 = (50 + Math.cos(rot) * 50).toFixed(1);
      const y2 = (50 + Math.sin(rot) * 50).toFixed(1);
      parts.push(
        `<defs><linearGradient id="${GRAD_ID}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">` +
        `<stop offset="0%" stop-color="${g.colorStops[0].color}"/>` +
        `<stop offset="100%" stop-color="${g.colorStops[1]?.color ?? g.colorStops[0].color}"/>` +
        `</linearGradient></defs>`
      );
    } else {
      parts.push(
        `<defs><radialGradient id="${GRAD_ID}" cx="50%" cy="50%" r="50%">` +
        `<stop offset="0%" stop-color="${g.colorStops[0].color}"/>` +
        `<stop offset="100%" stop-color="${g.colorStops[1]?.color ?? g.colorStops[0].color}"/>` +
        `</radialGradient></defs>`
      );
    }
  }

  const fill = useGrad ? "url(#dg)" : dotsColor;
  const shape = getDotPath(dotType);
  // Scale: each dot occupies `cell` px; we scale the unit path (±0.5ish) by cell*0.44
  const scale = (cell * 0.44).toFixed(3);

  // Data modules
  for (let r = 0; r < moduleSize; r++) {
    for (let c = 0; c < moduleSize; c++) {
      if (!isDark(r, c)) continue;
      if (inFinderZone(r, c, moduleSize)) continue;
      const cx = (margin + (c + 0.5) * cell).toFixed(2);
      const cy = (margin + (r + 0.5) * cell).toFixed(2);
      parts.push(
        `<path d="${shape}" transform="translate(${cx},${cy}) scale(${scale})" fill="${fill}"/>`
      );
    }
  }

  // Finder patterns (3 eyes)
  const eyes = [
    { r: 0, c: 0 },
    { r: 0, c: moduleSize - 7 },
    { r: moduleSize - 7, c: 0 },
  ];

  for (const { r: er, c: ec } of eyes) {
    const ex = margin + ec * cell;
    const ey = margin + er * cell;
    const outer = 7 * cell;
    const white = 5 * cell;
    const inner = 3 * cell;
    const off1 = cell;
    const off2 = 2 * cell;

    const outerRx =
      cornerSquareType === "dot"
        ? outer / 2
        : cornerSquareType === "extra-rounded"
        ? outer * 0.18
        : 0;
    const whiteRx = outerRx > 0 ? white * 0.18 : 0;
    const innerRx = outerRx > 0 ? inner * 0.2 : 0;

    parts.push(
      `<rect x="${f(ex)}" y="${f(ey)}" width="${f(outer)}" height="${f(outer)}" rx="${f(outerRx)}" fill="${cornerSquareColor}"/>`,
      `<rect x="${f(ex + off1)}" y="${f(ey + off1)}" width="${f(white)}" height="${f(white)}" rx="${f(whiteRx)}" fill="${backgroundColor}"/>`,
      `<rect x="${f(ex + off2)}" y="${f(ey + off2)}" width="${f(inner)}" height="${f(inner)}" rx="${f(innerRx)}" fill="${cornerDotColor}"/>`
    );
  }

  // Logo
  if (options.image && options.imageSize) {
    const ls = size * options.imageSize;
    const lx = (size - ls) / 2;
    const ly = (size - ls) / 2;
    const pad = ls * 0.12;
    parts.push(
      `<rect x="${f(lx - pad)}" y="${f(ly - pad)}" width="${f(ls + pad * 2)}" height="${f(ls + pad * 2)}" rx="${f(pad)}" fill="${backgroundColor}"/>`,
      `<image href="${options.image}" x="${f(lx)}" y="${f(ly)}" width="${f(ls)}" height="${f(ls)}" preserveAspectRatio="xMidYMid meet"/>`
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${parts.join("")}</svg>`;
}

function f(n: number): string {
  return n.toFixed(2);
}

// ---------------------------------------------------------------------------
// Get QR matrix from a string using the qrcode package
// ---------------------------------------------------------------------------

export async function getQRMatrix(
  data: string,
  errorLevel: "L" | "M" | "Q" | "H" = "H"
): Promise<{ data: Uint8Array; size: number }> {
  const QRCode = (await import("qrcode")).default;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qr = (QRCode as any).create(data, { errorCorrectionLevel: errorLevel });
  return {
    data: qr.modules.data as Uint8Array,
    size: qr.modules.size as number,
  };
}
