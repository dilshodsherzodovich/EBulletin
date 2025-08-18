"use client";
import type React from "react";
import { usePathname } from "next/navigation";
import { MainLayout } from "@/layout/main-layout";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return isLoginPage ? children : <MainLayout>{children}</MainLayout>;
}
