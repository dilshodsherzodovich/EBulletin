import { UserRole } from "@/api/types/user";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRoleName = (roleName: UserRole): string => {
  switch (roleName) {
    case "ADMIN": {
      return "Administrator";
    }
    case "MODERATOR": {
      return "Moderator";
    }
    case "OBSERVER": {
      return "Kuzatuvchi";
    }
    case "OPERATOR": {
      return "Operator";
    }
    default: {
      return "";
    }
  }
};
