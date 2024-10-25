import { ProfileImage } from "@/features/profiles/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProfileImage (
  variant: ProfileImage
) {
  return `/profiles/${variant}.webp`
}

export function formatSeconds (seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const hoursStr = hours > 0 ? `${hours}h` : '';
  const minutesStr = minutes > 0 ? `${minutes}m` : '';
  const secondsStr = secs > 0 ? `${secs}s` : '';

  return [hoursStr, minutesStr, secondsStr].filter(Boolean).join(' ');
}