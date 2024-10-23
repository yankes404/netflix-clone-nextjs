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