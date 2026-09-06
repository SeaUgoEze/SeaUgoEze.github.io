"use client"

import { Ornament } from "./ornaments"
import { useReveal } from "./reveal"

interface ContactData {
  email: string
  github: string
  githubUsername: string
  linkedin: string
  linkedinUsername: string
  chips: string[]
}

/**
 * Letterpress closing: centered serif invitation, interest lines rendered
 * as an em-dash ledger, contact rows as raven-post entries.
 */
export function Contact({ contact }: { contact: ContactData }) {
  const ref = useReveal<HTMLElement>()

  const rows = [
    { label: "Raven", value: contact.email, href: `mailto:${contact.email}` },
    { label: "GitHub", value: contact.githubUsername, href: contact.github },
    { label: "LinkedIn", value: contact.linkedinUsername, href: contact.linkedin },
  ].filter((r) => r.value)

  return (
    <section id="contact" ref={ref} className="relative py-28 sm:py-36 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-serif text-[11px] tracking-[0.5em] uppercase text-gold/70 mb-6 reveal-fade">
          VI · Correspondence
        </p>

        <h2 className="reveal font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-parchment leading-tight tracking-wide">
          Send word.
        </h2>

        <p className="reveal font-body italic text-stone text-xl mt-6 max-w-xl mx-auto leading-relaxed">
          {contact.chips.length > 0
            ? `Open to ${contact.chips.slice(0, 3).join(", ").toLowerCase().replace(/, ([^,]*)$/, ", or $1")}.`
            : "Open to new endeavors."}
        </p>

        <div className="reveal my-12">
          <Ornament className="mx-auto" />
        </div>

        <div className="reveal space-y-0 text-left">
          {rows.map((row) => (
            <a
              key={row.label}
              href={row.href}
              target={row.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group flex items-baseline gap-6 py-5 border-b border-gold/10 hover:border-gold/35 transition-colors duration-500"
            >
              <span className="font-serif text-[10px] tracking-[0.4em] uppercase text-gold/60 w-20 shrink-0">
                {row.label}
              </span>
              <span className="font-body text-xl text-parchment/75 group-hover:text-gold-bright transition-colors duration-500 truncate">
                {row.value}
              </span>
              <span className="ml-auto text-gold/30 group-hover:text-gold group-hover:translate-x-1 transition-all duration-500 font-serif">
                →
              </span>
            </a>
          ))}
        </div>

        {contact.chips.length > 0 && (
          <div className="reveal mt-14 flex flex-wrap justify-center gap-x-8 gap-y-2">
            {contact.chips.map((chip, i) => (
              <span
                key={i}
                className="font-serif text-[10px] tracking-[0.35em] uppercase text-stone/70"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
