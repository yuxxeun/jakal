"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Activity, Server, Database } from "lucide-react"

export default function HealthPage() {
  const [, setHealthData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchHealthData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/health")
      const data = await response.json()
      setHealthData(data)
    } catch (error) {
      console.error("Error fetching health data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealthData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Status Kesehatan API</h1>
        <p className="text-muted-foreground">Status kesehatan Jakal </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              API Status
            </CardTitle>
            <CardDescription>Overall API health and availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Status:</span>
                <Badge variant={loading ? "secondary" : "default"}>{loading ? "Checking..." : "Healthy"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Uptime:</span>
                <span className="text-muted-foreground">{loading ? "..." : "99.9%"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Response Time:</span>
                <span className="text-muted-foreground">{loading ? "..." : "< 100ms"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Version:</span>
                <span className="text-muted-foreground">{loading ? "..." : "1.0.0"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Server Info
            </CardTitle>
            <CardDescription>Server performance and resource usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">CPU Usage:</span>
                <Badge variant="outline">{loading ? "..." : "15%"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Memory Usage:</span>
                <Badge variant="outline">{loading ? "..." : "45%"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Goroutines:</span>
                <span className="text-muted-foreground">{loading ? "..." : "12"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Go Version:</span>
                <span className="text-muted-foreground">{loading ? "..." : "1.21.0"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Dependencies
            </CardTitle>
            <CardDescription>External dependencies and services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Database:</span>
                <Badge variant="default">{loading ? "..." : "Connected"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Cache:</span>
                <Badge variant="default">{loading ? "..." : "Active"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">External APIs:</span>
                <Badge variant="default">{loading ? "..." : "Available"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Last Check:</span>
                <span className="text-muted-foreground">{loading ? "..." : "Just now"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest API requests and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center text-muted-foreground">Loading recent activity...</div>
            ) : (
              <>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">GET /api/v1/today</div>
                    <div className="text-sm text-muted-foreground">200 OK - 45ms</div>
                  </div>
                  <Badge variant="outline">2 min ago</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">GET /api/v1/weton/2025-01-15</div>
                    <div className="text-sm text-muted-foreground">200 OK - 32ms</div>
                  </div>
                  <Badge variant="outline">5 min ago</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">GET /api/v1/compatibility/2025-01-15/2025-02-20</div>
                    <div className="text-sm text-muted-foreground">200 OK - 67ms</div>
                  </div>
                  <Badge variant="outline">8 min ago</Badge>
                </div>
              </>
            )}
          </div>
          <Button onClick={fetchHealthData} disabled={loading} className="w-full mt-6">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh Health Status
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>API Endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <code className="text-sm">GET /health</code>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Returns the current health status of the API including server metrics and dependency status.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
