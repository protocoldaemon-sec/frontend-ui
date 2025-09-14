"use client"

import { useEffect, useState } from "react"
import { ArrowRight, ChevronUp, ChevronDown, Menu, X } from "lucide-react"
import { animateScroll as scroll, scroller } from 'react-scroll'
import { useScrollPosition } from "@/hooks/use-scroll"

// Import components
import { Header } from "../components/header"
import { HeroSection } from "../components/hero-section"
import { FeaturesSection } from "../components/features-section"
import { AboutSection } from "../components/about-section"
import { PricingSection } from "../components/pricing-section"
import { CTASection } from "../components/cta-section"
import { Footer } from "../components/footer"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const scrollPosition = useScrollPosition()
  
  // Update navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      // Update active section based on scroll position
      const sections = ['home', 'features', 'about', 'pricing', 'contact']
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    scroller.scrollTo(sectionId, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -80 // Adjust for fixed header
    })
    setIsMenuOpen(false)
  }
  
  // Scroll to top
  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 800,
      smooth: 'easeInOutQuart'
    })
  }
  
  // Show scroll to top button after scrolling down
  const showScrollToTop = scrollPosition > 300
  
  return (
    <div className="relative min-h-screen">
      {/* Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-dark/90 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <a 
              href="#" 
              className="text-2xl font-bold tracking-tight text-white"
              onClick={(e) => {
                e.preventDefault()
                scrollToTop()
              }}
            >
              <span className="text-accent">Sentr</span>Sol
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'features', 'about', 'pricing', 'contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className={`text-sm font-medium transition-colors hover:text-accent capitalize ${
                    activeSection === item ? 'text-accent' : 'text-white/80'
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(item)
                  }}
                >
                  {item}
                </a>
              ))}
              <a
                href="#get-started"
                className="ml-6 px-6 py-2 rounded-full bg-gradient-to-r from-secondary to-accent text-dark font-medium text-sm hover:shadow-lg hover:shadow-secondary/30 transition-all duration-300 flex items-center"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('get-started')
                }}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </nav>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-3">
                {['home', 'features', 'about', 'pricing', 'contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item}`}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      activeSection === item 
                        ? 'bg-accent/10 text-accent' 
                        : 'text-white/80 hover:bg-white/5'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(item)
                      setIsMenuOpen(false)
                    }}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </a>
                ))}
                <a
                  href="#get-started"
                  className="block w-full text-center px-4 py-2 rounded-full bg-gradient-to-r from-secondary to-accent text-dark font-medium text-sm hover:shadow-lg hover:shadow-secondary/30 transition-all duration-300 mt-2"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('get-started')
                    setIsMenuOpen(false)
                  }}
                >
                  Get Started
                  <ArrowRight className="inline-block ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="pt-24">
        <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
          <HeroSection />
        </section>
        
        <section id="features" className="py-20 relative">
          <FeaturesSection />
        </section>
        
        <section id="about" className="py-20 bg-dark/50 relative">
          <AboutSection />
        </section>
        
        <section id="pricing" className="py-20 relative">
          <PricingSection />
        </section>
        
        <section id="contact" className="py-20 bg-dark/50 relative">
          <CTASection />
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-accent/90 text-dark shadow-lg hover:bg-accent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-dark"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
      
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[1200px] h-[1200px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] translate-x-1/2 translate-y-1/2 bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  )
}
