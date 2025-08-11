"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, Users } from "lucide-react"

export default function CompatibilityPage({
  params,
}: {
  params: Promise<{ date1: string; date2: string }>
}) {
  const { date1, date2 } = use(params)
  const [inputDate1, setInputDate1] = useState(decodeURIComponent(date1))
  const [inputDate2, setInputDate2] = useState(decodeURIComponent(date2))
  const [compatibilityData, setCompatibilityData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchCompatibilityData = async (targetDate1: string, targetDate2: string) => {
    setLoading(true)
    try {
      // This would call your Go API: GET /api/v1/compatibility/{date1}/{date2}
      const response = await fetch(
        `/api/v1/compatibility/${encodeURIComponent(targetDate1)}/${encodeURIComponent(targetDate2)}`,
      )
      const data = await response.json()
      setCompatibilityData(data)
    } catch (error) {
      console.error("Error fetching compatibility data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (date1 !== "new" && date2 !== "new") {
      fetchCompatibilityData(decodeURIComponent(date1), decodeURIComponent(date2))
    }
  }, [date1, date2])

  const handleSearch = () => {
    if (inputDate1 && inputDate2) {
      fetchCompatibilityData(inputDate1, inputDate2)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Weton Compatibility</h1>
        <p className="text-muted-foreground">Kecocokan weton dua tanggal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Date Comparison
            </CardTitle>
            <CardDescription>Enter two dates to check their weton compatibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date1-input">First Date</Label>
              <Input id="date1-input" type="date" value={inputDate1} onChange={(e) => setInputDate1(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="date2-input">Second Date</Label>
              <Input id="date2-input" type="date" value={inputDate2} onChange={(e) => setInputDate2(e.target.value)} />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="w-full">
              <Heart className="h-4 w-4 mr-2" />
              Check Compatibility
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Compatibility Result
            </CardTitle>
            <CardDescription>Weton compatibility analysis between the two dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{loading ? "..." : "85%"}</div>
                <Badge variant="secondary" className="mb-4">
                  {loading ? "Calculating..." : "High Compatibility"}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label>Compatibility Score</Label>
                <Progress value={loading ? 0 : 85} className="w-full" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Date 1 Weton:</span>
                  <p className="text-muted-foreground">{loading ? "..." : "Will show weton 1"}</p>
                </div>
                <div>
                  <span className="font-medium">Date 2 Weton:</span>
                  <p className="text-muted-foreground">{loading ? "..." : "Will show weton 2"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Compatibility Analysis</CardTitle>
          <CardDescription>Detailed breakdown of the weton compatibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Relationship
              </h4>
              <p className="text-sm text-muted-foreground">
                {loading ? "Analyzing..." : "Compatibility in romantic relationships and partnerships."}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Friendship
              </h4>
              <p className="text-sm text-muted-foreground">
                {loading ? "Analyzing..." : "Compatibility in friendships and social interactions."}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Business</h4>
              <p className="text-sm text-muted-foreground">
                {loading ? "Analyzing..." : "Compatibility in business partnerships and collaborations."}
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
            <code className="text-sm">
              GET /api/v1/compatibility/{inputDate1 || "{date1}"}/{inputDate2 || "{date2}"}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
