import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, priceType: string): string {
  const type = priceType === "MONTHLY" ? "/mo" : priceType === "NIGHTLY" ? "/night" : ""
  return `$${price.toLocaleString()}${type}`
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
