import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalize = (s: string) =>
  s
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());