import type { Metadata } from "next"
import { Poppins, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Load fonts
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: 'swap'
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: 'swap'
})

// Dynamic import for client components
const ClientLayout = dynamic(
  () => import('./client-layout'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }
)

export const metadata: Metadata = {
  title: "SentrySol - AI Powered Investigator Tools",
  description: "AI-powered platform for blockchain investigation and smart contract security analysis",
  generator: "Next.js",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000B19' },
    { media: '(prefers-color-scheme: light)', color: '#000B19' },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${poppins.variable} ${plusJakarta.variable} font-sans bg-gradient-to-br from-[#0053B4] to-[#000B19] text-white overflow-x-hidden min-h-screen`}>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-pulse">Loading...</div>
          </div>
        }>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Suspense>
      </body>
    </html>
  )
}
