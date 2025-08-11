"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Search } from "lucide-react"

export default function DateConversionPage({
  params,
}: {
  params: Promise<{ date: string }>
}) {
  const { date } = use(params)
  const [inputDate, setInputDate] = useState(decodeURIComponent(date))
  const [dateData, setDateData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchDateData = async (targetDate: string) => {
    setLoading(true)
    try {
      // This would call your Go API: GET /api/v1/date/{date}
      const response = await fetch(`/api/v1/date/${encodeURIComponent(targetDate)}`)
      const data = await response.json()
      setDateData(data)
    } catch (error) {
      console.error("Error fetching date data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (date && date !== "new") {
      fetchDateData(decodeURIComponent(date))
    }
  }, [date])

  const handleSearch = () => {
    if (inputDate) {
      fetchDateData(inputDate)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Date Conversion</h1>
        <p className="text-muted-foreground">Konversi tanggal tertentu (Format: YYYY-MM-DD)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Date Input
            </CardTitle>
            <CardDescription>Enter a date to convert to Javanese calendar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date-input">Date (YYYY-MM-DD)</Label>
              <Input
                id="date-input"
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                placeholder="2025-01-15"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Convert Date
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Result</CardTitle>
            <CardDescription>Javanese calendar information for the selected date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Input Date:</span>
                <span>{inputDate || "No date selected"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Javanese Date:</span>
                <span className="text-muted-foreground">{loading ? "Converting..." : "Will show converted date"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Weton:</span>
                <span className="text-muted-foreground">{loading ? "Calculating..." : "Will show weton"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Neptu:</span>
                <span className="text-muted-foreground">{loading ? "Calculating..." : "Will show neptu"}</span>
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
            <code className="text-sm">GET /api/v1/date/{inputDate || "{date}"}</code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
