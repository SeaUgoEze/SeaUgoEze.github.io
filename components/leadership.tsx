"use client"

import { SectionHeading, GoldDivider } from "./ornaments"
import { useReveal } from "./reveal"

interface LeadershipItem {
  id: string
  org: string
  role: string
  description: string
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

/**
 * Leadership as a chapter ledger: numbered rows with gold hover states.
 */
export function Leadership({ items }: { items: LeadershipItem[] }) {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="leadership" ref={ref} className="relative py-28 sm:py-36 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading numeral="V · Service" title="Leadership" />

        <div className="space-y-0">
          {items.map((item, i) => (
            <article
              key={item.id}
              className="reveal group grid grid-cols-[64px_1fr] gap-6 py-8 border-b border-gold/10 hover:border-gold/30 transition-colors duration-700"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <span className="font-serif text-2xl text-gold/40 group-hover:text-gold transition-colors duration-500 pt-1">
                {ROMAN[i] ?? String(i + 1)}
              </span>
              <div>
                <h3 className="font-serif text-2xl text-parchment tracking-wide group-hover:text-gold-bright transition-colors duration-500">
                  {item.role}
                </h3>
                <p className="font-serif text-sm tracking-[0.2em] uppercase text-stone mt-1">
                  {item.org}
                </p>
                <p className="font-body text-lg leading-relaxed text-parchment/70 mt-3">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14">
          <GoldDivider />
        </div>
      </div>
    </section>
  )
}
