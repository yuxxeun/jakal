"use client";

import { Site } from "@/lib/constant";
import { IconPackageFill } from "@intentui/icons";
import {
  LetterText,
  Github,
  Twitter,
  Instagram,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const navigation = {
  product: [
    { name: "Showcase", href: "/showcase" },
    { name: "Templates", href: "/templates" },
    { name: "Documentation", href: "/docs" },
    { name: "Changelog", href: "/changelog" },
  ],
  resources: [
    {
      name: "Adobe React Aria",
      href: "https://react-spectrum.adobe.com/index.html",
    },
    { name: "Intent UI", href: "https://intentui.com" },
    { name: "Icons", href: "https://intentui.com/icons" },
    { name: "Next.js", href: "https://nextjs.org" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "GitHub", href: "https://github.com/yuxxeun/w3show" },
    { name: "Community", href: "/community" },
    { name: "Status", href: "/status" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    {
      name: "MIT License",
      href: "https://github.com/yuxxeun/w3show/blob/main/LICENSE",
    },
  ],
};

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          {/* Product */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-6 space-y-4">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="mt-6 space-y-4">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    {item.name}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-6 space-y-4">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-foreground">Support</h3>
            <ul className="mt-6 space-y-4">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    {item.name}
                    {item.href.startsWith("http") && (
                      <ArrowUpRight className="h-3 w-3" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-6 space-y-4">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    {item.name}
                    {item.href.startsWith("http") && (
                      <ArrowUpRight className="h-3 w-3" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-foreground">Social</h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href={Site.links.github}
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  GitHub
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/yuxxeun"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  Twitter
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://instagram.com/yuxxeun"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  Instagram
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.nihbuatjajan.com/yuxxeun"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  Donate
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground">
                  <LetterText className="h-4 w-4 text-background" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  w3show
                </span>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 w3show. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
