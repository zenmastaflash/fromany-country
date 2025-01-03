import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Get appropriate text color (black or white) based on background
export function getTextColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#F0F0F0'; // Default to light text if invalid hex

  const backgroundLuminance = getLuminance(rgb.r, rgb.g, rgb.b);
  const whiteLuminance = getLuminance(240, 240, 240); // #F0F0F0
  const blackLuminance = getLuminance(0, 0, 0);

  const whiteContrast = getContrastRatio(backgroundLuminance, whiteLuminance);
  const blackContrast = getContrastRatio(backgroundLuminance, blackLuminance);

  return whiteContrast > blackContrast ? '#F0F0F0' : '#000000';
}

// Custom hook for dynamic text color
export function useDynamicTextColor(backgroundColor: string) {
  return getTextColor(backgroundColor);
}
