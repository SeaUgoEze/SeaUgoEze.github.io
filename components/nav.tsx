"use client"

import { useEffect, useState } from "react"

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-6 py-5 transition-all duration-500 ${
        scrolled ? "bg-black/85 backdrop-blur-xl border-b border-white/5" : ""
      }`}
    >
      <div className="flex items-center gap-8 text-sm font-mono tracking-wider">
        <a
          href="#hero"
          className="text-white hover:text-white/60 transition-colors font-semibold"
        >
          S·E
        </a>
        <a href="#about" className="text-white/50 hover:text-white/80 transition-colors hidden sm:block">
          ABOUT
        </a>
        <a href="#projects" className="text-white/50 hover:text-white/80 transition-colors hidden sm:block">
          PROJECTS
        </a>
        <a href="#skills" className="text-white/50 hover:text-white/80 transition-colors hidden sm:block">
          SKILLS
        </a>
        <a href="#experience" className="text-white/50 hover:text-white/80 transition-colors hidden sm:block">
          EXPERIENCE
        </a>
        <a href="#contact" className="text-white/50 hover:text-white/80 transition-colors hidden sm:block">
          CONTACT
        </a>
      </div>
    </nav>
  )
}
