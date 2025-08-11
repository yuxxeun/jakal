"use client"

import { Site } from "@/lib/site"
import { IconBrandVercel, IconPackageFill } from "@intentui/icons"
import Link from "next/link"

const navigation = {
  supports: [
    { name: "Github Star", href: "https://github.com/yuxxeun/w3show" },
    { name: "Nih Buat Jajan", href: "https://www.nihbuatjajan.com/yuxxeun" },
  ],
  resources: [
    { name: "Adobe React Aria", href: "https://react-spectrum.adobe.com/index.html" },
    { name: "Intent UI", href: "https://intentui.com" },
    { name: "Icons", href: "https://intentui.com/icons" },
  ],
  labs: [
    { name: "Dokumentasi", href: "/dokumentasi" },
    { name: "Kesehatan API", href: "/kesehatan" },
    { name: "Github", href: "https://github.com/yuxxeun/w3show" },
  ],
  legal: [{ name: "MIT License", href: "https://github.com/yuxxeun/w3show/blob/main/LICENSE" }],
}

export function Footer() {
  return (
    <footer aria-labelledby="footer-heading" className="border-t text-bg-fg">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="relative z-20 mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:pt-16 lg:pb-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <IconBrandVercel className="size-7" />
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="font-semibold text-fg text-sm leading-6">Resources</h3>
                <ul className="mt-4 space-y-2">
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-muted-fg text-sm leading-6 data-hovered:text-fg"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="font-semibold text-fg text-sm leading-6">Support</h3>
                <ul className="mt-4 space-y-2">
                  {navigation.supports.map((item) => (
                    <li key={item.name}>
                      <Link
                        target="_blank"
                        href={item.href}
                        className="text-muted-fg text-sm leading-6 data-hovered:text-fg"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="font-semibold text-fg text-sm leading-6">Extra</h3>
                <ul className="mt-4 space-y-2">
                  {navigation.labs.map((item) => (
                    <li key={item.name}>
                      <Link
                        target="_blank"
                        href={item.href}
                        className="text-muted-fg text-sm leading-6 data-hovered:text-fg"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="font-semibold text-fg text-sm leading-6">Legal</h3>
                <ul className="mt-4 space-y-2">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        target="_blank"
                        href={item.href}
                        className="text-muted-fg text-sm leading-6 data-hovered:text-fg"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}