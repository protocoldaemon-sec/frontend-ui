"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { AboutSection } from "@/components/about-section"
import { PricingSection } from "@/components/pricing-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { LoadingScreen } from "@/components/loading-screen"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div className={`w-full ${isLoading ? "loading" : ""}`}>
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
          <AboutSection />
          <PricingSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  )
}
