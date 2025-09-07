import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPageCount(
  totalItems: number,
  itemsPerPage: number = 10
): number {
  return Math.ceil(totalItems / itemsPerPage);
}

export const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("uz-UZ");
  } catch {
    return dateString;
  }
};
