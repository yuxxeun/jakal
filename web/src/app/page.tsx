import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Filter } from "lucide-react"
import { Site } from "@/lib/site"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">
          {Site.title} - {Site.tagline}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          API untuk konversi tanggal Jawa dengan perhitungan weton dan neptu yang akurat
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/hari-ini">
              Cek weton hari ini
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dokumentasi">Baca dokumentasi</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Basic Operations
            </CardTitle>
            <CardDescription>Core date conversion and calendar operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/api/v1/today">Hari ini</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/konversi">Konversi tanggal</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/range">Rentang tanggal</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Weton & Neptu
            </CardTitle>
            <CardDescription>Perhitungan weton dan kecocokan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/weton">Cek Weton</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/neptu">Hitung Neptu</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/kecocokan">Kecocokan</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtering & Stats
            </CardTitle>
            <CardDescription>Advanced filtering and statistical data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/filter">Filter Dates</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/statistics">View Statistics</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/good-days">Good Days</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
