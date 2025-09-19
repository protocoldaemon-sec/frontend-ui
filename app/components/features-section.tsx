"use client"

import { useEffect, useRef } from "react"

export function FeaturesSection() {
  const velocityTextRef = useRef<HTMLHeadElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = document.getElementById('draw-effect-section');
    if (section) {
      // Add visible class after a small delay to ensure the element is in the DOM
      setTimeout(() => {
        section.classList.add('visible');
      }, 100);
    }
  }, []);

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
      {/* <div ref={wrapperRef} className="h-[200vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          <h2
            ref={velocityTextRef}
            className="velocity-text plus-jakarta font-extrabold text-6xl md:text-9xl whitespace-nowrap will-change-transform leading-none uppercase"
          >
            THE FASTEST WAY TO TRACE&nbsp;—&nbsp;THE FASTEST WAY TO TRACE&nbsp;—&nbsp;THE FASTEST WAY TO
            TRACE&nbsp;—&nbsp;
          </h2>
        </div>
      </div> */}
      

      <section id="features" className="py-20 px-4 md:px-8 relative bg-[#000B19]">
      <div id="draw-effect-section" class="py-24 px-4 md:px-8 bg-[#000B19] text-center scroll-animation">
            <h2 class="plus-jakarta text-white text-4xl md:text-6xl font-bold max-w-4xl mx-auto leading-tight">
                Uncover the Truth with&nbsp;
                <span class="relative inline-block text-cyan-400">
                    Precision
                    <svg viewBox="0 0 345 84" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute -left-4 -right-4 -top-2 -bottom-4">
                        <path id="circle-path" d="M171.745 2.00002C127.906 19.3441 -1.4985 11.2312 2.30748 48.6015C4.78288 74.1913 41.3415 80.4439 152.483 78.8573C263.625 77.2707 384.711 75.3193 335.631 42.6105C280.12 -0.806297 122.033 26.311 68.9954 2.00002" stroke="#00C8FF" stroke-width="3" stroke-dasharray="1000" stroke-dashoffset="1000"/>
                    </svg>
                </span>
                &nbsp;Security Tools
            </h2>
        </div>
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
                    Risk Engine
                  </h3>
                  <p className="plus-jakarta mt-4 text-lg md:text-xl tracking-wide text-gray-300">
                    AI-powered detection from address screening and transaction monitoring.
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
                    Smart Contract Pre-Audit
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
