'use client';

import { useEffect, useState } from 'react';
import { Analytics } from "@vercel/analytics/next"
import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.classList.remove('loading');
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    // Load Lucide icons dynamically
    import('lucide-react').then((mod) => {
      // This will make Lucide icons available globally
      if (typeof window !== 'undefined') {
        window.Lucide = mod;
      }
    });
  }, []);

  return (
    <>
      <Script 
        src="https://cdn.tailwindcss.com" 
        strategy="afterInteractive"
      />
      <Script 
        src="https://d3js.org/d3.v7.min.js" 
        strategy="afterInteractive"
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js" 
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          // Initialize particles.js after script loads
          if (window.particlesJS) {
            window.particlesJS('particles-js', {
              particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                // Add your particles.js configuration here
              },
            });
          }
        }}
      />
      {children}
      <Analytics />
    </>
  );
}
