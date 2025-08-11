'use client'

import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Site } from "@/lib/site"
import { Separator } from "./ui/separator"
import {
    IconBrandGithub,
    IconBrandInstagram,
    IconBrandRssFeed,
    IconBrandVercel
} from "@intentui/icons"

export default function Header() {
    const links = [
        { href: "/", label: "Beranda" },
        { href: "/weton", label: "Weton" },
        { href: "/neptu", label: "Neptu" },
        { href: "/perhitungan", label: "Perhitungan" },
        { href: "/hari-baik", label: "Hari Baik" },
        { href: "/kesehatan", label: "API Status" },
    ]

    return (
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container h-16 px-6 flex items-center">

                {/* DESKTOP (>= md) */}
                <div className="hidden md:grid md:grid-cols-3 md:w-full md:items-center">
                    {/* Kolom kiri - Logo */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
                        >
                            <IconBrandVercel className="h-5 w-5 text-primary" />
                            <span className="leading-none">{Site.title}</span>
                        </Link>
                    </div>

                    {/* Kolom tengah - Menu */}
                    <div className="flex items-center gap-2 justify-center">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    "px-3 text-sm font-medium transition-colors hover:text-primary"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Kolom kanan - Ikon sosial */}
                    <div className="flex justify-end items-center gap-4">
                        <Link
                            href="https://github.com"
                            target="_blank"
                            aria-label="GitHub"
                            className="hover:text-primary transition-colors"
                        >
                            <IconBrandGithub className="h-5 w-5" />
                        </Link>
                        <Link
                            href="https://instagram.com"
                            target="_blank"
                            aria-label="Instagram"
                            className="hover:text-primary transition-colors"
                        >
                            <IconBrandInstagram className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/rss"
                            target="_blank"
                            aria-label="RSS Feed"
                            className="hover:text-primary transition-colors"
                        >
                            <IconBrandRssFeed className="h-5 w-5" />
                        </Link>
                    </div>
                </div>

                {/* MOBILE (< md) */}
                <div className="flex justify-between items-center w-full md:hidden">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold tracking-tight"
                    >
                        <IconBrandVercel className="h-5 w-5 text-primary" />
                        <span className="leading-none">{Site.title}</span>
                    </Link>

                    {/* Burger Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <button
                                className="p-2 rounded-md hover:bg-accent"
                                aria-label="Buka menu navigasi"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-6">
                            <div className="mb-6 flex items-center gap-2">
                                <IconBrandVercel className="h-5 w-5 text-primary" />
                                <span className="text-lg font-semibold">{Site.title}</span>
                            </div>

                            <div className="flex flex-col gap-2">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            buttonVariants({ variant: "ghost" }),
                                            "w-full justify-start text-base"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            <div className="flex items-center gap-4">
                                <Link
                                    href="https://github.com"
                                    target="_blank"
                                    aria-label="GitHub"
                                    className="hover:text-primary transition-colors"
                                >
                                    <IconBrandGithub className="h-5 w-5" />
                                </Link>
                                <Link
                                    href="https://instagram.com"
                                    target="_blank"
                                    aria-label="Instagram"
                                    className="hover:text-primary transition-colors"
                                >
                                    <IconBrandInstagram className="h-5 w-5" />
                                </Link>
                                <Link
                                    href="/rss"
                                    target="_blank"
                                    aria-label="RSS Feed"
                                    className="hover:text-primary transition-colors"
                                >
                                    <IconBrandRssFeed className="h-5 w-5" />
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    )
}
