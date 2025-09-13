"use client"

import { useEffect, useState } from "react"

interface LoadingScreenProps {
  variant?: "particles" | "bars"
}

export function LoadingScreen({ variant = "particles" }: LoadingScreenProps) {
  const [currentWord, setCurrentWord] = useState("")
  const [wordIndex, setWordIndex] = useState(0)

  const words = ["Analyzing", "Decrypting", "Tracing", "Securing", "Daemon"]

  useEffect(() => {
    if (variant === "particles") {
      const scrambleWord = (text: string, onComplete: () => void) => {
        const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let pos = 0

        const interval = setInterval(() => {
          const scrambled = text
            .split("")
            .map((char, index) => {
              if (pos / 2 > index) return char
              if (char === " ") return " "
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            })
            .join("")

          setCurrentWord(scrambled)
          pos++

          if (pos >= text.length * 2) {
            clearInterval(interval)
            setCurrentWord(text)
            onComplete()
          }
        }, 60)
      }

      const cycleWords = () => {
        if (wordIndex >= words.length) return

        scrambleWord(words[wordIndex], () => {
          setTimeout(
            () => {
              setWordIndex((prev) => prev + 1)
            },
            wordIndex === words.length - 1 ? 1200 : 400,
          )
        })
      }

      cycleWords()
    }
  }, [wordIndex, variant, words])

  if (variant === "bars") {
    return (
      <div
        id="loader"
        className="fixed top-0 left-0 w-full h-full bg-[#000B19] flex justify-center items-center z-[1000] transition-opacity duration-500"
      >
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-12 bg-cyan-400 animate-pulse"
              style={{
                animation: `bar-loader-anim 1s infinite alternate cubic-bezier(0.6, 0.04, 0.98, 0.335)`,
                animationDelay: `${i * 0.25}s`,
              }}
            />
          ))}
        </div>
        <style jsx>{`
          @keyframes bar-loader-anim {
            0% {
              transform: scaleY(0.5);
              opacity: 0.2;
            }
            100% {
              transform: scaleY(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div
      id="loader"
      className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 to-slate-900 flex justify-center items-center z-[1000] transition-opacity duration-75"
    >
      <h1 className="plus-jakarta text-3xl md:text-4xl font-semibold uppercase tracking-widest text-white">
        {currentWord}
      </h1>
    </div>
  )
}
