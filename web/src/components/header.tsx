"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Site } from "@/lib/site"
import { Separator } from "./ui/separator"
import { IconBrandGithub, IconBrandVercel } from "@intentui/icons"

export default function Header() {
    const links = [
        { href: "/", label: "Beranda" },
        { href: "/hari-ini", label: "Hari ini" },
        { href: "/weton", label: "Weton" },
        { href: "/neptu", label: "Neptu" },
        { href: "/perhitungan", label: "Perhitungan" },
        { href: "/hari-baik", label: "Hari Baik" },
        { href: "/kesehatan", label: "API Status" },
    ]

    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 supports-[backdrop-filter]:bg-background/80">
            <nav className="container h-14 px-4 flex items-center">
                <div className="hidden md:grid md:grid-cols-[auto_1fr_auto] md:w-full md:items-center md:gap-6">
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-lg font-semibold tracking-tight hover:opacity-90 transition-opacity"
                        >
                            <IconBrandVercel className="h-5 w-5" />
                            <span className="leading-none">{Site.title}</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-1 justify-center">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-accent"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex justify-end items-center gap-2">
                        <Link
                            href={Site.social.github}
                            target="_blank"
                            aria-label="GitHub"
                            className="p-2 rounded-md hover:bg-accent transition-colors"
                        >
                            <IconBrandGithub className="h-5 w-5" />
                        </Link>
                    </div>
                </div>

                <div className="flex justify-between items-center w-full md:hidden">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold tracking-tight hover:opacity-90 transition-opacity"
                    >
                        <IconBrandVercel className="h-5 w-5" />
                        <span className="leading-none">{Site.title}</span>
                    </Link>

                    {/* Burger Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="p-2.5 rounded-lg hover:bg-accent transition-colors" aria-label="Buka menu navigasi">
                                <Menu className="h-5 w-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72">
                            <div className="px-4 py-4 border-b bg-muted/30">
                                <div className="flex items-center gap-2">
                                    <IconBrandVercel className="h-5 w-5" />
                                    <span className="text-lg font-semibold">{Site.title}</span>
                                </div>
                            </div>

                            <div className="px-3 py-4">
                                <div className="flex flex-col gap-1">
                                    {links.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="w-full justify-start text-sm px-3 py-2 rounded-md hover:bg-accent transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={Site.social.github}
                                        target="_blank"
                                        aria-label="GitHub"
                                        className="p-2 rounded-md hover:bg-accent transition-colors"
                                    >
                                        <IconBrandGithub className="h-5 w-5" />
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    )
}
