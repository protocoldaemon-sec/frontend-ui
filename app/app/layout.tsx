import type React from "react"
import type { Metadata } from "next"
import { Poppins, Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { SolanaProvider } from "@/components/wallet"
import "@solana/wallet-adapter-react-ui/styles.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-plus-jakarta",
})

export const metadata: Metadata = {
  title: "Daemon - Unified Security Platform",
  description: "AI-powered platform for blockchain investigation and smart contract security analysis",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${plusJakarta.variable} font-sans antialiased bg-gradient-to-br from-blue-600 to-slate-900 text-white overflow-x-hidden`}
      >
        <SolanaProvider>
        <Suspense fallback={null}>{children}</Suspense>
        </SolanaProvider>        
        <Analytics />
      </body>
    </html>
  )
}
