"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Calendar, Clock, Sun } from "lucide-react"

export default function Resources() {
  const [todayData, setTodayData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchTodayData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/v1/today")
      const data = await response.json()
      setTodayData(data)
    } catch (error) {
      console.error("Error fetching today data:", error)
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-6 w-6 text-yellow-500" />
              Tanggal Hari Ini
            </CardTitle>
            <CardDescription>Informasi lengkap tanggal Masehi dan Jawa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold text-lg mb-2">Tanggal Masehi</h3>
                  <p className="text-2xl font-bold">{formattedDate}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold text-lg mb-2">Tanggal Jawa</h3>
                  <p className="text-xl font-bold">{loading ? "Memuat..." : "Akan ditampilkan tanggal Jawa"}</p>
                </div>
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
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {loading ? "Menghitung..." : "Akan ditampilkan weton"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Hari Pasaran:</span>
                <span className="text-muted-foreground">{loading ? "..." : "Akan ditampilkan pasaran"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Hari Jawa:</span>
                <span className="text-muted-foreground">{loading ? "..." : "Akan ditampilkan hari Jawa"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Neptu:</span>
                <Badge variant="outline">{loading ? "..." : "Akan ditampilkan neptu"}</Badge>
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
                <h4 className="font-medium mb-2">Sifat Umum:</h4>
                <p className="text-sm text-muted-foreground">
                  {loading
                    ? "Memuat karakteristik..."
                    : "Karakteristik weton akan ditampilkan di sini berdasarkan perhitungan."}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Rekomendasi:</h4>
                <p className="text-sm text-muted-foreground">
                  {loading ? "Memuat rekomendasi..." : "Rekomendasi aktivitas berdasarkan weton hari ini."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Aksi</CardTitle>
          <CardDescription>Perbaharui data atau jelajahi fitur lainnya</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={fetchTodayData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Perbaharui Data
            </Button>
            <Button variant="outline" asChild>
              <Link href="/konversi-tanggal">Konversi Tanggal Lain</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cek-weton">Cek Weton</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
