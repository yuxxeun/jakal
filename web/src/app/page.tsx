import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Filter } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Jakal - Javanese Calendar API</h1>
        <p className="text-xl text-muted-foreground mb-8">
          API untuk konversi tanggal Jawa dengan perhitungan weton dan neptu yang akurat
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/api/v1/today">Get Today's Date</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs">View Documentation</Link>
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
              <Link href="/api/v1/today">Today's Date</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/convert">Date Conversion</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/range">Date Range</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Weton & Neptu
            </CardTitle>
            <CardDescription>Weton calculations and compatibility checks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/weton">Check Weton</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/neptu">Calculate Neptu</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/compatibility">Compatibility</Link>
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
