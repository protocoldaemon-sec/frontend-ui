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
  description: "Unified Security Platform for blockchain investigation and smart contract security analysis",
  generator: "Next.js",
  icons: {
    icon: "https://cdn.builder.io/api/v1/image/assets%2F4fa3bacb9dc1480e93c89822f42d36f0%2Fedcfcdd8ae5c46c08a24dc6ee4c5efd6", 
    apple: "https://cdn.builder.io/api/v1/image/assets%2F4fa3bacb9dc1480e93c89822f42d36f0%2Fedcfcdd8ae5c46c08a24dc6ee4c5efd6",
  },
  openGraph: {
    title: "Daemon - Unified Security Platform",
    description: "Unified Security Platform for blockchain investigation and smart contract security analysis",
    url: "https://daemonprotocol.com",
    siteName: "Daemon",
    images: [
      {
        url: "https://cdn.builder.io/api/v1/image/assets%2F4fa3bacb9dc1480e93c89822f42d36f0%2Fedcfcdd8ae5c46c08a24dc6ee4c5efd6",
        width: 512,
        height: 512,
        alt: "Daemon Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

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
