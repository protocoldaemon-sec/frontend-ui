"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Menu, ChevronDown } from "lucide-react"
import { WalletConnectButton } from "./wallet-connect-button"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProductsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const dropdownRef = useRef(null);

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
              src="https://cdn.builder.io/api/v1/image/assets%2F4fa3bacb9dc1480e93c89822f42d36f0%2F964b489dc4f14245af788e19c343d061"
              alt="Daemon Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-bold text-white tracking-wider">Daemon</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 mr-8">
            <div 
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => {
                if (dropdownTimeoutRef.current) {
                  clearTimeout(dropdownTimeoutRef.current);
                  dropdownTimeoutRef.current = null;
                }
                setProductsDropdownOpen(true);
              }}
              onMouseLeave={() => {
                dropdownTimeoutRef.current = setTimeout(() => {
                  setProductsDropdownOpen(false);
                }, 3000);
              }}
            >
              <button 
                className="nav-link text-lg text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
              >
                Products
                <ChevronDown className="w-4 h-4" />
              </button>
              {productsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-md rounded-lg shadow-lg border border-slate-700">
                  <div className="py-2">
                    <a href="#bounty-market" className="block px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-800/50 transition-colors">
                      Bounty Market
                    </a>
                    <a href="#data-market" className="block px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-800/50 transition-colors">
                      Data Market
                    </a>
                  </div>
                </div>
              )}
            </div>
            <a href="#" className="nav-link text-lg text-gray-400 hover:text-white transition-colors">
              API
            </a>
            <a href="#about" className="nav-link text-lg text-gray-400 hover:text-white transition-colors">
              About
            </a>
            {/* <a href="#pricing" className="nav-link text-lg text-gray-400 hover:text-white transition-colors">
              Pricing
            </a> */}
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
              <div>
                <button 
                  className="py-2 text-white hover:text-cyan-400 transition-colors flex items-center gap-1 w-full text-left"
                  onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                >
                  Products
                  <ChevronDown className={`w-4 h-4 transition-transform ${productsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {productsDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    <a href="#bounty-market" className="block py-1 text-gray-300 hover:text-cyan-400 transition-colors">
                      Bounty Market
                    </a>
                    <a href="#data-market" className="block py-1 text-gray-300 hover:text-cyan-400 transition-colors">
                      Data Market
                    </a>
                  </div>
                )}
              </div>
              <a href="#" className="py-2 text-white hover:text-cyan-400 transition-colors">
                API
              </a>
              <a href="#about" className="py-2 text-white hover:text-cyan-400 transition-colors">
                About
              </a>
              {/* <a href="#pricing" className="py-2 text-white hover:text-cyan-400 transition-colors">
                Pricing
              </a> */}
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
