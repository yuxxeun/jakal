"use client";

import { ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Site } from "@/lib/constant";
import { IconSparklesThree } from "@intentui/icons";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-background">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />

            {/* Content */}
            <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    {/* Badge */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-border hover:ring-border/80 transition-all">
                            <span className="inline-flex items-center gap-1">
                                <IconSparklesThree className="h-3 w-3" />
                                {Site.title} sudah beta akses
                            </span>
                        </div>
                    </div>

                    {/* Main heading */}
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                        {Site.title}
                        <br />
                        <span className="text-primary">Javanese Calendar</span>
                    </h1>

                    {/* Subheading */}
                    <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-xl mx-auto">
                        {Site.descritpion}
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-10 flex items-center justify-center gap-4">
                        <Button size="lg" className="h-12 px-8">
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="lg" className="h-12 px-8">
                            <Github className="mr-2 h-4 w-4" />
                            View on GitHub
                        </Button>
                    </div>

                    {/* Stats or features */}
                    <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span>99.9% Weton</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <span>500+ projects</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-purple-500" />
                            <span>Open source</span>
                        </div>
                    </div>

                    {/* Demo link */}
                    {/* <div className="mt-8">
                        <Link
                            href="/demo"
                            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Play className="h-3 w-3" />
                            Watch demo
                        </Link>
                    </div> */}
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        </section>
    );
}
