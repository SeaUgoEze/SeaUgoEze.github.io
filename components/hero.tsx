"use client"

import { useEffect, useRef } from "react"

interface HeroProps {
  name: string
  firstName: string
  lastName: string
  tagline: string
  pills: string[]
  asciiArt: string
}

export function Hero({ name, firstName, lastName, tagline, pills, asciiArt }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY
        const h = window.innerHeight
        if (scrollY < h) {
          heroRef.current.style.transform = `translateY(${scrollY * 0.28}px)`
          heroRef.current.style.opacity = String(Math.max(0, 1 - scrollY / (h * 0.65)))
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 via-black to-black" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-pulse"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      <div ref={heroRef} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* ASCII Art */}
        {asciiArt && (
          <pre className="font-mono text-[0.4rem] sm:text-[0.5rem] md:text-[0.6rem] leading-none text-white/20 mb-8 whitespace-pre overflow-x-auto">
            {asciiArt}
          </pre>
        )}

        {/* Tagline */}
        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-white/40 mb-6 font-mono">
          {tagline}
        </p>

        {/* Name */}
        <h1 className="font-mono text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight text-white mb-8">
          {firstName}
          <br />
          <span className="text-white/60">{lastName}</span>
        </h1>

        {/* Vine line */}
        <div className="w-0 h-px bg-gradient-to-r from-white/40 via-white/20 to-transparent mx-auto mb-8 animate-[vineGrow_1.4s_0.5s_ease_forwards]" />

        {/* Skills pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {pills.map((pill, i) => (
            <span
              key={i}
              className="px-4 py-2 text-xs tracking-[0.15em] uppercase border border-white/10 rounded-full text-white/50 hover:border-white/30 hover:text-white/80 transition-all duration-300"
            >
              {pill}
            </span>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex justify-center gap-4">
          <a
            href="#projects"
            className="px-8 py-3 bg-white text-black text-xs tracking-[0.15em] uppercase font-mono font-medium hover:bg-white/90 transition-all duration-300 hover:-translate-y-1"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border border-white/20 text-white/60 text-xs tracking-[0.15em] uppercase font-mono hover:border-white/40 hover:text-white transition-all duration-300 hover:-translate-y-1"
          >
            Contact Me
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-[9px] tracking-[0.3em] uppercase text-white/20 mb-3 font-mono">Scroll</p>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent mx-auto animate-pulse" />
      </div>

      <style jsx>{`
        @keyframes vineGrow {
          to { width: 340px; }
        }
      `}</style>
    </section>
  )
}
