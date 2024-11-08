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
  const secondsStr = secs > 0 ? `${secs.toFixed(0)}s` : '';

  return [hoursStr, minutesStr, secondsStr].filter(Boolean).join(' ');
}

export function formatSecondsTwo (seconds: number): string {
  const roundedSeconds = Math.round(seconds);
  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor((roundedSeconds % 3600) / 60);
  const secs = roundedSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  } else {
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}

export function isNumber (value: number) {
  if (!isNaN(value) && typeof value === "number") return true;
  else return false;
}

export function stringToHex(str: string) {
  return Array.from(str)
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}