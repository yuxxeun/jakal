"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Calendar } from "lucide-react"

export default function TodayPage() {
  const [todayData, setTodayData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchTodayData = async () => {
    setLoading(true)
    try {
      // This would call your Go API: GET /api/v1/today
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Today's Javanese Date</h1>
        <p className="text-muted-foreground">Tanggal Jawa hari ini</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Current Date Information
            </CardTitle>
            <CardDescription>Today's date in Javanese calendar system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Gregorian Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Javanese Date:</span>
                <span className="text-muted-foreground">{loading ? "Loading..." : "Will show Javanese date"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Weton:</span>
                <span className="text-muted-foreground">{loading ? "Loading..." : "Will show weton"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Neptu:</span>
                <span className="text-muted-foreground">{loading ? "Loading..." : "Will show neptu"}</span>
              </div>
            </div>
            <Button onClick={fetchTodayData} disabled={loading} className="w-full mt-6">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Endpoint</CardTitle>
            <CardDescription>Technical details for this endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <code className="text-sm">GET /api/v1/today</code>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Returns today's date with Javanese calendar information including weton and neptu calculations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
