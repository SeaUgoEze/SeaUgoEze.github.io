"use client"

import { useEffect, useState } from "react"

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Works" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Correspond" },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-5 transition-all duration-700 ${
        scrolled
          ? "bg-ink/85 backdrop-blur-md border-b border-gold/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <a href="#hero" className="font-serif text-lg tracking-[0.3em] text-parchment hover:text-gold transition-colors duration-500">
        S·E
      </a>

      <div className="hidden md:flex items-center gap-8">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="font-serif text-[11px] tracking-[0.3em] uppercase text-stone hover:text-gold transition-colors duration-500"
          >
            {link.label}
          </a>
        ))}
      </div>

      <a
        href="#contact"
        className="md:hidden font-serif text-[11px] tracking-[0.3em] uppercase text-stone hover:text-gold transition-colors"
      >
        Menu ↓
      </a>
    </nav>
  )
}
