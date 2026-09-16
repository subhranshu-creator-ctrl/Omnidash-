import type { Metadata } from "next"
import { Shell } from "@/components/shell"
import "./globals.css"
export const metadata: Metadata = { title: { default: "OmniDash — One dashboard. Everything under control.", template: "%s — OmniDash" }, description: "A calm command center for your work and life." }
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en" suppressHydrationWarning><body><Shell>{children}</Shell></body></html> }
