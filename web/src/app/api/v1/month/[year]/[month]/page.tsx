"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search } from "lucide-react"

const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
]

export default function MonthPage({
  params,
}: {
  params: Promise<{ year: string; month: string }>
}) {
  const { year, month } = use(params)
  const [inputYear, setInputYear] = useState(year)
  const [inputMonth, setInputMonth] = useState(month)
  const [monthData, setMonthData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchMonthData = async (targetYear: string, targetMonth: string) => {
    setLoading(true)
    try {
      // This would call your Go API: GET /api/v1/month/{year}/{month}
      const response = await fetch(`/api/v1/month/${targetYear}/${targetMonth}`)
      const data = await response.json()
      setMonthData(data)
    } catch (error) {
      console.error("Error fetching month data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (year !== "new" && month !== "new") {
      fetchMonthData(year, month)
    }
  }, [year, month])

  const handleSearch = () => {
    if (inputYear && inputMonth) {
      fetchMonthData(inputYear, inputMonth)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Month Analysis</h1>
        <p className="text-muted-foreground">Data lengkap untuk bulan tertentu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Month Selection
            </CardTitle>
            <CardDescription>Select year and month for detailed analysis</CardDescription>
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
            <div>
              <Label htmlFor="month-select">Month</Label>
              <Select value={inputMonth} onValueChange={setInputMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch} disabled={loading} className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Get Month Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Month Information</CardTitle>
            <CardDescription>
              Javanese calendar data for {months.find((m) => m.value === inputMonth)?.label} {inputYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Year:</span>
                <span>{inputYear || "Not selected"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Month:</span>
                <span>{months.find((m) => m.value === inputMonth)?.label || "Not selected"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Days in Month:</span>
                <span className="text-muted-foreground">{loading ? "Calculating..." : "Will show days count"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Weton Distribution:</span>
                <span className="text-muted-foreground">
                  {loading ? "Analyzing..." : "Will show weton distribution"}
                </span>
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
              GET /api/v1/month/{inputYear || "{year}"}/{inputMonth || "{month}"}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
