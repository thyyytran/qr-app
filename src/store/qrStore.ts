import { create } from "zustand";
import {
  AppState,
  DotType,
  CornerSquareType,
  CornerDotType,
  GradientConfig,
} from "@/types/qr";

interface QRStore extends AppState {
  setData: (data: string) => void;
  setDotType: (type: DotType) => void;
  setDotColor: (color: string) => void;
  setDotGradient: (gradient: GradientConfig | undefined) => void;
  setCornerSquareType: (type: CornerSquareType) => void;
  setCornerSquareColor: (color: string) => void;
  setCornerDotType: (type: CornerDotType) => void;
  setCornerDotColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setLogo: (image: string) => void;
  removeLogo: () => void;
  setLogoSize: (size: number) => void;
  setMargin: (margin: number) => void;
  setErrorCorrection: (level: "L" | "M" | "Q" | "H") => void;
  setSourcePalette: (palette: string[]) => void;
  applyPalette: () => void;
  resetToDefaults: () => void;
  setUseGradient: (useGradient: boolean) => void;
}

const DEFAULT_STATE: AppState = {
  data: "",
  width: 400,
  height: 400,
  margin: 10,
  errorCorrectionLevel: "H",
  dotsOptions: {
    type: "rounded",
    color: "#7C3AED",
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#EC4899",
  },
  cornersDotOptions: {
    type: "dot",
    color: "#EC4899",
  },
  backgroundOptions: {
    color: "#0F0F1A",
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.2,
    margin: 8,
    crossOrigin: "anonymous",
  },
  sourceImagePalette: [],
  useGradient: false,
};

export const useQRStore = create<QRStore>((set, get) => ({
  ...DEFAULT_STATE,

  setData: (data) => set({ data }),

  setDotType: (type) =>
    set((state) => ({
      dotsOptions: { ...state.dotsOptions, type },
    })),

  setDotColor: (color) =>
    set((state) => ({
      dotsOptions: { ...state.dotsOptions, color, gradient: undefined },
      useGradient: false,
    })),

  setDotGradient: (gradient) =>
    set((state) => ({
      dotsOptions: { ...state.dotsOptions, gradient },
    })),

  setCornerSquareType: (type) =>
    set((state) => ({
      cornersSquareOptions: { ...state.cornersSquareOptions, type },
    })),

  setCornerSquareColor: (color) =>
    set((state) => ({
      cornersSquareOptions: { ...state.cornersSquareOptions, color },
    })),

  setCornerDotType: (type) =>
    set((state) => ({
      cornersDotOptions: { ...state.cornersDotOptions, type },
    })),

  setCornerDotColor: (color) =>
    set((state) => ({
      cornersDotOptions: { ...state.cornersDotOptions, color },
    })),

  setBackgroundColor: (color) =>
    set({ backgroundOptions: { color } }),

  setLogo: (image) =>
    set({
      image,
      errorCorrectionLevel: "H",
    }),

  removeLogo: () =>
    set({ image: undefined }),

  setLogoSize: (imageSize) =>
    set((state) => ({
      imageOptions: { ...state.imageOptions, imageSize },
    })),

  setMargin: (margin) => set({ margin }),

  setErrorCorrection: (errorCorrectionLevel) => set({ errorCorrectionLevel }),

  setSourcePalette: (sourceImagePalette) => set({ sourceImagePalette }),

  applyPalette: () => {
    const { sourceImagePalette } = get();
    if (sourceImagePalette.length === 0) return;

    const dotColor = sourceImagePalette[0] ?? "#7C3AED";
    const cornerColor = sourceImagePalette[1] ?? "#EC4899";
    const bgColor = sourceImagePalette[sourceImagePalette.length - 1] ?? "#0F0F1A";

    set((state) => ({
      dotsOptions: { ...state.dotsOptions, color: dotColor, gradient: undefined },
      cornersSquareOptions: { ...state.cornersSquareOptions, color: cornerColor },
      cornersDotOptions: { ...state.cornersDotOptions, color: cornerColor },
      backgroundOptions: { color: bgColor },
      useGradient: false,
    }));
  },

  resetToDefaults: () => set({ ...DEFAULT_STATE }),

  setUseGradient: (useGradient) => {
    if (useGradient) {
      const currentColor = get().dotsOptions.color;
      set((state) => ({
        useGradient,
        dotsOptions: {
          ...state.dotsOptions,
          gradient: {
            type: "linear",
            rotation: 45,
            colorStops: [
              { offset: 0, color: currentColor },
              { offset: 1, color: "#EC4899" },
            ],
          },
        },
      }));
    } else {
      set((state) => ({
        useGradient,
        dotsOptions: {
          ...state.dotsOptions,
          gradient: undefined,
        },
      }));
    }
  },
}));
