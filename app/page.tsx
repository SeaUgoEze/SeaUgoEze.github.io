"use client"

import { useEffect, useState } from "react"
import { fetchPortfolioData, type PortfolioData } from "@/lib/firebase"
import { Cursor } from "@/components/cursor"
import { Nav } from "@/components/nav"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { ProjectsMap } from "@/components/projects-map"
import { Experience } from "@/components/experience"
import { Skills } from "@/components/skills"
import { Leadership } from "@/components/leadership"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { GoldDivider } from "@/components/ornaments"

export default function Page() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [minDelayPassed, setMinDelayPassed] = useState(false)

  useEffect(() => {
    // Ensure the loading sigil shows for at least 900ms for cinematic pacing
    const t = setTimeout(() => setMinDelayPassed(true), 900)
    fetchPortfolioData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
    return () => clearTimeout(t)
  }, [])

  if (loading || !minDelayPassed || !data) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <svg width="52" height="52" viewBox="0 0 52 52" className="mx-auto text-gold">
            <rect
              x="14"
              y="14"
              width="24"
              height="24"
              transform="rotate(45 26 26)"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2.4s" repeatCount="indefinite" />
            </rect>
            <rect
              x="21"
              y="21"
              width="10"
              height="10"
              transform="rotate(45 26 26)"
              fill="currentColor"
            >
              <animate attributeName="opacity" values="1;0.3;1" dur="2.4s" repeatCount="indefinite" />
            </rect>
          </svg>
          <p className="font-serif text-[10px] tracking-[0.5em] uppercase text-stone/60 mt-6">
            Summoning
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-ink min-h-screen">
      <Cursor />
      <Nav />
      <Hero
        name={data.hero.name}
        firstName={data.hero.firstName}
        lastName={data.hero.lastName}
        tagline={data.hero.tagline}
        pills={data.hero.pills}
        backgroundArt={data.hero.backgroundArt}
      />
      <GoldDivider wide />
      <About
        paragraphs={data.about.paragraphs}
        portraitUrl={data.about.portraitUrl}
        quote={data.about.quote}
      />
      <ProjectsMap projects={data.projects} />
      <Experience items={data.experience} />
      <Skills skills={data.skills} />
      <Leadership items={data.leadership} />
      <Contact contact={data.contact} />
      <Footer />
    </div>
  )
}
