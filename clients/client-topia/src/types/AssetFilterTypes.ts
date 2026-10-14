// Highlight filters on a dropped asset, in render order. Mirrors the platform's
// shared-utils assetFilters.ts — the drop endpoint validates against that same shape
// and rejects unknown keys, so keep the two in step.

export type AssetFilterType = "glow" | "shimmer";

export interface GlowFilterSettings {
  color?: string;
  coreColor?: string;
  opacity?: number;
  coreOpacity?: number;
  colorFalloff?: number;
  opacityFalloff?: number;
  pulseStrength?: number;
  size?: number;
  hoverSize?: number;
  pulseSpeed?: number;
  quality?: "low" | "medium" | "high";
}

export interface ShimmerFilterSettings {
  color?: string;
  opacity?: number;
  width?: number;
  angle?: number;
  speed?: number;
  spacing?: number;
}

export interface AssetFilterVisibility {
  mode?: "viewport" | "screen" | "world";
  radius?: number;
  falloff?: number;
}

/** Strength is 0-1. At most 8 filters per asset; the API rejects more. */
export type AssetFilterConfig =
  | { type: "glow"; strength: number; settings?: GlowFilterSettings; visibility?: AssetFilterVisibility }
  | { type: "shimmer"; strength: number; settings?: ShimmerFilterSettings; visibility?: AssetFilterVisibility };
