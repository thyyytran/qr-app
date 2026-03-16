export type DotType =
  | "rounded"
  | "dots"
  | "classy"
  | "classy-rounded"
  | "square"
  | "extra-rounded";
export type CornerSquareType = "dot" | "square" | "extra-rounded";
export type CornerDotType = "dot" | "square";
export type GradientType = "linear" | "radial";

export interface GradientConfig {
  type: GradientType;
  rotation?: number;
  colorStops: Array<{ offset: number; color: string }>;
}

export interface QRConfig {
  data: string;
  width: number;
  height: number;
  margin: number;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  dotsOptions: {
    type: DotType;
    color: string;
    gradient?: GradientConfig;
  };
  cornersSquareOptions: {
    type: CornerSquareType;
    color: string;
  };
  cornersDotOptions: {
    type: CornerDotType;
    color: string;
  };
  backgroundOptions: {
    color: string;
  };
  image?: string; // base64 data URL for logo overlay
  imageOptions: {
    hideBackgroundDots: boolean;
    imageSize: number;
    margin: number;
    crossOrigin: "anonymous";
  };
}

export interface AppState extends QRConfig {
  sourceImagePalette: string[]; // extracted hex colors from uploaded image
  useGradient: boolean;
}
