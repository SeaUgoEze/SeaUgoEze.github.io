"use client"

import { useEffect, useRef, useState } from "react"
import { SectionHeading, GoldDivider } from "./ornaments"
import { useReveal } from "./reveal"

interface Skill {
  id: string
  name: string
  category: string
  icon: string
}

/**
 * Skills as a gold constellation on canvas: nodes drift slowly, connect
 * to nearby nodes with faint golden lines, and brighten on hover.
 */
export function Skills({ skills }: { skills: Skill[] }) {
  const ref = useReveal<HTMLElement>()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<{ x: number; y: number; vx: number; vy: number; r: number; label: string }[]>([])
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }
    resize()
    window.addEventListener("resize", resize)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Initialize nodes once
    if (nodesRef.current.length === 0 && skills.length > 0) {
      nodesRef.current = skills.map((s, i) => {
        const angle = (i / skills.length) * Math.PI * 2
        const radius = 0.25 + ((i * 13) % 20) / 100
        return {
          x: 0.5 + Math.cos(angle) * radius,
          y: 0.5 + Math.sin(angle) * radius * 0.9,
          vx: (((i * 7) % 10) - 5) * 0.00022,
          vy: (((i * 11) % 10) - 5) * 0.00022,
          r: 2.6 + ((i * 5) % 3),
          label: s.name,
        }
      })
    }

    let raf: number
    const render = () => {
      const rect = canvas.getBoundingClientRect()
      const W = rect.width
      const H = rect.height
      const dpr = window.devicePixelRatio || 1
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      const nodes = nodesRef.current
      const mouse = mouseRef.current

      // Move
      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0.06 || n.x > 0.94) n.vx *= -1
        if (n.y < 0.08 || n.y > 0.92) n.vy *= -1
      })

      // Connections
      ctx.lineWidth = 0.7
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x - nodes[j].x) * W
          const dy = (nodes[i].y - nodes[j].y) * H
          const dist = Math.hypot(dx, dy)
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.28
            ctx.strokeStyle = `rgba(215,152,58,${alpha})`
            ctx.beginPath()
            ctx.moveTo(nodes[i].x * W, nodes[i].y * H)
            ctx.lineTo(nodes[j].x * W, nodes[j].y * H)
            ctx.stroke()
          }
        }
      }

      // Nodes
      nodes.forEach((n) => {
        const px = n.x * W
        const py = n.y * H
        const isHovered = mouse && Math.hypot(mouse.x - px, mouse.y - py) < 46

        if (isHovered) {
          ctx.beginPath()
          ctx.arc(px, py, n.r + 9, 0, Math.PI * 2)
          ctx.strokeStyle = "rgba(215,152,58,0.5)"
          ctx.lineWidth = 1
          ctx.stroke()
        }

        const grad = ctx.createRadialGradient(px, py, 0, px, py, n.r * 4)
        grad.addColorStop(0, "rgba(232,180,95,0.95)")
        grad.addColorStop(1, "rgba(215,152,58,0)")
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(px, py, n.r * 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#e8b45f"
        ctx.beginPath()
        ctx.arc(px, py, n.r, 0, Math.PI * 2)
        ctx.fill()
      })

      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }

      // Update hovered label
      const mouse = mouseRef.current
      let found: string | null = null
      for (const n of nodesRef.current) {
        if (mouse && Math.hypot(mouse.x - n.x * rect.width, mouse.y - n.y * rect.height) < 46) {
          found = n.label
          break
        }
      }
      setHovered(found)
    }
    const onLeave = () => {
      mouseRef.current = null
      setHovered(null)
    }
    canvas.addEventListener("mousemove", onMove)
    canvas.addEventListener("mouseleave", onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", onMove)
      canvas.removeEventListener("mouseleave", onLeave)
    }
  }, [skills])

  const categories = Array.from(new Set(skills.map((s) => s.category)))

  return (
    <section id="skills" ref={ref} className="relative py-28 sm:py-36 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading numeral="IV · Crafts" title="Skills" />

        <div className="relative reveal h-[440px] sm:h-[500px] border border-gold/10 bg-ink-2/40">
          <canvas ref={canvasRef} className="w-full h-full" data-cursor="view" />

          {/* Hovered label */}
          {hovered && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-none">
              <p className="font-serif text-lg tracking-[0.3em] uppercase text-gold">{hovered}</p>
            </div>
          )}

          {/* Corner marks */}
          <span className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold/40" />
          <span className="absolute top-3 right-3 w-4 h-4 border-t border-r border-gold/40" />
          <span className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-gold/40" />
          <span className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-gold/40" />
        </div>

        {/* Legend by category */}
        <div className="reveal mt-12 space-y-6">
          {categories.map((cat, ci) => (
            <div key={cat} style={{ transitionDelay: `${ci * 100}ms` }}>
              <div className="flex items-center gap-4 mb-3">
                <h3 className="font-serif text-[11px] tracking-[0.4em] uppercase text-gold/70">{cat}</h3>
                <span className="rule-gold flex-1" />
              </div>
              <div className="flex flex-wrap gap-x-7 gap-y-2">
                {skills
                  .filter((s) => s.category === cat)
                  .map((s) => (
                    <span key={s.id} className="font-body text-lg text-parchment/70">
                      {s.name}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <GoldDivider />
        </div>
      </div>
    </section>
  )
}
