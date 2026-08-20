export type BgFitMode = 'cover' | 'contain' | 'stretch' | 'blur-fill';

export type AlignmentMode = 'center' | 'center-top' | 'center-bottom' | 'center-left' | 'center-right';

export interface BgConfig {
  sourceType: 'image' | 'gradient' | 'color';
  imageUrl: string | null;
  imageFileName?: string;
  imageNaturalWidth?: number;
  imageNaturalHeight?: number;
  fitMode: BgFitMode;
  scale: number; // 0.5 to 2.0 (default 1.0)
  offsetX: number; // -300 to 300
  offsetY: number; // -300 to 300
  blur: number; // 0 to 50
  brightness: number; // 0 to 200 (default 100)
  contrast: number; // 0 to 200 (default 100)
  saturation: number; // 0 to 200 (default 100)
  overlayColor: string; // e.g. '#000000'
  overlayOpacity: number; // 0 to 100
  gradientPreset?: string;
  solidColor?: string;
}

export interface KvConfig {
  imageUrl: string | null;
  imageFileName?: string;
  imageNaturalWidth?: number;
  imageNaturalHeight?: number;
  scalePercent: number; // 10 to 100 (relative to canvas safe area, default 60)
  offsetX: number; // -400 to 400
  offsetY: number; // -200 to 200
  alignment: AlignmentMode;
  borderRadius: number; // 0 to 100 (or 'circle' style)
  isCircle: boolean;
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number; // 0 to 80
  shadowOffsetY: number; // -50 to 50
  shadowOpacity: number; // 0 to 100
  borderWidth: number; // 0 to 20
  borderColor: string;
  glowEnabled: boolean;
  glowColor: string;
  glowBlur: number;
}

export interface TextOverlayConfig {
  enabled: boolean;
  badgeText: string;
  badgeBgColor: string;
  badgeTextColor: string;
  badgePosition: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  titleText: string;
  titleColor: string;
  titleFontSize: number;
  titlePosition: 'below-kv' | 'bottom-center' | 'bottom-left';
  subtitleText: string;
  subtitleColor: string;
}

export interface PresetTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  bgConfig: Partial<BgConfig>;
  kvConfig: Partial<KvConfig>;
  textOverlay?: Partial<TextOverlayConfig>;
  thumbnailBg: string;
  previewKvIcon?: string;
}

export interface ExportSettings {
  format: 'png' | 'jpeg' | 'webp';
  quality: number; // 0.1 to 1.0 for jpeg/webp
  fileName: string;
}
