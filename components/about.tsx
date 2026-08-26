"use client"

import { useEffect, useRef } from "react"

interface AboutProps {
  paragraphs: string[]
  asciiArt: string
}

export function About({ paragraphs, asciiArt }: AboutProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0")
            entry.target.classList.remove("opacity-0", "translate-y-8")
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll(".reveal")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 sm:py-32 px-6 bg-gradient-to-b from-black via-neutral-950 to-black"
    >
      <div className="max-w-6xl mx-auto">
        <div className="reveal opacity-0 translate-y-8 transition-all duration-700">
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 font-mono">The Roots</p>
          <h2 className="font-mono text-4xl sm:text-5xl md:text-6xl font-light text-white mb-16">
            About <span className="text-white/50 italic">Me</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Bio */}
          <div className="space-y-6">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="reveal opacity-0 translate-y-8 transition-all duration-700 text-white/50 text-base sm:text-lg leading-relaxed font-light"
                style={{ transitionDelay: `${(i + 1) * 100}ms` }}
              >
                {p}
              </p>
            ))}
          </div>

          {/* ASCII Art */}
          <div className="reveal opacity-0 translate-y-8 transition-all duration-700 flex items-center justify-center">
            {asciiArt ? (
              <pre className="font-mono text-[0.35rem] sm:text-[0.45rem] md:text-[0.55rem] leading-none text-white/30 whitespace-pre overflow-x-auto border border-white/5 p-6 rounded-lg bg-white/[0.02]">
                {asciiArt}
              </pre>
            ) : (
              <div className="w-full h-64 border border-white/5 rounded-lg bg-white/[0.02] flex items-center justify-center">
                <p className="text-white/20 font-mono text-sm">ASCII Art</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
