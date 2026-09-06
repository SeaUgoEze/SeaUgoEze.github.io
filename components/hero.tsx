"use client"

import { useEffect, useMemo, useRef } from "react"
import { Ornament } from "./ornaments"

interface HeroProps {
  name: string
  firstName: string
  lastName: string
  tagline: string
  pills: string[]
  backgroundArt?: string
}

/**
 * Cinematic full-screen opening: slow-zooming backdrop art, ember motes
 * drifting upward, serif display name with gold keyword, heraldic ornament.
 */
export function Hero({ name, firstName, lastName, tagline, pills, backgroundArt }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const embers = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        left: `${(i * 37 + 13) % 100}%`,
        size: 2 + ((i * 7) % 3),
        delay: `${(i * 1.7) % 12}s`,
        duration: `${14 + ((i * 5) % 10)}s`,
        dx: `${((i * 23) % 60) - 30}px`,
        opacity: 0.35 + ((i * 11) % 40) / 100,
      })),
    []
  )

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      const h = window.innerHeight
      if (y < h && contentRef.current) {
        contentRef.current.style.transform = `translateY(${y * 0.22}px)`
        contentRef.current.style.opacity = String(Math.max(0, 1 - y / (h * 0.7)))
      }
      if (heroRef.current && y < h) {
        heroRef.current.style.transform = `translateY(${y * 0.1}px)`
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const titleWords = name.split(" ")

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Backdrop art with slow zoom */}
      <div className="absolute inset-0">
        {backgroundArt ? (
          <img
            src={backgroundArt}
            alt=""
            className="w-full h-full object-cover opacity-45"
            style={{ animation: "slow-zoom 40s ease-in-out infinite alternate" }}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(215,152,58,0.10), transparent 65%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(29,43,58,0.35), transparent 70%), radial-gradient(ellipse 50% 40% at 15% 75%, rgba(122,46,46,0.12), transparent 70%)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/35 to-ink" />
      </div>

      {/* Ember motes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {embers.map((e, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: e.left,
              bottom: "-10px",
              width: e.size,
              height: e.size,
              backgroundColor: "rgba(215,152,58,0.85)",
              boxShadow: "0 0 6px 1px rgba(215,152,58,0.5)",
              opacity: 0,
              // @ts-expect-error CSS custom property
              "--dx": e.dx,
              animation: `ember-drift ${e.duration} linear ${e.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-16">
        <p className="text-[11px] sm:text-xs tracking-[0.55em] uppercase text-gold/80 font-serif mb-8 animate-flicker">
          {tagline}
        </p>

        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-wide text-parchment leading-[1.05]">
          {titleWords.slice(0, -1).map((w, i) => (
            <span key={i} className="block">
              {w}
            </span>
          ))}
          <span className="block text-gold" style={{ animation: "title-glow 3s ease 1.2s both" }}>
            {titleWords[titleWords.length - 1]}
          </span>
        </h1>

        <div className="mt-10">
          <Ornament className="mx-auto" />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {pills.map((pill, i) => (
            <span
              key={i}
              className="font-serif text-[11px] sm:text-xs tracking-[0.35em] uppercase text-stone hover:text-gold transition-colors duration-500"
            >
              {pill}
            </span>
          ))}
        </div>

        <div className="mt-14 flex justify-center gap-5">
          <a
            href="#projects"
            className="px-9 py-3.5 border border-gold/60 text-gold font-serif text-xs tracking-[0.3em] uppercase hover:bg-gold hover:text-ink transition-all duration-500"
          >
            View Works
          </a>
          <a
            href="#contact"
            className="px-9 py-3.5 border border-parchment/20 text-parchment/70 font-serif text-xs tracking-[0.3em] uppercase hover:border-parchment/50 hover:text-parchment transition-all duration-500"
          >
            Correspond
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <div className="w-px h-14 bg-gradient-to-b from-gold/50 to-transparent mx-auto" />
        <p className="text-[9px] tracking-[0.4em] uppercase text-stone/60 mt-3 font-serif">Descend</p>
      </div>
    </section>
  )
}
