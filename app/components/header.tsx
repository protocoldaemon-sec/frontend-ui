"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { WalletConnectButton } from "./wallet-connect-button"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY

      if (scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      if (scrollY > lastScrollY && scrollY > 200) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }

      setLastScrollY(scrollY <= 0 ? 0 : scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        isScrolled ? "bg-slate-900/85 backdrop-blur-md shadow-lg" : ""
      } ${isHidden ? "-top-24" : "top-0"}`}
    >
      <div className="container mx-auto px-6">
        <nav className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/0b774bfeabf0a41dd54fc314dba2e3da7216f89b?width=130"
              alt="Daemon Logo"
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold text-white tracking-wider">Daemon</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <a href="#features" className="nav-link text-lg text-gray-400 hover:text-white transition-colors">
              Products
            </a>
            <a href="#about" className="nav-link text-lg text-gray-400 hover:text-white transition-colors">
              About
            </a>
            <a href="#pricing" className="nav-link text-lg text-gray-400 hover:text-white transition-colors">
              Pricing
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <WalletConnectButton />
          </div>

          <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-8 h-8 text-white" />
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900/95 backdrop-blur-md p-4 rounded-lg">
            <div className="flex flex-col gap-2 text-lg">
              <a href="#features" className="py-2 text-white hover:text-cyan-400 transition-colors">
                Products
              </a>
              <a href="#about" className="py-2 text-white hover:text-cyan-400 transition-colors">
                About
              </a>
              <a href="#pricing" className="py-2 text-white hover:text-cyan-400 transition-colors">
                Pricing
              </a>
              <div className="mt-2 w-full">
                <WalletConnectButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
