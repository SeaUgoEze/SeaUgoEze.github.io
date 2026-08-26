"use client"

import { useState, useEffect, useRef } from "react"
import { VideoCard } from "./video-card"
import { CustomCursor } from "./custom-cursor"

interface Project {
  id: string
  title: string
  category: string
  description: string
  languages: string[]
  imageUrl: string
  videoUrl: string
  githubUrl: string
  highlights: string[]
}

interface ProjectsGalleryProps {
  projects: Project[]
}

export function ProjectsGallery({ projects }: ProjectsGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
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
      id="projects"
      ref={sectionRef}
      className="py-24 sm:py-32 px-6 bg-gradient-to-b from-black via-neutral-950 to-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="reveal opacity-0 translate-y-8 transition-all duration-700 mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 font-mono">Full Bloom</p>
          <h2 className="font-mono text-4xl sm:text-5xl md:text-6xl font-light text-white">
            Selected <span className="text-white/50 italic">Projects</span>
          </h2>
        </div>

        <CustomCursor isActive={hoveredId !== null} />

        <div className="reveal opacity-0 translate-y-8 transition-all duration-700 flex gap-4 items-stretch">
          {projects.map((project) => (
            <VideoCard
              key={project.id}
              project={project}
              isHovered={hoveredId === project.id}
              onHoverChange={(hovered) => setHoveredId(hovered ? project.id : null)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
