import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

export function formatTime(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = Number(h);
  if (Number.isNaN(hour)) return time;
  const period = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${m ?? "00"} ${period}`;
}

export function formatPrice(price: string): string {
  if (!price) return "";
  const trimmed = price.trim();
  if (/^\d/.test(trimmed)) return `$${trimmed}`;
  return trimmed;
}
