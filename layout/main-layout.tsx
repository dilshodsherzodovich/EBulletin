"use client"

import type React from "react"

import { Header } from "./header"
import { Sidebar } from "./sidebar"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const user = {
    name: "A.Umarov", // Changed to Latin letters
    role: "Administrator", // Changed to Latin letters
  }

  return (
    <div className="h-screen flex flex-col bg-[#f9fafb]">
      <Header user={user} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
