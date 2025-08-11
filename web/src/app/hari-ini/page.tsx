import { Metadata } from "next"
import Resources from "./resources"

export const metadata: Metadata = {
  title: "Jakal - Hari ini",
  description: "Hari ini",
}

export default function page() {
  return (
    <div>
      <Resources />
    </div>
  )
}