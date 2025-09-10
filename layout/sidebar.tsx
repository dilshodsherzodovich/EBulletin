"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Building2,
  FileText,
  BarChart3,
  Folder,
  Monitor,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { canAccessSection } from "@/lib/permissions";
import { LoginResponse } from "@/api/types/auth";
import { UserData } from "@/api/types/user";

const navigationItems = [
  {
    name: "Monitoring", // Monitoring
    href: "/",
    icon: Monitor,
    section: "dashboard",
  },
  {
    name: "Foydalanuvchilar", // Users
    href: "/users",
    icon: Users,
    section: "users",
  },
  {
    name: "Quyi tashkilotlar", // Departments
    href: "/departments",
    icon: Building2,
    section: "departments",
  },
  {
    name: "Tashkilotlar", // Organizations
    href: "/organizations",
    icon: Folder,
    section: "organizations",
  },
  {
    name: "Byulletenlar", // Bulletins
    href: "/bulletins",
    icon: FileText,
    section: "bulletins",
  },
  // {
  //   name: "Tuzilma", // Structure
  //   href: "/structure",
  //   icon: BarChart3,
  // },
  // {
  //   name: "Kategoriyalar", // Categories
  //   href: "/categories",
  //   icon: Archive,
  // },
  {
    name: "Klassifikatorlar", // Classificators
    href: "/classificators",
    icon: BookOpen,
    section: "classificator",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const user: UserData = JSON.parse(localStorage.getItem("user")!);

  const filteredNavigationItems = navigationItems.filter((navItem) =>
    canAccessSection(user, navItem.section)
  );

  return (
    <aside className="w-64 bg-[var(--primary-bg,#ffffff)] border-r border-[var(--border,#e5e7eb)] h-full">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-[var(--foreground)] text-sm">
              {/* Milliy Statistika */}
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">
              Qo'mitasi
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {filteredNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
