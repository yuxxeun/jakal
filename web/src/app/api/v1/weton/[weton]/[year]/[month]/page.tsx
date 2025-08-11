"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, Calendar } from "lucide-react"

const wetonOptions = [
  "minggu-legi",
  "minggu-pahing",
  "minggu-pon",
  "minggu-wage",
  "minggu-kliwon",
  "senin-legi",
  "senin-pahing",
  "senin-pon",
  "senin-wage",
  "senin-kliwon",
  "selasa-legi",
  "selasa-pahing",
  "selasa-pon",
  "selasa-wage",
  "selasa-kliwon",
  "rabu-legi",
  "rabu-pahing",
  "rabu-pon",
  "rabu-wage",
  "rabu-kliwon",
  "kamis-legi",
  "kamis-pahing",
  "kamis-pon",
  "kamis-wage",
  "kamis-kliwon",
  "jumat-legi",
  "jumat-pahing",
  "jumat-pon",
  "jumat-wage",
  "jumat-kliwon",
  "sabtu-legi",
  "sabtu-pahing",
  "sabtu-pon",
  "sabtu-wage",
  "sabtu-kliwon",
]

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

export default function WetonFilterMonthPage({
  params,
}: {
  params: Promise<{ weton: string; year: string; month: string }>
}) {
  const { weton, year, month } = use(params)
  const [selectedWeton, setSelectedWeton] = useState(decodeURIComponent(weton))
  const [selectedYear, setSelectedYear] = useState(year)
  const [selectedMonth, setSelectedMonth] = useState(month)
  const [filterData, setFilterData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchFilterData = async (wetonValue: string, yearValue: string, monthValue: string) => {
    setLoading(true)
    try {
      // This would call your Go API: GET /api/v1/weton/{weton}/{year}/{month}
      const response = await fetch(`/api/v1/weton/${encodeURIComponent(wetonValue)}/${yearValue}/${monthValue}`)
      const data = await response.json()
      setFilterData(data)
    } catch (error) {
      console.error("Error fetching filter data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (weton !== "new" && year !== "new" && month !== "new") {
      fetchFilterData(decodeURIComponent(weton), year, month)
    }
  }, [weton, year, month])

  const handleSearch = () => {
    if (selectedWeton && selectedYear && selectedMonth) {
      fetchFilterData(selectedWeton, selectedYear, selectedMonth)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Weton Filter by Month</h1>
        <p className="text-muted-foreground">Filter weton dalam bulan tertentu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filter Options
            </CardTitle>
            <CardDescription>Select weton, year, and month to filter specific dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="weton-select">Weton</Label>
              <Select value={selectedWeton} onValueChange={setSelectedWeton}>
                <SelectTrigger>
                  <SelectValue placeholder="Select weton" />
                </SelectTrigger>
                <SelectContent>
                  {wetonOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year-input">Year</Label>
              <Input
                id="year-input"
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                placeholder="2025"
                min="1900"
                max="2100"
              />
            </div>
            <div>
              <Label htmlFor="month-select">Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
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
              <Filter className="h-4 w-4 mr-2" />
              Filter Dates
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filter Results</CardTitle>
            <CardDescription>
              Dates matching the selected weton in {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Selected Weton:</span>
                <Badge variant="secondary">
                  {selectedWeton ? selectedWeton.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "None"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Year:</span>
                <span>{selectedYear || "Not selected"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Month:</span>
                <span>{months.find((m) => m.value === selectedMonth)?.label || "Not selected"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Matching Dates:</span>
                <Badge>{loading ? "..." : "Will show count"}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Matching Dates in {months.find((m) => m.value === selectedMonth)?.label}
          </CardTitle>
          <CardDescription>All dates in the selected month that match the weton</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {loading ? (
              <div className="col-span-full text-center text-muted-foreground">Loading matching dates...</div>
            ) : (
              <>
                <div className="p-3 border rounded-lg text-center">
                  <div className="font-medium text-lg">5</div>
                  <div className="text-xs text-muted-foreground">Jan 5</div>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <div className="font-medium text-lg">10</div>
                  <div className="text-xs text-muted-foreground">Jan 10</div>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <div className="font-medium text-lg">15</div>
                  <div className="text-xs text-muted-foreground">Jan 15</div>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <div className="font-medium text-lg">20</div>
                  <div className="text-xs text-muted-foreground">Jan 20</div>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <div className="font-medium text-lg">25</div>
                  <div className="text-xs text-muted-foreground">Jan 25</div>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <div className="font-medium text-lg">30</div>
                  <div className="text-xs text-muted-foreground">Jan 30</div>
                </div>
                <div className="p-3 border rounded-lg text-center text-muted-foreground">
                  <div className="text-sm">More...</div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>API Endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <code className="text-sm">
              GET /api/v1/weton/{selectedWeton || "{weton}"}/{selectedYear || "{year}"}/{selectedMonth || "{month}"}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
