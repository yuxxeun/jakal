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

export default function WetonFilterYearPage({
  params,
}: {
  params: Promise<{ weton: string; year: string }>
}) {
  const { weton, year } = use(params)
  const [selectedWeton, setSelectedWeton] = useState(decodeURIComponent(weton))
  const [selectedYear, setSelectedYear] = useState(year)
  const [filterData, setFilterData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchFilterData = async (wetonValue: string, yearValue: string) => {
    setLoading(true)
    try {
      // This would call your Go API: GET /api/v1/weton/{weton}/{year}
      const response = await fetch(`/api/v1/weton/${encodeURIComponent(wetonValue)}/${yearValue}`)
      const data = await response.json()
      setFilterData(data)
    } catch (error) {
      console.error("Error fetching filter data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (weton !== "new" && year !== "new") {
      fetchFilterData(decodeURIComponent(weton), year)
    }
  }, [weton, year])

  const handleSearch = () => {
    if (selectedWeton && selectedYear) {
      fetchFilterData(selectedWeton, selectedYear)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Weton Filter by Year</h1>
        <p className="text-muted-foreground">Filter weton dalam tahun (support strip: selasa-legi)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filter Options
            </CardTitle>
            <CardDescription>Select weton and year to filter dates</CardDescription>
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
            <Button onClick={handleSearch} disabled={loading} className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filter Dates
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filter Results</CardTitle>
            <CardDescription>Dates matching the selected weton in {selectedYear}</CardDescription>
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
                <span className="font-medium">Matching Dates:</span>
                <Badge>{loading ? "..." : "Will show count"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">First Occurrence:</span>
                <span className="text-muted-foreground">{loading ? "Searching..." : "Will show first date"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Matching Dates
          </CardTitle>
          <CardDescription>All dates in {selectedYear} that match the selected weton</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-full text-center text-muted-foreground">Loading matching dates...</div>
            ) : (
              <>
                <div className="p-3 border rounded-lg text-center">
                  <div className="font-medium">Jan 15</div>
                  <div className="text-sm text-muted-foreground">2025-01-15</div>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <div className="font-medium">Jan 20</div>
                  <div className="text-sm text-muted-foreground">2025-01-20</div>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <div className="font-medium">Jan 25</div>
                  <div className="text-sm text-muted-foreground">2025-01-25</div>
                </div>
                <div className="p-3 border rounded-lg text-center text-muted-foreground">
                  <div>More dates...</div>
                  <div className="text-xs">Will show all matches</div>
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
              GET /api/v1/weton/{selectedWeton || "{weton}"}/{selectedYear || "{year}"}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
