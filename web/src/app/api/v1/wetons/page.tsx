"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, List } from "lucide-react"

export default function WetonsPage() {
  const [wetonsData, setWetonsData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchWetonsData = async () => {
    setLoading(true)
    try {
      // This would call your Go API: GET /api/v1/wetons
      const response = await fetch("/api/v1/wetons")
      const data = await response.json()
      setWetonsData(data)
    } catch (error) {
      console.error("Error fetching wetons data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWetonsData()
  }, [])

  const wetonList = [
    { name: "Minggu Legi", neptu: 12, characteristics: "Creative and artistic" },
    { name: "Minggu Pahing", neptu: 15, characteristics: "Leadership qualities" },
    { name: "Minggu Pon", neptu: 12, characteristics: "Gentle and caring" },
    { name: "Minggu Wage", neptu: 9, characteristics: "Hardworking and reliable" },
    { name: "Minggu Kliwon", neptu: 13, characteristics: "Spiritual and wise" },
    { name: "Senin Legi", neptu: 9, characteristics: "Analytical and precise" },
    { name: "Senin Pahing", neptu: 12, characteristics: "Ambitious and driven" },
    { name: "Senin Pon", neptu: 9, characteristics: "Peaceful and harmonious" },
    { name: "Senin Wage", neptu: 6, characteristics: "Practical and grounded" },
    { name: "Senin Kliwon", neptu: 10, characteristics: "Intuitive and empathetic" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Wetons</h1>
        <p className="text-muted-foreground">Daftar semua kemungkinan weton (35 kombinasi)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Weton List
            </CardTitle>
            <CardDescription>Complete list of all 35 possible weton combinations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wetonList.map((weton, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{weton.name}</h4>
                    <Badge variant="secondary">Neptu: {weton.neptu}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{weton.characteristics}</p>
                </div>
              ))}
              {loading && <div className="col-span-full text-center text-muted-foreground">Loading more wetons...</div>}
            </div>
            <Button onClick={fetchWetonsData} disabled={loading} className="w-full mt-6">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh Weton Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weton Statistics</CardTitle>
            <CardDescription>Overview of weton distribution and characteristics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Wetons:</span>
                <Badge>35</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Hari (Days):</span>
                <Badge variant="outline">7</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Pasaran:</span>
                <Badge variant="outline">5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Neptu Range:</span>
                <Badge variant="outline">6-15</Badge>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Most Common Neptu:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Neptu 9:</span>
                    <span className="text-muted-foreground">4 wetons</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Neptu 12:</span>
                    <span className="text-muted-foreground">4 wetons</span>
                  </div>
                </div>
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
            <code className="text-sm">GET /api/v1/wetons</code>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Returns a complete list of all 35 possible weton combinations with their neptu values and characteristics.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
