"use client"

import { useEffect, useRef } from "react"

interface LeadershipItem {
  id: string
  org: string
  role: string
  description: string
}

interface LeadershipProps {
  items: LeadershipItem[]
}

export function Leadership({ items }: LeadershipProps) {
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
      id="leadership"
      ref={sectionRef}
      className="py-24 sm:py-32 px-6 bg-gradient-to-b from-black via-neutral-950 to-black"
    >
      <div className="max-w-4xl mx-auto">
        <div className="reveal opacity-0 translate-y-8 transition-all duration-700 mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 font-mono">Branches</p>
          <h2 className="font-mono text-4xl sm:text-5xl md:text-6xl font-light text-white">
            Leadership <span className="text-white/50 italic">&amp; Community</span>
          </h2>
        </div>

        <div className="space-y-0">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="reveal opacity-0 translate-y-8 transition-all duration-700 relative pl-8 border-l border-white/10 pb-10 last:pb-0 group hover:border-white/30 transition-colors"
              style={{ transitionDelay: `${(i + 1) * 100}ms` }}
            >
              <div className="absolute left-0 top-0 w-3 h-3 -translate-x-[5px] rounded-full border border-white/30 bg-black group-hover:bg-white/30 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all" />

              <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-mono mb-2">
                {item.org}
              </p>
              <h4 className="font-mono text-lg sm:text-xl text-white font-medium mb-2">
                {item.role}
              </h4>
              <p className="text-white/40 text-sm leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
