"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Users,
  Building2,
  FileText,
  BarChart3,
  Folder,
  Monitor,
  BookOpen,
  ChevronLeft,
  ChevronRight,
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredNavigationItems = navigationItems.filter((navItem) =>
    canAccessSection(user, navItem.section)
  );

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={cn(
        "bg-[var(--primary-bg,#ffffff)] border-r border-[var(--border,#e5e7eb)] h-full transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn("h-full flex flex-col", isCollapsed ? "p-3" : "p-6")}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
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
          )}

          {isCollapsed && (
            <div className="w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center mx-auto">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={cn(
              "p-1.5 rounded-lg hover:bg-[var(--primary)]/10 transition-colors flex-shrink-0",
              isCollapsed ? "absolute top-3 right-1.5" : "relative"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-[var(--muted-foreground)]" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {filteredNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-colors group relative",
                  isCollapsed ? "justify-center p-3" : "space-x-3 px-3 py-2",
                  isActive
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="transition-opacity duration-300">
                    {item.name}
                  </span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
