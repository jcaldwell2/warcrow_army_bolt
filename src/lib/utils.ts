
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export function getScrollAreaHeight(isCompact: boolean = false, itemCount: number = 0): string {
  if (isCompact) {
    return "max-h-[300px]";
  }
  
  // For activity feed, limit height based on item count
  if (itemCount > 0) {
    // Calculate height based on items with padding: approx. 80px per item + some padding
    const baseItemHeight = 80; 
    const minHeight = 200;
    const maxHeight = 500;
    
    const calculatedHeight = Math.min(maxHeight, Math.max(minHeight, itemCount * baseItemHeight));
    return `max-h-[${calculatedHeight}px]`;
  }
  
  return "max-h-[500px]";
}
