"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useReducedMotion } from "motion/react"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*"

interface TextScrambleProps {
  text: string
  className?: string
}

export function TextScramble({ text, className = "" }: TextScrambleProps) {
  const reduce = useReducedMotion()
  const [displayText, setDisplayText] = useState(text)
  const [isScrambling, setIsScrambling] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const frameRef = useRef(0)

  const scramble = useCallback(() => {
    if (reduce) return
    setIsScrambling(true)
    frameRef.current = 0
    const duration = text.length * 3

    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      frameRef.current++

      const progress = frameRef.current / duration
      const revealedLength = Math.floor(progress * text.length)

      const newText = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " "
          if (i < revealedLength) return text[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join("")

      setDisplayText(newText)

      if (frameRef.current >= duration) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setDisplayText(text)
        setIsScrambling(false)
      }
    }, 30)
  }, [text, reduce])

  const handleMouseEnter = () => {
    scramble()
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div
      className={`group relative inline-flex cursor-pointer select-none ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      <span className="relative font-mono text-sm tracking-[0.18em] uppercase">
        {displayText.split("").map((char, i) => (
          <span
            key={i}
            className={`inline-block transition-all duration-150 ${
              isScrambling && char !== text[i]
                ? "scale-110 text-vetiver"
                : "text-bone-dim group-hover:text-bone"
            }`}
            style={{
              transitionDelay: `${i * 10}ms`,
            }}
          >
            {char}
          </span>
        ))}
      </span>
    </div>
  )
}
