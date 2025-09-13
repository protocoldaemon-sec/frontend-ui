"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Lock } from "lucide-react"
import { EncryptButton } from "./encrypt-button"

export function HeroSection() {
  const [line1Text, setLine1Text] = useState("")
  const [line2Text, setLine2Text] = useState("")

  useEffect(() => {
    const bubbleWrapper = (text: string, setter: (text: string) => void) => {
      const wrapped = text
        .split("")
        .map(
          (char) =>
            `<span class="bubble-text-char inline-block font-light transition-all duration-350 hover:font-bold hover:text-white hover:scale-110 hover:-translate-y-1 hover:drop-shadow-[0_0_15px_rgba(0,200,255,0.7)]">${char === " " ? "&nbsp;" : char}</span>`,
        )
        .join("")
      setter(wrapped)
    }

    bubbleWrapper("SEE EVERYTHING", setLine1Text)
    bubbleWrapper("EVERYTHING SEE", setLine2Text)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center text-center pt-32 pb-16 px-4 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-slate-900 to-slate-900"></div>
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://api.builder.io/api/v1/image/assets/TEMP/e9f658c779baa8e0ead0ae0726bb8da1b925c4ae?width=4962')",
        }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent mix-blend-plus-lighter opacity-30"></div>

      {/* Floating Decorative Elements */}
      <div
        className="absolute w-24 h-24 md:w-32 md:h-32 rounded-lg top-1/4 left-[10%] lg:left-[15%] bg-gradient-to-br from-gray-300 to-gray-600 mix-blend-soft-light animate-bounce"
        style={{ animationDuration: "6s" }}
      ></div>
      <div
        className="absolute w-24 h-24 md:w-32 md:h-32 rounded-lg top-1/2 right-[10%] lg:right-[15%] bg-gradient-to-br from-gray-300 to-gray-600 mix-blend-soft-light animate-bounce"
        style={{ animationDuration: "6s", animationDelay: "-3s" }}
      ></div>
      <div
        className="absolute w-16 h-16 md:w-24 md:h-24 rounded-lg bottom-1/4 left-[40%] lg:left-[45%] bg-gradient-to-br from-gray-300 to-gray-600 mix-blend-soft-light animate-bounce"
        style={{ animationDuration: "6s", animationDelay: "-1.5s" }}
      ></div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <h1 className="plus-jakarta font-light text-5xl md:text-7xl lg:text-8xl uppercase tracking-wider">
          <span className="whitespace-nowrap block" dangerouslySetInnerHTML={{ __html: line1Text }} />
          <span className="block whitespace-nowrap" dangerouslySetInnerHTML={{ __html: line2Text }} />
        </h1>
        <p className="plus-jakarta text-2xl md:text-4xl capitalize tracking-wide">AI powered investigator tools</p>
        <Link href="/copilot" className="mt-8">
          <EncryptButton
            text="Try Beta"
            className="plus-jakarta font-semibold text-lg md:text-xl uppercase tracking-widest text-white bg-white/10 border border-cyan-400/50 rounded-lg px-10 py-4 hover:bg-cyan-400/20 hover:shadow-[0_0_20px_rgba(0,200,255,0.3)] transition-all duration-300"
          >
            <Lock className="w-5 h-5" />
          </EncryptButton>
        </Link>
      </div>
    </section>
  )
}
