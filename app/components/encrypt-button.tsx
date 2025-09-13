"use client"

import { useState, useRef, type ReactNode } from "react"

interface EncryptButtonProps {
  text: string
  children?: ReactNode
  className?: string
  onClick?: () => void
}

export function EncryptButton({ text, children, className = "", onClick }: EncryptButtonProps) {
  const [displayText, setDisplayText] = useState(text)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const CYCLES_PER_LETTER = 2
  const SHUFFLE_TIME = 50
  const CHARS = "!@#$%^&*():{};|,.<>/?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

  const scrambleText = () => {
    let pos = 0

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      const scrambled = text
        .split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char
          }
          if (char === " ") return " "
          const randomCharIndex = Math.floor(Math.random() * CHARS.length)
          return CHARS[randomCharIndex]
        })
        .join("")

      setDisplayText(scrambled)
      pos++

      if (pos >= text.length * CYCLES_PER_LETTER) {
        clearInterval(intervalRef.current!)
        setDisplayText(text)
      }
    }, SHUFFLE_TIME)
  }

  const restoreText = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setDisplayText(text)
  }

  return (
    <button
      className={`encrypt-btn relative overflow-hidden transition-transform duration-200 hover:scale-105 active:scale-95 ${className}`}
      onMouseEnter={scrambleText}
      onMouseLeave={restoreText}
      onClick={onClick}
    >
      <div className="relative z-10 flex items-center gap-2">
        {children}
        <span>{displayText}</span>
      </div>
      <span className="animated-bg absolute inset-0 z-0 scale-125 bg-gradient-to-t from-transparent via-indigo-300/50 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
    </button>
  )
}
