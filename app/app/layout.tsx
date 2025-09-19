import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { SolanaProvider } from "@/components/wallet"
import "@solana/wallet-adapter-react-ui/styles.css";

// Configure Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: "Daemon - Blockchain Security & Smart Contract Auditing Platform",
  description:
    "Daemon is a unified blockchain security platform providing advanced smart contract auditing, threat detection, and on-chain investigation to protect Web3 ecosystems.",
  generator: "Next.js",
  keywords: [
    "blockchain security",
    "smart contract auditing",
    "DeFi security",
    "Web3 threat detection",
    "crypto investigation",
    "on-chain security",
    "vulnerability analysis",
    "Solana security",
    "Ethereum auditing",
    "blockchain investigation",
  ],
  icons: {
    icon: "https://cdn.builder.io/api/v1/image/assets%2F4fa3bacb9dc1480e93c89822f42d36f0%2Fedcfcdd8ae5c46c08a24dc6ee4c5efd6",
    apple: "https://cdn.builder.io/api/v1/image/assets%2F4fa3bacb9dc1480e93c89822f42d36f0%2Fedcfcdd8ae5c46c08a24dc6ee4c5efd6",
  },
  openGraph: {
    title: "Daemon - Blockchain Security & Smart Contract Auditing Platform",
    description:
      "Protect your blockchain projects with Daemon. A unified Web3 security platform offering smart contract audits, vulnerability analysis, and on-chain threat detection.",
    url: "https://daemonprotocol.com",
    siteName: "Daemon",
    images: [
      {
        url: "https://cdn.builder.io/api/v1/image/assets%2F4fa3bacb9dc1480e93c89822f42d36f0%2Fedcfcdd8ae5c46c08a24dc6ee4c5efd6",
        width: 512,
        height: 512,
        alt: "Daemon - Blockchain Security & Auditing",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daemon - Unified Blockchain Security Platform",
    description:
      "Comprehensive Web3 security: smart contract auditing, blockchain investigation, and real-time threat detection.",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F4fa3bacb9dc1480e93c89822f42d36f0%2Fedcfcdd8ae5c46c08a24dc6ee4c5efd6",
    ],
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
        className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-blue-600 to-slate-900 text-white overflow-x-hidden`}
      >
        <SolanaProvider>
        <Suspense fallback={null}>{children}</Suspense>
        </SolanaProvider>        
        <Analytics />
      </body>
    </html>
  )
}
