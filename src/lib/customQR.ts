import type { CornerSquareType, GradientConfig, DotType } from "@/types/qr";

// ---------------------------------------------------------------------------
// Dot shape paths — normalized so center is (0,0), fits within radius ~0.75
// ---------------------------------------------------------------------------

function heartDotPath(): string {
  return [
    "M 0 0.32",
    "C -0.04 0.2 -0.5 0.08 -0.5 -0.15",
    "C -0.5 -0.44 -0.22 -0.52 0 -0.24",
    "C 0.22 -0.52 0.5 -0.44 0.5 -0.15",
    "C 0.5 0.08 0.04 0.2 0 0.32",
    "Z",
  ].join(" ");
}

function starDotPath(): string {
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
  return [
    "M 0 -0.68",
    "C 0.68 -0.35 0.68 0.35 0 0.68",
    "C -0.68 0.35 -0.68 -0.35 0 -0.68",
    "Z",
  ].join(" ");
}

export function getDotPath(type: DotType): string | null {
  switch (type) {
    case "heart": return heartDotPath();
    case "star": return starDotPath();
    case "diamond": return diamondPath();
    case "leaf": return leafPath();
    default: return null;
  }
}

// ---------------------------------------------------------------------------
// Frame shape paths — for full-QR heart/star clip + border
// ---------------------------------------------------------------------------

/**
 * Classic heart outline fitting within the given canvas size/margin.
 * Control point at y=75 (not 60) gives a wider lower body so the
 * bottom-left QR finder stays inside the shape.
 */
function heartFramePath(size: number, margin: number): string {
  const s = (size - 2 * margin) / 80;
  const tx = margin - 10 * s;
  const ty = margin - 10 * s;
  const px = (x: number) => f(x * s + tx);
  const py = (y: number) => f(y * s + ty);
  const r = f(20 * s);
  return (
    `M ${px(50)},${py(30)}` +
    ` A ${r},${r} 0 0 1 ${px(90)},${py(30)}` +
    ` Q ${px(90)},${py(82)} ${px(50)},${py(90)}` +
    ` Q ${px(10)},${py(82)} ${px(10)},${py(30)}` +
    ` A ${r},${r} 0 0 1 ${px(50)},${py(30)} Z`
  );
}

/**
 * 5-pointed star outline centered in the canvas.
 */
function starFramePath(size: number, margin: number): string {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - margin;
  const innerR = outerR * 0.42;
  const pts = 5;
  const parts: string[] = [];
  for (let i = 0; i < pts * 2; i++) {
    const angle = (i * Math.PI) / pts - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = f(cx + Math.cos(angle) * r);
    const y = f(cy + Math.sin(angle) * r);
    parts.push(`${i === 0 ? "M" : "L"}${x},${y}`);
  }
  return parts.join(" ") + " Z";
}

// ---------------------------------------------------------------------------
// Finder-pattern region helpers
// ---------------------------------------------------------------------------

function inFinderZone(r: number, c: number, size: number): boolean {
  if (r < 7 && c < 7) return true;           // top-left
  if (r < 7 && c >= size - 7) return true;   // top-right
  if (r >= size - 7 && c < 7) return true;   // bottom-left
  return false;
}

// ---------------------------------------------------------------------------
// Main SVG builder
// ---------------------------------------------------------------------------

export interface CustomQROptions {
  /** Output canvas size in px */
  size: number;
  margin: number;
  dotType: DotType;
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

  // Heart/star: clip the entire QR to the shape, draw a stroke border
  const isFrameMode = cornerSquareType === "heart" || cornerSquareType === "star";

  // In frame mode, shrink the QR content so all 3 finder patterns fit inside the shape.
  // Heart needs ~20% margin on each side; star needs ~25%.
  const qrMargin = isFrameMode
    ? Math.round(size * (cornerSquareType === "star" ? 0.25 : 0.15))
    : margin;

  const cell = (size - qrMargin * 2) / moduleSize;
  const isDark = (r: number, c: number) =>
    r >= 0 && r < moduleSize && c >= 0 && c < moduleSize &&
    moduleData[r * moduleSize + c] !== 0;

