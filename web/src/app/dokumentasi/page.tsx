import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Book, ExternalLink, Code, Globe } from "lucide-react"
import Image from "next/image"
import { Site } from "@/lib/site"

export default function DocsPage() {
  const endpoints = [
    {
      category: "Basic Operations",
      endpoints: [
        { method: "GET", path: "/api/v1/today", description: "Get today's Javanese date" },
        { method: "GET", path: "/api/v1/date/{date}", description: "Convert specific date" },
        { method: "GET", path: "/api/v1/range/{start}/{end}", description: "Get date range data" },
        { method: "GET", path: "/api/v1/year/{year}", description: "Get year data" },
        { method: "GET", path: "/api/v1/month/{year}/{month}", description: "Get month data" },
      ],
    },
    {
      category: "Weton & Neptu",
      endpoints: [
        { method: "GET", path: "/api/v1/weton/{date}", description: "Get weton for date" },
        { method: "GET", path: "/api/v1/neptu/{date}", description: "Calculate neptu" },
        { method: "GET", path: "/api/v1/compatibility/{date1}/{date2}", description: "Check compatibility" },
        { method: "GET", path: "/api/v1/good-days/{birth_date}/{target_year}", description: "Find good days" },
        { method: "GET", path: "/api/v1/wetons", description: "List all wetons" },
      ],
    },
    {
      category: "Filtering",
      endpoints: [
        { method: "GET", path: "/api/v1/weton/{weton}/{year}", description: "Filter by weton and year" },
        { method: "GET", path: "/api/v1/weton/{weton}/{year}/{month}", description: "Filter by weton and month" },
      ],
    },
    {
      category: "Statistics & Utility",
      endpoints: [
        { method: "GET", path: "/api/v1/statistics/{start}/{end}", description: "Get statistics" },
        { method: "GET", path: "/health", description: "API health status" },
        { method: "GET", path: "/", description: "API documentation" },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Dokumentasi API
        </h1>
        <p className="text-xl text-muted-foreground mb-6">Complete documentation for the Javanese Calendar API</p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/api/v1/today">Coba API</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/health">Cek kesehatan API</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Base URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-3 rounded-lg">
              <code className="text-sm font-mono">
                {Site.social.web}
              </code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Version
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge>v1.0.0</Badge>
              <span className="text-sm text-muted-foreground">Latest</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Format
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">JSON</Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>API Overview</CardTitle>
          <CardDescription>Understanding the Javanese Calendar API structure and capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Image
              src="/images/api-docs.png"
              alt="API Documentation Overview"
              width={800}
              height={400}
              className="rounded-lg border"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">What is Javanese Calendar?</h4>
              <p className="text-sm text-muted-foreground">
                The Javanese calendar is a traditional calendar system used in Java, Indonesia. It combines elements
                from Hindu-Buddhist, Islamic, and indigenous Javanese traditions.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Weton & Neptu</h4>
              <p className="text-sm text-muted-foreground">
                Weton is a combination of day names and market day names. Neptu is the numerical value associated with
                each weton, used for compatibility calculations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {endpoints.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle>{category.category}</CardTitle>
              <CardDescription>
                {category.category === "Basic Operations" && "Core date conversion and calendar operations"}
                {category.category === "Weton & Neptu" && "Weton calculations and compatibility checks"}
                {category.category === "Filtering" && "Advanced filtering capabilities"}
                {category.category === "Statistics & Utility" && "Statistical analysis and utility endpoints"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.endpoints.map((endpoint, endpointIndex) => (
                  <div key={endpointIndex} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Badge variant={endpoint.method === "GET" ? "default" : "secondary"}>{endpoint.method}</Badge>
                        <code className="text-sm font-mono">{endpoint.path}</code>
                      </div>
                      <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={endpoint.path.replace(/{[^}]+}/g, "new")}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Examples</CardTitle>
          <CardDescription>Common usage examples and sample responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Get Today's Date</h4>
              <div className="bg-muted p-4 rounded-lg">
                <code className="text-sm font-mono">curl -X GET "https://your-api-domain.com/api/v1/today"</code>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Convert Specific Date</h4>
              <div className="bg-muted p-4 rounded-lg">
                <code className="text-sm font-mono">curl -X GET "https://your-api-domain.com/api/v1/date/2025-01-15"</code>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Check Compatibility</h4>
              <div className="bg-muted p-4 rounded-lg">
                <code className="text-sm font-mono">
                  curl -X GET "https://your-api-domain.com/api/v1/compatibility/1990-05-15/1992-08-20"
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
