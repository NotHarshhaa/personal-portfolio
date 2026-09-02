import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Detects if the current device/viewport is in mobile or tablet mode.
 * Covers responsive breakpoints (< 1024px) as well as touch devices (tablets/smartphones).
 */
export function isMobileOrTablet(): boolean {
  if (typeof window === 'undefined') return false

  const isSmallScreen = window.innerWidth < 1024
  const isTouchDevice =
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(hover: none)').matches ||
    (navigator.maxTouchPoints > 0 && window.innerWidth < 1280)

  return isSmallScreen || isTouchDevice
}
