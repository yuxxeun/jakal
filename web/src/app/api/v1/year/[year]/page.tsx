"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Search } from "lucide-react"

export default function YearPage({
  params,
}: {
  params: Promise<{ year: string }>
}) {
  const { year } = use(params)
  const [inputYear, setInputYear] = useState(year)
  const [yearData, setYearData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchYearData = async (targetYear: string) => {
    setLoading(true)
    try {
      // This would call your Go API: GET /api/v1/year/{year}
      const response = await fetch(`/api/v1/year/${targetYear}`)
      const data = await response.json()
      setYearData(data)
    } catch (error) {
      console.error("Error fetching year data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (year && year !== "new") {
      fetchYearData(year)
    }
  }, [year])

  const handleSearch = () => {
    if (inputYear) {
      fetchYearData(inputYear)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Year Analysis</h1>
        <p className="text-muted-foreground">Data lengkap untuk tahun tertentu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Year Input
            </CardTitle>
            <CardDescription>Enter a year to get complete Javanese calendar data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="year-input">Year</Label>
              <Input
                id="year-input"
                type="number"
                value={inputYear}
                onChange={(e) => setInputYear(e.target.value)}
                placeholder="2025"
                min="1900"
                max="2100"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Get Year Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Year Information</CardTitle>
            <CardDescription>Complete Javanese calendar data for {inputYear || "selected year"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Year:</span>
                <span>{inputYear || "Not selected"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Javanese Year:</span>
                <span className="text-muted-foreground">{loading ? "Loading..." : "Will show Javanese year"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Days:</span>
                <span className="text-muted-foreground">{loading ? "Calculating..." : "Will show total days"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Leap Year:</span>
                <span className="text-muted-foreground">{loading ? "Checking..." : "Will show leap year status"}</span>
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
            <code className="text-sm">GET /api/v1/year/{inputYear || "{year}"}</code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
