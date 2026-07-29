export type AssistantType = 'none' | 'rabbit' | 'cat' | 'dog' | 'horse' | 'turtle' | 'fish' | 'capybara';

export type ToolType = 
  | 'brush' 
  | 'rainbow' 
  | 'eraser' 
  | 'fill' 
  | 'select' 
  | 'sticker';

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  type: ToolType;
  points: Point[];
  color: string;
  width: number;
  opacity: number;
  timestamp: number;
}

export interface PhotoOverlay {
  id: string;
  dataUrl: string; // Base64 png cropped into oval
  x: number; // center x on canvas
  y: number; // center y on canvas
  width: number;
  height: number;
  rotation: number; // in degrees
  scale: number;
  opacity: number;
}

export interface StickerOverlay {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
}

export interface ColoringTheme {
  id: string;
  title: string;
  category: string;
  description: string;
  pastelBg: string; // e.g. '#FFF8E7'
  pastelBorder: string; // e.g. '#B2DFDB'
  pastelFill: string; // e.g. '#E8F5E9'
  iconEmoji: string;
  svgContent: string; // Raw SVG path elements or full SVG code
}

export interface ThemeOverlay {
  id: string;
  themeId: string;
  title: string;
  iconEmoji: string;
  svgContent: string;
  pastelBg: string;
  pastelBorder: string;
  pastelFill: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}

export interface SavedArtwork {
  id: string;
  title: string;
  createdAt: string;
  thumbnailDataUrl: string; // Combined image data URL
  strokes: Stroke[];
  photoOverlays: PhotoOverlay[];
  stickers: StickerOverlay[];
  themeOverlays?: ThemeOverlay[];
  themeId?: string;
  bgColor: string;
}

export interface ColorOption {
  name: string;
  hex: string;
}
