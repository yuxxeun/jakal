
import { Metadata } from "next"
import Resources from "./resources"

export const metadata: Metadata = {
  title: "Jakal - Dokumentasi",
  description: "Dokumentasi lengkap untuk API Kalender Jawa",
}

export default function page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Resources />
    </div>
  )
}
