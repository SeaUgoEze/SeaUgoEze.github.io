"use client"

import { useEffect, useRef } from "react"

interface ContactData {
  email: string
  github: string
  githubUsername: string
  linkedin: string
  linkedinUsername: string
  chips: string[]
}

interface ContactProps {
  contact: ContactData
}

export function Contact({ contact }: ContactProps) {
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
      id="contact"
      ref={sectionRef}
      className="py-24 sm:py-32 px-6 bg-gradient-to-b from-black to-neutral-950"
    >
      <div className="max-w-4xl mx-auto">
        <div className="reveal opacity-0 translate-y-8 transition-all duration-700 mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 font-mono">Let&apos;s Connect</p>
          <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight">
            &quot;Let&apos;s build
            <br />
            <span className="text-white/50 italic">something meaningful.</span>&quot;
          </h2>
        </div>

        {/* Interest chips */}
        <div className="reveal opacity-0 translate-y-8 transition-all duration-700 flex flex-wrap gap-3 mb-12" style={{ transitionDelay: "100ms" }}>
          {contact.chips.map((chip, i) => (
            <span
              key={i}
              className="px-4 py-2 text-xs tracking-[0.1em] border border-white/10 text-white/40 hover:border-white/30 hover:text-white/70 transition-all duration-300 cursor-default"
            >
              {chip}
            </span>
          ))}
        </div>

        {/* Contact links */}
        <div className="reveal opacity-0 translate-y-8 transition-all duration-700 space-y-0" style={{ transitionDelay: "200ms" }}>
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-6 py-5 border-b border-white/5 hover:border-white/15 transition-colors group"
          >
            <span className="text-[10px] tracking-[0.25em] uppercase text-white/25 font-mono min-w-[70px]">Email</span>
            <span className="font-mono text-lg sm:text-xl text-white/70 font-light group-hover:text-white transition-colors">
              {contact.email}
            </span>
            <span className="ml-auto text-white/15 group-hover:text-white/50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">↗</span>
          </a>

          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-6 py-5 border-b border-white/5 hover:border-white/15 transition-colors group"
          >
            <span className="text-[10px] tracking-[0.25em] uppercase text-white/25 font-mono min-w-[70px]">GitHub</span>
            <span className="font-mono text-lg sm:text-xl text-white/70 font-light group-hover:text-white transition-colors">
              {contact.githubUsername}
            </span>
            <span className="ml-auto text-white/15 group-hover:text-white/50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">↗</span>
          </a>

          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-6 py-5 border-b border-white/5 hover:border-white/15 transition-colors group"
          >
            <span className="text-[10px] tracking-[0.25em] uppercase text-white/25 font-mono min-w-[70px]">LinkedIn</span>
            <span className="font-mono text-lg sm:text-xl text-white/70 font-light group-hover:text-white transition-colors">
              {contact.linkedinUsername}
            </span>
            <span className="ml-auto text-white/15 group-hover:text-white/50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
