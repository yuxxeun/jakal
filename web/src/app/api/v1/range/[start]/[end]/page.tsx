"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarRange, Search } from "lucide-react"

export default function DateRangePage({
  params,
}: {
  params: Promise<{ start: string; end: string }>
}) {
  const { start, end } = use(params)
  const [startDate, setStartDate] = useState(decodeURIComponent(start))
  const [endDate, setEndDate] = useState(decodeURIComponent(end))
  const [rangeData, setRangeData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchRangeData = async (startDate: string, endDate: string) => {
    setLoading(true)
    try {
      // This would call your Go API: GET /api/v1/range/{start}/{end}
      const response = await fetch(`/api/v1/range/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`)
      const data = await response.json()
      setRangeData(data)
    } catch (error) {
      console.error("Error fetching range data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (start !== "new" && end !== "new") {
      fetchRangeData(decodeURIComponent(start), decodeURIComponent(end))
    }
  }, [start, end])

  const handleSearch = () => {
    if (startDate && endDate) {
      fetchRangeData(startDate, endDate)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Date Range Analysis</h1>
        <p className="text-muted-foreground">Range tanggal (maksimal 1 tahun)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Date Range Input
            </CardTitle>
            <CardDescription>Select start and end dates for analysis</CardDescription>
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
              <CalendarRange className="h-4 w-4 mr-2" />
              Analyze Range
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Range Analysis</CardTitle>
            <CardDescription>Statistical information for the selected date range</CardDescription>
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
                <span className="text-muted-foreground">{loading ? "Calculating..." : "Will show total days"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Weton Distribution:</span>
                <span className="text-muted-foreground">{loading ? "Analyzing..." : "Will show distribution"}</span>
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
              GET /api/v1/range/{startDate || "{start}"}/{endDate || "{end}"}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
