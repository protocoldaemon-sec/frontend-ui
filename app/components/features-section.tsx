"use client"

import { useEffect, useRef } from "react"

export function FeaturesSection() {
  const velocityTextRef = useRef<HTMLHeadElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const velocityText = velocityTextRef.current
    const wrapper = wrapperRef.current

    if (!velocityText || !wrapper) return

    let lastScrollY = window.scrollY
    let lastTimestamp = performance.now()
    let targetSkew = 0
    let currentSkew = 0

    const update = () => {
      const wrapperRect = wrapper.getBoundingClientRect()
      const scrollableHeight = wrapper.scrollHeight - window.innerHeight
      const progress = -wrapperRect.top / scrollableHeight

      const textWidth = velocityText.scrollWidth
      const maxTranslate = textWidth - window.innerWidth
      const translateX = -maxTranslate * progress

      currentSkew += (targetSkew - currentSkew) * 0.1

      velocityText.style.transform = `translateX(${translateX}px) skewX(${currentSkew}deg)`

      requestAnimationFrame(update)
    }

    const handleScroll = () => {
      const now = performance.now()
      const deltaY = window.scrollY - lastScrollY
      const deltaTime = now - lastTimestamp

      if (deltaTime > 0) {
        const velocity = deltaY / deltaTime
        const maxSkew = 15
        targetSkew = Math.max(-maxSkew, Math.min(maxSkew, -velocity * 0.5))
      }

      lastScrollY = window.scrollY
      lastTimestamp = now
    }

    window.addEventListener("scroll", handleScroll)
    requestAnimationFrame(update)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      {/* Velocity Scroll Text Effect */}
      <div ref={wrapperRef} className="h-[200vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          <h2
            ref={velocityTextRef}
            className="velocity-text plus-jakarta font-extrabold text-6xl md:text-9xl whitespace-nowrap will-change-transform leading-none uppercase"
          >
            THE FASTEST WAY TO TRACE&nbsp;—&nbsp;THE FASTEST WAY TO TRACE&nbsp;—&nbsp;THE FASTEST WAY TO
            TRACE&nbsp;—&nbsp;
          </h2>
        </div>
      </div>

      <section id="features" className="py-20 px-4 md:px-8 relative bg-[#000B19]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Feature Card 1 */}
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/60 border border-cyan-400/15 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-transform duration-1000">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/acbc5129b8a8a9388f18ed2b31b712cf29c77edd?width=678"
                  className="w-1/2 md:w-1/3 object-contain"
                  alt="Pattern Recognition"
                />
                <div className="md:w-2/3">
                  <h3 className="plus-jakarta text-3xl md:text-4xl font-extrabold tracking-wider text-white">
                    Pattern Recognition
                  </h3>
                  <p className="plus-jakarta mt-4 text-lg md:text-xl tracking-wide text-gray-300">
                    AI-powered detection of hidden transaction patterns and anomalous fund flows.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/60 border border-cyan-400/15 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-transform duration-1000">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/b7b6c967b2af999b73581d87c1cb293d414f2668?width=684"
                  className="w-1/2 md:w-1/3 object-contain"
                  alt="Smart Contract Security"
                />
                <div className="md:w-2/3 text-white">
                  <h3 className="plus-jakarta text-3xl md:text-4xl font-bold tracking-wider">
                    Smart Contract Security
                  </h3>
                  <p className="plus-jakarta mt-4 text-lg md:text-xl tracking-wide">
                    Automated vulnerability checks to flag malicious or risky contracts before exposure.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/60 border border-cyan-400/15 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-transform duration-1000">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/f3567b2f17a4fe4018985bfb2cbc801c651d99d0?width=572"
                  className="w-1/2 md:w-1/3 object-contain"
                  alt="OSINT Enhanced"
                />
                <div className="md:w-2/3 text-white">
                  <h3 className="plus-jakarta text-3xl md:text-4xl font-extrabold tracking-wider">OSINT Enhanced</h3>
                  <p className="plus-jakarta mt-4 text-lg md:text-xl tracking-wide text-gray-300">
                    Go beyond the blockchain with integrated open-source intelligence for off-chain context.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/60 border border-cyan-400/15 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-transform duration-1000">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/759555c85f4dab40bf95c2250aff8ea3201a2341?width=654"
                  className="w-1/2 md:w-1/3 object-contain"
                  alt="Forensic Reporting"
                />
                <div className="md:w-2/3">
                  <h3 className="plus-jakarta text-3xl md:text-4xl font-extrabold tracking-wider text-white">
                    Forensic Reporting
                  </h3>
                  <p className="plus-jakarta mt-4 text-lg md:text-xl tracking-wide text-gray-300">
                    Generate investigation-grade case reports with fund flow mapping, entity attribution, and sanctions
                    intelligence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
