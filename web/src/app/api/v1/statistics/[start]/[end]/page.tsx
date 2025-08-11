"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Search, TrendingUp } from "lucide-react"

export default function StatisticsPage({
  params,
}: {
  params: Promise<{ start: string; end: string }>
}) {
  const { start, end } = use(params)
  const [startDate, setStartDate] = useState(decodeURIComponent(start))
  const [endDate, setEndDate] = useState(decodeURIComponent(end))
  const [statisticsData, setStatisticsData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchStatisticsData = async (startDate: string, endDate: string) => {
    setLoading(true)
    try {
      // This would call your Go API: GET /api/v1/statistics/{start}/{end}
      const response = await fetch(`/api/v1/statistics/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`)
      const data = await response.json()
      setStatisticsData(data)
    } catch (error) {
      console.error("Error fetching statistics data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (start !== "new" && end !== "new") {
      fetchStatisticsData(decodeURIComponent(start), decodeURIComponent(end))
    }
  }, [start, end])

  const handleSearch = () => {
    if (startDate && endDate) {
      fetchStatisticsData(startDate, endDate)
    }
  }

  const mockWetonStats = [
    { weton: "Minggu Legi", count: 15, percentage: 12 },
    { weton: "Senin Pahing", count: 18, percentage: 14 },
    { weton: "Selasa Pon", count: 12, percentage: 9 },
    { weton: "Rabu Wage", count: 20, percentage: 16 },
    { weton: "Kamis Kliwon", count: 14, percentage: 11 },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Weton Statistics</h1>
        <p className="text-muted-foreground">Statistik weton dalam periode tertentu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Date Range
            </CardTitle>
            <CardDescription>Select date range for statistical analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Statistics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Period Overview</CardTitle>
            <CardDescription>Statistical summary for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Start Date:</span>
                <span>{startDate || "Not selected"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">End Date:</span>
                <span>{endDate || "Not selected"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Days:</span>
                <Badge>{loading ? "..." : "Will show total"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Unique Wetons:</span>
                <Badge variant="secondary">{loading ? "..." : "Will show count"}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weton Distribution
          </CardTitle>
          <CardDescription>Frequency distribution of wetons in the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-muted-foreground">Calculating weton distribution...</div>
            ) : (
              mockWetonStats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{stat.weton}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{stat.count} days</Badge>
                      <span className="text-sm text-muted-foreground">{stat.percentage}%</span>
                    </div>
                  </div>
                  <Progress value={stat.percentage} className="w-full" />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Common Wetons</CardTitle>
            <CardDescription>Top 5 most frequent wetons in the period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <div className="text-muted-foreground">Loading top wetons...</div>
              ) : (
                mockWetonStats.slice(0, 3).map((stat, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{stat.weton}</div>
                      <div className="text-sm text-muted-foreground">{stat.count} occurrences</div>
                    </div>
                    <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Neptu Analysis</CardTitle>
            <CardDescription>Statistical analysis of neptu values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Average Neptu:</span>
                <Badge>{loading ? "..." : "10.5"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Most Common Neptu:</span>
                <Badge variant="secondary">{loading ? "..." : "9"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Neptu Range:</span>
                <span className="text-muted-foreground">{loading ? "..." : "6 - 15"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">High Neptu Days:</span>
                <Badge variant="outline">{loading ? "..." : "25%"}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>API Endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <code className="text-sm">
              GET /api/v1/statistics/{startDate || "{start}"}/{endDate || "{end}"}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
