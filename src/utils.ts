import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Copied from Shadcn - https://ui.shadcn.com
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
