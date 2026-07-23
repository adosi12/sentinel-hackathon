"use client"
import "./globals.css"
import Providers from "./providers"
import Sidebar from "@/components/layout/Sidebar"
import AuthWrapper from "@/components/layout/AuthWrapper"
import { usePathname } from 'next/navigation'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <html lang="en" className="dark">
      <body className="font-sans">
        <Providers>
          <AuthWrapper>
            {isLoginPage ? (
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            ) : (
              <div className="flex h-screen bg-background overflow-hidden text-foreground">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                  {children}
                </main>
              </div>
            )}
          </AuthWrapper>
        </Providers>
      </body>
    </html>
  )
}

