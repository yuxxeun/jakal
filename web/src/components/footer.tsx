"use client"

import { IconBrandVercel } from "@intentui/icons"
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
      <div className="relative z-20 mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-col gap-4 items-center justify-between md:flex-row">
          <div className="flex items-center gap-2 text-sm">
            <IconBrandVercel className="size-5" />
            <span className="text-muted-fg">Kalender Jawa</span>
          </div>
          <nav aria-label="Footer" className="flex items-center gap-4 text-sm text-muted-fg">
            <Link href="https://github.com/yuxxeun/w3show" target="_blank" className="hover:text-fg">
              Github
            </Link>
            <Link href="https://intentui.com" target="_blank" className="hover:text-fg">
              Intent UI
            </Link>
            <Link href="https://github.com/yuxxeun/w3show/blob/main/LICENSE" target="_blank" className="hover:text-fg">
              MIT License
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
