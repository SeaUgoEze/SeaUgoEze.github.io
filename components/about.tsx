"use client"

import { SectionHeading, GoldDivider } from "./ornaments"
import { useReveal } from "./reveal"

interface AboutProps {
  paragraphs: string[]
  portraitUrl?: string
  quote?: string
}

/**
 * Editorial character-bio layout: drop-cap paragraphs beside a framed
 * portrait, closing with an optional pull quote.
 */
export function About({ paragraphs, portraitUrl, quote }: AboutProps) {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="about" ref={ref} className="relative py-28 sm:py-36 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading numeral="I · The Chronicle" title="About Me" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Portrait */}
          <div className="lg:col-span-5 reveal">
            <div className="relative">
              {/* Gold offset frame */}
              <div className="absolute -top-3 -left-3 w-full h-full border border-gold/25 pointer-events-none" />
              <div className="relative overflow-hidden bg-ink-2">
                {portraitUrl ? (
                  <img
                    src={portraitUrl}
                    alt="Portrait"
                    className="w-full h-[520px] object-cover transition-transform duration-[2000ms] hover:scale-[1.04]"
                  />
                ) : (
                  <div className="w-full h-[520px] flex items-center justify-center bg-gradient-to-br from-ink-2 to-night/20">
                    <p className="font-serif text-stone/50 text-sm tracking-[0.3em] uppercase">Portrait</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent pointer-events-none" />
              </div>
              {/* Bottom corner flourish */}
              <svg
                className="absolute -bottom-7 -right-7 text-gold/40"
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                aria-hidden
              >
                <path d="M0 0 H56 V56" stroke="currentColor" strokeWidth="1" />
                <path d="M8 8 H48 V48" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
              </svg>
            </div>
          </div>

          {/* Bio text */}
          <div className="lg:col-span-7 space-y-6">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={`reveal text-parchment/75 text-lg leading-relaxed font-body ${
                  i === 0 ? "dropcap" : ""
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {p}
              </p>
            ))}

            {quote && (
              <div className="reveal pt-8" style={{ transitionDelay: "300ms" }}>
                <GoldDivider />
                <blockquote className="mt-8 text-center">
                  <p className="font-serif text-2xl sm:text-3xl text-parchment/90 italic leading-snug">
                    &ldquo;{quote}&rdquo;
                  </p>
                </blockquote>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
