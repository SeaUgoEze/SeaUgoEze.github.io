"use client"

import { SectionHeading, GoldDivider } from "./ornaments"
import { useReveal } from "./reveal"

interface ExperienceItem {
  id: string
  org: string
  role: string
  description: string
  startDate: string
  endDate: string
}

/**
 * Chronicle timeline: gold spine with diamond nodes, serif headings,
 * staggered reveals. Dates render as smallcaps chapters.
 */
export function Experience({ items }: { items: ExperienceItem[] }) {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="experience" ref={ref} className="relative py-28 sm:py-36 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading numeral="III · Deeds" title="Experience" />

        <div className="relative">
          {/* Spine */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-gold/40 via-gold/15 to-transparent" />

          <div className="space-y-14">
            {items.map((item, i) => {
              const period = [item.startDate, item.endDate].filter(Boolean).join(" — ")
              return (
                <article
                  key={item.id}
                  className="reveal relative pl-12"
                  style={{ transitionDelay: `${i * 140}ms` }}
                >
                  {/* Node */}
                  <svg
                    className="absolute left-0 top-2 text-gold"
                    width="15"
                    height="15"
                    viewBox="0 0 10 10"
                    aria-hidden
                  >
                    <rect
                      x="2"
                      y="2"
                      width="6"
                      height="6"
                      transform="rotate(45 5 5)"
                      fill="#0a0908"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </svg>

                  {period && (
                    <p className="font-serif text-[10px] tracking-[0.4em] uppercase text-gold/70 mb-2">
                      {period}
                    </p>
                  )}
                  <h3 className="font-serif text-2xl text-parchment tracking-wide">{item.role}</h3>
                  <p className="font-serif text-sm tracking-[0.2em] uppercase text-stone mt-1">
                    {item.org}
                  </p>
                  <p className="font-body text-lg leading-relaxed text-parchment/70 mt-4 max-w-2xl">
                    {item.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
