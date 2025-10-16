import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <main className="container relative mx-auto px-4 py-16 md:py-24">
        {/* Eyebrow */}
        <div className="flex justify-center mb-6">
          <Badge variant="outline" className="px-3 py-1.5 text-xs font-medium border-border bg-background/60">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" aria-hidden="true" />
            Kalender Jawa
          </Badge>
        </div>

        {/* Hero */}
        <section className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
            Hitung Weton & Hari Baik Secara Instan
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Konversi Masehi ke Jawa, cek neptu, dan temukan hari baik—tanpa ribet.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button size="lg" className="sm:w-auto px-6">
              <Link href="/weton" className="inline-flex items-center">
                Cek Weton
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="sm:w-auto px-6">
              <Link href="/hari-ini" className="inline-flex items-center">
                Lihat Hari Ini
              </Link>
            </Button>
          </div>

          {/* Tiny reassurance row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <span className="text-xs md:text-sm text-muted-foreground">Akurat • Cepat • Tanpa Iklan</span>
          </div>
        </section>
      </main>
    </div>
  )
}