  const parts: string[] = [];
  const defs: string[] = [];

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
      defs.push(
        `<linearGradient id="${GRAD_ID}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">` +
        `<stop offset="0%" stop-color="${g.colorStops[0].color}"/>` +
        `<stop offset="100%" stop-color="${g.colorStops[1]?.color ?? g.colorStops[0].color}"/>` +
        `</linearGradient>`
      );
    } else {
      defs.push(
        `<radialGradient id="${GRAD_ID}" cx="50%" cy="50%" r="50%">` +
        `<stop offset="0%" stop-color="${g.colorStops[0].color}"/>` +
        `<stop offset="100%" stop-color="${g.colorStops[1]?.color ?? g.colorStops[0].color}"/>` +
        `</radialGradient>`
      );
    }
  }

  // Frame clip path — use a small fixed margin so the border isn't cut off
  const frameBorderMargin = Math.round(size * 0.01);
  let framePath = "";
  if (isFrameMode) {
    framePath = cornerSquareType === "heart"
      ? heartFramePath(size, frameBorderMargin)
      : starFramePath(size, frameBorderMargin);
    defs.push(`<clipPath id="fr"><path d="${framePath}"/></clipPath>`);
  }

  if (defs.length > 0) {
    parts.push(`<defs>${defs.join("")}</defs>`);
  }

  const fill = useGrad ? "url(#dg)" : dotsColor;
  const shape = getDotPath(dotType);
  const scale = (cell * 0.9).toFixed(3);

  // Data modules (always clipped in frame mode)
  const dataParts: string[] = [];
  for (let r = 0; r < moduleSize; r++) {
    for (let c = 0; c < moduleSize; c++) {
      if (!isDark(r, c)) continue;
      if (inFinderZone(r, c, moduleSize)) continue;
      const cxNum = qrMargin + (c + 0.5) * cell;
      const cyNum = qrMargin + (r + 0.5) * cell;
      const cx = cxNum.toFixed(2);
      const cy = cyNum.toFixed(2);
      if (shape) {
        dataParts.push(
          `<path d="${shape}" transform="translate(${cx},${cy}) scale(${scale})" fill="${fill}"/>`
        );
      } else {
        const rad = cell * 0.45;
        const x = f(cxNum - rad);
        const y = f(cyNum - rad);
        const w = f(rad * 2);
        if (dotType === "dots") {
          dataParts.push(`<circle cx="${cx}" cy="${cy}" r="${f(rad)}" fill="${fill}"/>`);
        } else if (dotType === "rounded") {
          dataParts.push(`<rect x="${x}" y="${y}" width="${w}" height="${w}" rx="${f(rad * 0.4)}" fill="${fill}"/>`);
        } else if (dotType === "extra-rounded") {
          dataParts.push(`<rect x="${x}" y="${y}" width="${w}" height="${w}" rx="${f(rad * 0.65)}" fill="${fill}"/>`);
        } else {
          dataParts.push(`<rect x="${x}" y="${y}" width="${w}" height="${w}" fill="${fill}"/>`);
        }
      }
    }
  }

  // Finder patterns — in frame mode use extra-rounded; otherwise respect cornerSquareType
  const eyes = [
    { r: 0, c: 0 },
    { r: 0, c: moduleSize - 7 },
    { r: moduleSize - 7, c: 0 },
  ];

  const eyeType: CornerSquareType = isFrameMode ? "extra-rounded" : cornerSquareType;
  const eyeParts: string[] = [];

  for (const { r: er, c: ec } of eyes) {
    const ex = qrMargin + ec * cell;
    const ey = qrMargin + er * cell;
    const outer = 7 * cell;
    const white = 5 * cell;
    const innerSq = 3 * cell;
    const off1 = cell;
    const off2 = 2 * cell;

    const outerRx =
      eyeType === "dot" ? outer / 2 :
      eyeType === "extra-rounded" ? outer * 0.18 : 0;
    const whiteRx = outerRx > 0 ? white * 0.18 : 0;
    const innerRx = outerRx > 0 ? innerSq * 0.2 : 0;

    eyeParts.push(
      `<rect x="${f(ex)}" y="${f(ey)}" width="${f(outer)}" height="${f(outer)}" rx="${f(outerRx)}" fill="${cornerSquareColor}"/>`,
      `<rect x="${f(ex + off1)}" y="${f(ey + off1)}" width="${f(white)}" height="${f(white)}" rx="${f(whiteRx)}" fill="${backgroundColor}"/>`,
      `<rect x="${f(ex + off2)}" y="${f(ey + off2)}" width="${f(innerSq)}" height="${f(innerSq)}" rx="${f(innerRx)}" fill="${cornerDotColor}"/>`
    );
  }

  // Logo
  const logoParts: string[] = [];
  if (options.image && options.imageSize) {
    const ls = size * options.imageSize;
    const lx = (size - ls) / 2;
    const ly = (size - ls) / 2;
    const pad = ls * 0.12;
    logoParts.push(
      `<rect x="${f(lx - pad)}" y="${f(ly - pad)}" width="${f(ls + pad * 2)}" height="${f(ls + pad * 2)}" rx="${f(pad)}" fill="${backgroundColor}"/>`,
      `<image href="${options.image}" x="${f(lx)}" y="${f(ly)}" width="${f(ls)}" height="${f(ls)}" preserveAspectRatio="xMidYMid meet"/>`
    );
  }

  if (isFrameMode) {
    // Clip data modules + finder eyes inside the frame shape
    parts.push(`<g clip-path="url(#fr)">${dataParts.join("")}${eyeParts.join("")}</g>`);
    // Frame border stroke on top
    const strokeW = f(size * 0.055);
    parts.push(
      `<path d="${framePath}" fill="none" stroke="${cornerSquareColor}" stroke-width="${strokeW}" stroke-linejoin="round"/>`
    );
    parts.push(...logoParts);
  } else {
    parts.push(...dataParts);
    parts.push(...eyeParts);
    parts.push(...logoParts);
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
