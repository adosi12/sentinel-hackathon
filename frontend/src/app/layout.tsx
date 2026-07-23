import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sentinel | AI Incident Intelligence",
  description: "Enterprise-grade AI-powered incident intelligence and root cause analysis platform.",
}

import Providers from "./providers"
import Sidebar from "@/components/layout/Sidebar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans">
        <Providers>
          <div className="flex h-screen bg-background overflow-hidden text-foreground">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}

