import { Metadata } from "next";
import Resources from "./resources";

export const metadata: Metadata = {
    title: "Jakal - Weton",
    description: "Weton",
}

export default function page() {
    return (
        <div>
            <Resources />
        </div>
    )
}