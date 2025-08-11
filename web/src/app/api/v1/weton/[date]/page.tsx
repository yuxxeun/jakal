"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Clock, Search } from "lucide-react"

export default function WetonPage({
  params,
}: {
  params: Promise<{ date: string }>
}) {
  const { date } = use(params)
  const [inputDate, setInputDate] = useState(decodeURIComponent(date))
  const [wetonData, setWetonData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchWetonData = async (targetDate: string) => {
    setLoading(true)
    try {
      // This would call your Go API: GET /api/v1/weton/{date}
      const response = await fetch(`/api/v1/weton/${encodeURIComponent(targetDate)}`)
      const data = await response.json()
      setWetonData(data)
    } catch (error) {
      console.error("Error fetching weton data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (date && date !== "new") {
      fetchWetonData(decodeURIComponent(date))
    }
  }, [date])

  const handleSearch = () => {
    if (inputDate) {
      fetchWetonData(inputDate)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Weton Calculator</h1>
        <p className="text-muted-foreground">Weton untuk tanggal tertentu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Date Input
            </CardTitle>
            <CardDescription>Enter a date to calculate its weton</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date-input">Date</Label>
              <Input id="date-input" type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="w-full">
              <Clock className="h-4 w-4 mr-2" />
              Calculate Weton
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weton Information</CardTitle>
            <CardDescription>Detailed weton calculation for the selected date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Date:</span>
                <span>{inputDate || "Not selected"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Weton:</span>
                <div className="text-muted-foreground">
                  {loading ? (
                    "Calculating..."
                  ) : (
                    <div className="flex gap-2">
                      <Badge variant="secondary">Will show weton</Badge>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Hari Pasaran:</span>
                <span className="text-muted-foreground">{loading ? "Calculating..." : "Will show pasaran"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Hari Jawa:</span>
                <span className="text-muted-foreground">{loading ? "Calculating..." : "Will show hari jawa"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Weton Meaning</CardTitle>
          <CardDescription>Understanding your weton characteristics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            {loading
              ? "Loading weton meaning..."
              : "Weton characteristics and meaning will be displayed here based on the calculation."}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>API Endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <code className="text-sm">GET /api/v1/weton/{inputDate || "{date}"}</code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
