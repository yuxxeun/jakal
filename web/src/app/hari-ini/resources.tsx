"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TodayData {
  gregorian_date: string
  day: string
  pasaran: string
  weton: string
  javanese_year: number
  day_of_week: number
  pasaran_index: number
  neptu: number
}

interface ApiResponse {
  status: string
  message: string
  data: TodayData
}

export default function Resources() {
  const [todayData, setTodayData] = useState<TodayData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTodayData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:8080/api/v1/today")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const json: ApiResponse = await response.json()

      if (json.data) {
        setTodayData(json.data)
      } else {
        throw new Error("Data tidak ditemukan dalam response")
      }
    } catch (error) {
      console.error("Error fetching today data:", error)
      setError(error instanceof Error ? error.message : "Gagal mengambil data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodayData()
  }, [])

  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hari Ini</h1>
        <p className="text-muted-foreground">Informasi lengkap tanggal Jawa hari ini</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tanggal Masehi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Tanggal Masehi
            </CardTitle>
            <CardDescription>Tanggal berdasarkan kalender Gregorian</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Tanggal:</span>
                <span className="text-muted-foreground">{formattedDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tanggal Jawa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tanggal Jawa
            </CardTitle>
            <CardDescription>Tanggal berdasarkan kalender Jawa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Hari Jawa:</span>
                <span className="text-muted-foreground">
                  {loading ? "..." : todayData?.day ?? "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Pasaran:</span>
                <span className="text-muted-foreground">
                  {loading ? "..." : todayData?.pasaran ?? "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Tahun Jawa:</span>
                <span className="text-muted-foreground">
                  {loading ? "..." : todayData?.javanese_year ?? "-"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Weton</CardTitle>
            <CardDescription>Weton dan neptu hari ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Weton:</span>
                <Badge variant="default" className="text-md px-3 py-1">
                  {loading ? "Menghitung..." : todayData?.weton ?? "-"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Neptu:</span>
                <Badge>{loading ? "..." : todayData?.neptu ?? "-"}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Karakteristik Weton</CardTitle>
            <CardDescription>Sifat dan karakteristik berdasarkan weton hari ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertDescription>
                    Bagian ini sedang dalam tahap pengembangan.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}