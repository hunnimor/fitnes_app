import { clsx, type ClassValue } from "clsx";

// Simple cn utility for React Native (without tailwind-merge)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
