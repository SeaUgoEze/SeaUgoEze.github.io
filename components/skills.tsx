"use client"

import { useEffect, useRef } from "react"

interface Skill {
  id: string
  name: string
  category: string
  icon: string
}

interface SkillsProps {
  skills: Skill[]
}

const nodeColors: Record<string, string> = {
  Languages: "#6db366",
  Technologies: "#8fd688",
  Domains: "#7a8ea0",
  Tools: "#9a8060",
  "Soft Skills": "#c0a868",
}

export function Skills({ skills }: SkillsProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let cw = wrap.offsetWidth
    let ch = wrap.offsetHeight
    canvas.width = cw
    canvas.height = ch

    const positions = skills.map((_, i) => {
      const cols = Math.ceil(Math.sqrt(skills.length))
      const row = Math.floor(i / cols)
      const col = i % cols
      return {
        x: (col + 0.5) / cols,
        y: (row + 0.5) / Math.ceil(skills.length / cols),
      }
    })

    let t = 0
    let animating = false

    function drawEdges() {
      cw = wrap.offsetWidth
      ch = wrap.offsetHeight
      canvas.width = cw
      canvas.height = ch
      ctx.clearRect(0, 0, cw, ch)
      t += 0.007

      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const a = positions[i]
          const b = positions[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist > 0.4) continue

          const x1 = a.x * cw
          const y1 = a.y * ch
          const x2 = b.x * cw
          const y2 = b.y * ch
          const pulse = Math.sin(t + (i + j) * 1.4) * 0.5 + 0.5

          const grad = ctx.createLinearGradient(x1, y1, x2, y2)
          grad.addColorStop(0, `rgba(255,255,255,${0.03 + pulse * 0.03})`)
          grad.addColorStop(0.5, `rgba(255,255,255,${0.06 + pulse * 0.04})`)
          grad.addColorStop(1, `rgba(255,255,255,${0.03 + pulse * 0.03})`)

          ctx.beginPath()
          ctx.moveTo(x1, y1)
          const mx = (x1 + x2) / 2 + Math.sin(t + i * j * 0.5) * 15
          const my = (y1 + y2) / 2 + Math.cos(t + (i + j) * 0.7) * 12
          ctx.quadraticCurveTo(mx, my, x2, y2)
          ctx.strokeStyle = grad
          ctx.lineWidth = 1
          ctx.stroke()

          const prog = Math.sin(t * 1.4 + i + j) * 0.5 + 0.5
          const ex = x1 + (x2 - x1) * prog
          const ey = y1 + (y2 - y1) * prog
          ctx.beginPath()
          ctx.arc(ex, ey, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${0.2 + pulse * 0.4})`
          ctx.fill()
        }
      }

      if (animating) requestAnimationFrame(drawEdges)
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animating) {
          animating = true
          drawEdges()
        } else if (!entries[0].isIntersecting) {
          animating = false
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(wrap)

    return () => obs.disconnect()
  }, [skills])

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 sm:py-32 px-6 bg-gradient-to-b from-black via-neutral-950 to-black relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="reveal opacity-0 translate-y-8 transition-all duration-700 mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 font-mono">The Ecosystem</p>
          <h2 className="font-mono text-4xl sm:text-5xl md:text-6xl font-light text-white">
            Skills <span className="text-white/50 italic">&amp; Technologies</span>
          </h2>
        </div>

        <div ref={wrapRef} className="reveal opacity-0 translate-y-8 transition-all duration-700 relative h-[500px] sm:h-[580px]">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {skills.map((skill, i) => {
            const cols = Math.ceil(Math.sqrt(skills.length))
            const row = Math.floor(i / cols)
            const col = i % cols
            const x = ((col + 0.5) / cols) * 100
            const y = ((row + 0.5) / Math.ceil(skills.length / cols)) * 100
            const color = nodeColors[skill.category] || "#888"

            return (
              <div
                key={skill.id}
                className="absolute flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110 hover:-translate-y-1 group"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border transition-shadow duration-300 group-hover:shadow-lg"
                  style={{
                    background: `${color}15`,
                    borderColor: `${color}40`,
                  }}
                >
                  <span className="text-xl sm:text-2xl">{skill.icon}</span>
                </div>
                <span className="text-[10px] tracking-[0.12em] uppercase mt-2 text-white/40 group-hover:text-white/80 transition-colors text-center max-w-[80px]">
                  {skill.name}
                </span>
                <span className="text-[9px] text-white/20 mt-1 text-center max-w-[80px]">
                  {skill.category}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
