import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMediaStatus(status: string) {
  switch (status) {
    case "WATCHING": return "Watching";
    case "COMPLETED": return "Completed";
    case "PLAN_TO_WATCH": return "Plan to Watch";
    case "DROPPED": return "Dropped";
    case "ON_HOLD": return "On Hold";
    case "REWATCHING": return "Rewatching";
    default: return status;
  }
}
