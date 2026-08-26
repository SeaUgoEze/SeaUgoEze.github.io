"use client"

import { useEffect, useState } from "react"
import { fetchPortfolioData, type PortfolioData } from "@/lib/firebase"
import { Nav } from "@/components/nav"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { ProjectsGallery } from "@/components/projects-gallery"
import { Experience } from "@/components/experience"
import { Skills } from "@/components/skills"
import { Leadership } from "@/components/leadership"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Page() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolioData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/30 font-mono text-xs tracking-[0.2em] uppercase">Loading</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/30 font-mono text-sm">Failed to load portfolio data</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Nav />
      <Hero
        name={data.hero.name}
        firstName={data.hero.firstName}
        lastName={data.hero.lastName}
        tagline={data.hero.tagline}
        pills={data.hero.pills}
        asciiArt={data.about.asciiArt}
      />
      <About paragraphs={data.about.paragraphs} asciiArt={data.about.asciiArt} />
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <ProjectsGallery projects={data.projects} />
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <Experience items={data.experience} />
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <Skills skills={data.skills} />
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <Leadership items={data.leadership} />
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <Contact contact={data.contact} />
      <Footer />
    </div>
  )
}
