import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Home, Book, Activity } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jakal - Javanese Calendar API",
  description: "API untuk konversi tanggal Jawa dengan perhitungan weton dan neptu yang akurat",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            <header className="border-b">
              <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <Calendar className="h-6 w-6" />
                    Jakal API
                  </Link>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/">
                        <Home className="h-4 w-4 mr-2" />
                        Home
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/docs">
                        <Book className="h-4 w-4 mr-2" />
                        Docs
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/health">
                        <Activity className="h-4 w-4 mr-2" />
                        Health
                      </Link>
                    </Button>
                  </div>
                </nav>
              </div>
            </header>
            <main>{children}</main>
            <footer className="border-t mt-12">
              <div className="container mx-auto px-4 py-8">
                <div className="text-center text-muted-foreground">
                  <p>&copy; 2025 Jakal - Javanese Calendar API. Built with Go and Next.js.</p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
