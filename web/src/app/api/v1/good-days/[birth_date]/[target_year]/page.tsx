"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Search, Star } from "lucide-react"

export default function GoodDaysPage({
  params,
}: {
  params: Promise<{ birth_date: string; target_year: string }>
}) {
  const { birth_date, target_year } = use(params)
  const [inputBirthDate, setInputBirthDate] = useState(decodeURIComponent(birth_date))
  const [inputTargetYear, setInputTargetYear] = useState(target_year)
  const [goodDaysData, setGoodDaysData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchGoodDaysData = async (birthDate: string, targetYear: string) => {
    setLoading(true)
    try {
      // This would call your Go API: GET /api/v1/good-days/{birth_date}/{target_year}
      const response = await fetch(`/api/v1/good-days/${encodeURIComponent(birthDate)}/${targetYear}`)
      const data = await response.json()
      setGoodDaysData(data)
    } catch (error) {
      console.error("Error fetching good days data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (birth_date !== "new" && target_year !== "new") {
      fetchGoodDaysData(decodeURIComponent(birth_date), target_year)
    }
  }, [birth_date, target_year])

  const handleSearch = () => {
    if (inputBirthDate && inputTargetYear) {
      fetchGoodDaysData(inputBirthDate, inputTargetYear)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Good Days Calculator</h1>
        <p className="text-muted-foreground">Hari baik berdasarkan weton lahir</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Input Information
            </CardTitle>
            <CardDescription>Enter your birth date and target year to find good days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="birth-date-input">Birth Date</Label>
              <Input
                id="birth-date-input"
                type="date"
                value={inputBirthDate}
                onChange={(e) => setInputBirthDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="target-year-input">Target Year</Label>
              <Input
                id="target-year-input"
                type="number"
                value={inputTargetYear}
                onChange={(e) => setInputTargetYear(e.target.value)}
                placeholder="2025"
                min="1900"
                max="2100"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="w-full">
              <Star className="h-4 w-4 mr-2" />
              Find Good Days
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Birth date and weton information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Birth Date:</span>
                <span>{inputBirthDate || "Not selected"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Birth Weton:</span>
                <span className="text-muted-foreground">{loading ? "Calculating..." : "Will show birth weton"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Target Year:</span>
                <span>{inputTargetYear || "Not selected"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Good Days:</span>
                <Badge variant="secondary">{loading ? "..." : "Will show count"}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Good Days Calendar
          </CardTitle>
          <CardDescription>Recommended dates for important activities in {inputTargetYear}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center text-muted-foreground">Loading good days...</div>
            ) : (
              <>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">January</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Jan 15</span>
                      <Badge variant="outline" className="text-xs">
                        Good
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Jan 22</span>
                      <Badge variant="outline" className="text-xs">
                        Excellent
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">February</h4>
                  <div className="text-sm text-muted-foreground">Good days will be displayed here</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">March</h4>
                  <div className="text-sm text-muted-foreground">Good days will be displayed here</div>
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
              GET /api/v1/good-days/{inputBirthDate || "{birth_date}"}/{inputTargetYear || "{target_year}"}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
