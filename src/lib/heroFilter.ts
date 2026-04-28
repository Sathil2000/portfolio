import type { HeroFilter } from '@/contexts/AppContext';

/**
 * Build a CSS `filter` string for the hero image based on a filter type and 0-100 strength.
 * The strength scales each component proportionally so 0 = identity, 100 = max effect.
 */
export function getHeroFilterCSS(filter: HeroFilter | undefined): string {
  if (!filter || filter.type === 'none') return 'none';
  const s = Math.max(0, Math.min(100, filter.strength)) / 100;
  const lerp = (a: number, b: number) => a + (b - a) * s;

  switch (filter.type) {
    case 'sharpen':
      // Higher contrast + slight saturation boost simulates "sharper" look.
      return `contrast(${lerp(1, 1.45).toFixed(2)}) saturate(${lerp(1, 1.25).toFixed(2)}) brightness(${lerp(1, 1.04).toFixed(2)})`;
    case 'vivid':
      return `saturate(${lerp(1, 1.7).toFixed(2)}) contrast(${lerp(1, 1.2).toFixed(2)}) brightness(${lerp(1, 1.05).toFixed(2)})`;
    case 'cinematic':
      return `contrast(${lerp(1, 1.3).toFixed(2)}) saturate(${lerp(1, 0.85).toFixed(2)}) sepia(${lerp(0, 0.15).toFixed(2)}) brightness(${lerp(1, 0.96).toFixed(2)})`;
    case 'noir':
      return `grayscale(${lerp(0, 1).toFixed(2)}) contrast(${lerp(1, 1.4).toFixed(2)}) brightness(${lerp(1, 0.95).toFixed(2)})`;
    case 'warm':
      return `sepia(${lerp(0, 0.5).toFixed(2)}) saturate(${lerp(1, 1.3).toFixed(2)}) hue-rotate(-${lerp(0, 12).toFixed(0)}deg) brightness(${lerp(1, 1.05).toFixed(2)})`;
    case 'cool':
      return `saturate(${lerp(1, 1.15).toFixed(2)}) hue-rotate(${lerp(0, 18).toFixed(0)}deg) brightness(${lerp(1, 1.02).toFixed(2)})`;
    case 'dreamy':
      return `blur(${lerp(0, 1.4).toFixed(2)}px) saturate(${lerp(1, 1.25).toFixed(2)}) brightness(${lerp(1, 1.08).toFixed(2)})`;
    default:
      return 'none';
  }
}

export const HERO_FILTER_OPTIONS: { id: HeroFilter['type']; label: string; desc: string }[] = [
  { id: 'none', label: 'None', desc: 'Original image' },
  { id: 'sharpen', label: 'Sharpen', desc: 'Crisp + punchy contrast' },
  { id: 'vivid', label: 'Vivid', desc: 'Bold colors' },
  { id: 'cinematic', label: 'Cinematic', desc: 'Filmic mood' },
  { id: 'noir', label: 'Noir', desc: 'Black & white' },
  { id: 'warm', label: 'Warm', desc: 'Golden hour' },
  { id: 'cool', label: 'Cool', desc: 'Icy blue' },
  { id: 'dreamy', label: 'Dreamy', desc: 'Soft glow' },
];
