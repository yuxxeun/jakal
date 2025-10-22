import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Book, ExternalLink, Code, Globe } from "lucide-react"
import Image from "next/image"
import { Site } from "@/lib/site"

export default function Resources() {
    const endpoints = [
        {
            category: "Operasi Dasar",
            endpoints: [
                { method: "GET", path: "/api/v1/today", description: "Mendapatkan tanggal Jawa hari ini" },
                { method: "GET", path: "/api/v1/date/{date}", description: "Mengonversi tanggal tertentu" },
                { method: "GET", path: "/api/v1/range/{start}/{end}", description: "Mendapatkan data dalam rentang tanggal" },
                { method: "GET", path: "/api/v1/year/{year}", description: "Mendapatkan data setahun penuh" },
                { method: "GET", path: "/api/v1/month/{year}/{month}", description: "Mendapatkan data sebulan penuh" },
            ],
        },
        {
            category: "Weton & Neptu",
            endpoints: [
                { method: "GET", path: "/api/v1/weton/{date}", description: "Menampilkan weton pada tanggal tertentu" },
                { method: "GET", path: "/api/v1/neptu/{date}", description: "Menghitung nilai neptu" },
                { method: "GET", path: "/api/v1/compatibility/{date1}/{date2}", description: "Cek kecocokan berdasarkan weton" },
                { method: "GET", path: "/api/v1/good-days/{birth_date}/{target_year}", description: "Mencari hari baik" },
                { method: "GET", path: "/api/v1/wetons", description: "Menampilkan daftar semua weton" },
            ],
        },
        {
            category: "Penyaringan",
            endpoints: [
                { method: "GET", path: "/api/v1/weton/{weton}/{year}", description: "Filter berdasarkan weton dan tahun" },
                { method: "GET", path: "/api/v1/weton/{weton}/{year}/{month}", description: "Filter berdasarkan weton dan bulan" },
            ],
        },
        {
            category: "Statistik & Utilitas",
            endpoints: [
                { method: "GET", path: "/api/v1/statistics/{start}/{end}", description: "Mendapatkan statistik" },
                { method: "GET", path: "/health", description: "Status kesehatan API" },
                { method: "GET", path: "/", description: "Dokumentasi API" },
            ],
        },
    ]
    return (
        <>
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">
                    Dokumentasi API
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                    Dokumentasi lengkap untuk API Kalender Jawa
                </p>
                <div className="flex gap-4">
                    <Button asChild>
                        <Link href="/api/v1/today">Coba API</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/health">Cek Kesehatan API</Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            URL Dasar
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
                            Versi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Badge>v1.0.0</Badge>
                            <span className="text-sm text-muted-foreground">Terbaru</span>
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
                    <CardTitle>Ringkasan API</CardTitle>
                    <CardDescription>Memahami struktur dan kemampuan API Kalender Jawa</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <Image
                            src="/vercel.svg"
                            alt="Gambaran Dokumentasi API"
                            width={800}
                            height={400}
                            className="p-5 rounded-lg border"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium mb-2">Apa itu Kalender Jawa?</h4>
                            <p className="text-muted-foreground">
                                Kalender Jawa adalah sistem penanggalan tradisional yang digunakan di Pulau Jawa, Indonesia. Kalender ini
                                menggabungkan unsur Hindu-Buddha, Islam, dan tradisi asli Jawa.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Weton & Neptu</h4>
                            <p className="text-sm text-muted-foreground">
                                Weton adalah gabungan nama hari dan nama pasaran. Neptu adalah nilai angka yang terkait dengan setiap weton,
                                digunakan untuk perhitungan kecocokan.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                {endpoints.map((category, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <CardTitle>{category.category}</CardTitle>
                            <CardDescription>
                                {category.category === "Operasi Dasar" && "Operasi inti konversi tanggal dan kalender"}
                                {category.category === "Weton & Neptu" && "Perhitungan weton dan pengecekan kecocokan"}
                                {category.category === "Penyaringan" && "Kemampuan penyaringan tingkat lanjut"}
                                {category.category === "Statistik & Utilitas" && "Analisis statistik dan utilitas API"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {category.endpoints.map((endpoint, j) => (
                                    <div key={j} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <Badge variant={endpoint.method === "GET" ? "default" : "secondary"}>
                                                    {endpoint.method}
                                                </Badge>
                                                <code className="text-sm font-mono">{endpoint.path}</code>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={endpoint.path.replace(/{[^}]+}/g, "contoh")}>
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
                    <CardTitle>Contoh Penggunaan</CardTitle>
                    <CardDescription>Contoh penggunaan umum dan respon yang dihasilkan</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-medium mb-2">Dapatkan Tanggal Hari Ini</h4>
                            <div className="bg-muted p-4 rounded-lg">
                                <code className="text-sm font-mono">curl -X GET &apos;https://domain-api-anda.com/api/v1/today&apos;</code>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Konversi Tanggal Tertentu</h4>
                            <div className="bg-muted p-4 rounded-lg">
                                <code className="text-sm font-mono">curl -X GET &apos;https://domain-api-anda.com/api/v1/date/2025-01-15&apos;</code>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Cek Kecocokan</h4>
                            <div className="bg-muted p-4 rounded-lg">
                                <code className="text-sm font-mono">
                                    curl -X GET &apos;https://domain-api-anda.com/api/v1/compatibility/1990-05-15/1992-08-20&apos;
                                </code>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}   