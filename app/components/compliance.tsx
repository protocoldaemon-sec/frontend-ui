"use client"

import React, { useEffect, useRef } from 'react'

export function ComplianceSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    // Clip Path Animation Constants
    const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
    const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)"
    const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)"
    const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)"
    const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)"

    const ENTRANCE_KEYFRAMES = {
      left: [BOTTOM_RIGHT_CLIP, NO_CLIP],
      bottom: [TOP_RIGHT_CLIP, NO_CLIP],
      top: [BOTTOM_RIGHT_CLIP, NO_CLIP],
      right: [TOP_LEFT_CLIP, NO_CLIP],
    }

    const EXIT_KEYFRAMES = {
      left: [NO_CLIP, TOP_RIGHT_CLIP],
      bottom: [NO_CLIP, BOTTOM_RIGHT_CLIP],
      top: [NO_CLIP, BOTTOM_LEFT_CLIP],
      right: [NO_CLIP, BOTTOM_LEFT_CLIP],
    }

    const getNearestSide = (e) => {
      const box = e.target.getBoundingClientRect()
      const proximityToLeft = { proximity: Math.abs(box.left - e.clientX), side: "left" }
      const proximityToRight = { proximity: Math.abs(box.right - e.clientX), side: "right" }
      const proximityToTop = { proximity: Math.abs(box.top - e.clientY), side: "top" }
      const proximityToBottom = { proximity: Math.abs(box.bottom - e.clientY), side: "bottom" }
      const sortedProximity = [proximityToLeft, proximityToRight, proximityToTop, proximityToBottom].sort(
        (a, b) => a.proximity - b.proximity
      )
      return sortedProximity[0].side
    }

    // Setup clip path links
    const clipPathLinks = sectionRef.current?.querySelectorAll(".clip-path-link")
    
    clipPathLinks?.forEach(link => {
      const reveal = link.querySelector(".clip-path-link-reveal")
      if (reveal) {
        reveal.style.clipPath = BOTTOM_RIGHT_CLIP

        const handleMouseEnter = (e) => {
          const side = getNearestSide(e)
          const entrance = ENTRANCE_KEYFRAMES[side]
          reveal.animate(
            { clipPath: entrance }, 
            { duration: 400, easing: 'cubic-bezier(0.45, 0, 0.55, 1)', fill: 'forwards' }
          )
        }

        const handleMouseLeave = (e) => {
          const side = getNearestSide(e)
          const exit = EXIT_KEYFRAMES[side]
          reveal.animate(
            { clipPath: exit }, 
            { duration: 400, easing: 'cubic-bezier(0.45, 0, 0.55, 1)', fill: 'forwards' }
          )
        }

        link.addEventListener("mouseenter", handleMouseEnter)
        link.addEventListener("mouseleave", handleMouseLeave)

        // Cleanup function
        return () => {
          link.removeEventListener("mouseenter", handleMouseEnter)
          link.removeEventListener("mouseleave", handleMouseLeave)
        }
      }
    })

    // Intersection Observer for bento block animation
    const bentoBlock = sectionRef.current?.querySelector('.bento-block')
    if (bentoBlock) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.2 }
      )
      observer.observe(bentoBlock)

      return () => observer.disconnect()
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="compliance" 
      className="py-20 px-4 md:px-8 bg-[#001021]"
    >
      <style jsx>{`
        .bento-block {
          background: linear-gradient(145deg, rgba(22, 49, 82, 0.5), rgba(10, 25, 47, 0.7));
          border: 1px solid rgba(0, 200, 255, 0.15);
          backdrop-filter: blur(8px);
          border-radius: 1rem;
          padding: 1.5rem;
          opacity: 0;
          transform: scale(0.95) translateY(30px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .bento-block.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        
        .bento-block:hover {
          transform: scale(1.02);
          transition-duration: 0.3s;
        }

        .clip-path-link-container {
          border: 1px solid rgba(0, 200, 255, 0.15);
          border-radius: 1rem;
          overflow: hidden;
        }

        .clip-path-link {
          position: relative;
          display: grid;
          place-content: center;
          padding: 1.5rem;
          text-align: center;
          min-height: 120px;
          background: linear-gradient(145deg, rgba(22, 49, 82, 0.2), rgba(10, 25, 47, 0.4));
          color: #E2E8F0;
          text-decoration: none;
        }

        .clip-path-link-text {
          font-weight: 600;
        }

        .clip-path-link-reveal {
          position: absolute;
          inset: 0;
          display: grid;
          place-content: center;
          background-color: #00C8FF;
          color: #000B19;
          transition: clip-path 0.4s cubic-bezier(0.45, 0, 0.55, 1);
        }

        .plus-jakarta {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
      `}</style>

      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="plus-jakarta text-4xl md:text-5xl font-bold">
            Ironclad Security, Seamless Compliance
          </h2>
          <p className="plus-jakarta text-lg text-white/80 mt-4 max-w-3xl mx-auto">
            Navigate the complexities of global regulations with an intelligence-driven platform 
            designed to protect your assets and your reputation.
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="bento-block w-full max-w-3xl">
            <div className="clip-path-link-container">
              <div className="grid grid-cols-2 divide-x divide-y divide-white/10">
                <a href="#" className="clip-path-link">
                  <span className="clip-path-link-text">Navigate Regulations with Confidence</span>
                  <div className="clip-path-link-reveal">
                    <span className="clip-path-link-text">Navigate Regulations with Confidence</span>
                  </div>
                </a>
                
                <a href="#" className="clip-path-link">
                  <span className="clip-path-link-text">Shield Your Reputation</span>
                  <div className="clip-path-link-reveal">
                    <span className="clip-path-link-text">Shield Your Reputation</span>
                  </div>
                </a>
                
                <a href="#" className="clip-path-link">
                  <span className="clip-path-link-text">Automate and Accelerate</span>
                  <div className="clip-path-link-reveal">
                    <span className="clip-path-link-text">Automate and Accelerate</span>
                  </div>
                </a>
                
                <a href="#" className="clip-path-link">
                  <span className="clip-path-link-text">Secure Exchanges & DeFi</span>
                  <div className="clip-path-link-reveal">
                    <span className="clip-path-link-text">Secure Exchanges & DeFi</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}