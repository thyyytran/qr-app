export type StandardDotType =
  | "rounded"
  | "dots"
  | "classy"
  | "classy-rounded"
  | "square"
  | "extra-rounded";

export type CustomDotType = "heart" | "star" | "diamond" | "leaf";

export type DotType = StandardDotType | CustomDotType;

export const CUSTOM_DOT_TYPES: CustomDotType[] = ["heart", "star", "diamond", "leaf"];

export function isCustomDotType(type: DotType): type is CustomDotType {
  return CUSTOM_DOT_TYPES.includes(type as CustomDotType);
}

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
  image?: string;
  imageOptions: {
    hideBackgroundDots: boolean;
    imageSize: number;
    margin: number;
    crossOrigin: "anonymous";
  };
}

export interface AppState extends QRConfig {
  sourceImagePalette: string[];
  useGradient: boolean;
}
