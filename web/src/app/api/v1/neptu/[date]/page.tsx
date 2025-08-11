"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Calculator, Search } from "lucide-react"

export default function NeptuPage({
  params,
}: {
  params: Promise<{ date: string }>
}) {
  const { date } = use(params)
  const [inputDate, setInputDate] = useState(decodeURIComponent(date))
  const [neptuData, setNeptuData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchNeptuData = async (targetDate: string) => {
    setLoading(true)
    try {
      // This would call your Go API: GET /api/v1/neptu/{date}
      const response = await fetch(`/api/v1/neptu/${encodeURIComponent(targetDate)}`)
      const data = await response.json()
      setNeptuData(data)
    } catch (error) {
      console.error("Error fetching neptu data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (date && date !== "new") {
      fetchNeptuData(decodeURIComponent(date))
    }
  }, [date])

  const handleSearch = () => {
    if (inputDate) {
      fetchNeptuData(inputDate)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Neptu Calculator</h1>
        <p className="text-muted-foreground">Neptu untuk tanggal tertentu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Date Input
            </CardTitle>
            <CardDescription>Enter a date to calculate its neptu value</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date-input">Date</Label>
              <Input id="date-input" type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Neptu
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Neptu Calculation</CardTitle>
            <CardDescription>Detailed neptu breakdown for the selected date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Date:</span>
                <span>{inputDate || "Not selected"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Neptu:</span>
                <span className="text-2xl font-bold text-primary">{loading ? "..." : "Will show neptu"}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Hari Pasaran:</span>
                  <span className="text-muted-foreground">{loading ? "..." : "Will show pasaran neptu"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Hari Jawa:</span>
                  <span className="text-muted-foreground">{loading ? "..." : "Will show hari neptu"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Neptu Strength</Label>
                <Progress value={loading ? 0 : 75} className="w-full" />
                <p className="text-xs text-muted-foreground">Based on traditional Javanese calculations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Neptu Interpretation</CardTitle>
          <CardDescription>Understanding your neptu value and its significance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Characteristics</h4>
              <p className="text-sm text-muted-foreground">
                {loading
                  ? "Loading characteristics..."
                  : "Neptu-based personality traits and characteristics will be shown here."}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <p className="text-sm text-muted-foreground">
                {loading
                  ? "Loading recommendations..."
                  : "Traditional recommendations based on your neptu value will be displayed here."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>API Endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <code className="text-sm">GET /api/v1/neptu/{inputDate || "{date}"}</code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
