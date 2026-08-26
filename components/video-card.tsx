"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

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

interface VideoCardProps {
  project: Project
  isHovered: boolean
  onHoverChange: (hovered: boolean) => void
}

export function VideoCard({ project, isHovered, onHoverChange }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    } else if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [isHovered])

  const defaultImage = `https://placehold.co/600x800/111/333?text=${encodeURIComponent(project.title)}`

  return (
    <div
      className={cn(
        "group relative rounded-[2.5rem] overflow-hidden",
        "cursor-none",
        "transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
        "h-[600px] min-w-[180px]",
        isHovered ? "flex-[2] shadow-2xl shadow-white/10" : "flex-[0.8] opacity-90"
      )}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {/* Thumbnail Image */}
      <div className={cn("absolute inset-0 transition-opacity duration-700", isHovered ? "opacity-0" : "opacity-100")}>
        <img
          src={project.imageUrl || defaultImage}
          alt={project.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            !isHovered && "grayscale brightness-75"
          )}
        />
      </div>

      {/* Video (if provided) */}
      {project.videoUrl && (
        <div className={cn("absolute inset-0 transition-opacity duration-700", isHovered ? "opacity-100" : "opacity-0")}>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setIsVideoLoaded(true)}
          >
            <source src={project.videoUrl} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Glassmorphic overlay with project info */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-6 sm:p-8",
          "transition-all duration-700",
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "relative backdrop-blur-xl bg-black/20 rounded-2xl p-5 sm:p-6 border border-white/10",
            "shadow-2xl",
            "transition-all duration-700 ease-out",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <div className="space-y-2 text-left">
            <h3 className="text-white font-mono text-sm tracking-[0.3em] uppercase font-medium">
              {project.title}
            </h3>
            <p className="text-white/70 font-mono text-xs tracking-[0.2em] uppercase">
              {project.category}
            </p>

            {/* Description */}
            <p className="text-white/50 text-sm leading-relaxed mt-3 font-light">
              {project.description}
            </p>

            {/* Languages */}
            <div className="flex flex-wrap gap-2 mt-3">
              {project.languages.map((lang, i) => (
                <span
                  key={i}
                  className="text-[10px] tracking-[0.1em] uppercase px-2 py-1 border border-white/10 rounded text-white/40"
                >
                  {lang}
                </span>
              ))}
            </div>

            {/* Highlights */}
            {project.highlights.length > 0 && (
              <ul className="mt-3 space-y-1">
                {project.highlights.map((hl, i) => (
                  <li key={i} className="text-white/40 text-xs flex items-start gap-2">
                    <span className="text-white/20 mt-0.5">↗</span>
                    {hl}
                  </li>
                ))}
              </ul>
            )}

            {/* GitHub link */}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-[10px] tracking-[0.15em] uppercase text-white/40 hover:text-white/80 transition-colors border-b border-transparent hover:border-white/30"
              >
                GitHub ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
