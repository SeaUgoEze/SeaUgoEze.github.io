"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { SectionHeading, GoldDivider } from "./ornaments"

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
  location?: { x: number; y: number; region: string }
}

interface ProjectsMapProps {
  projects: Project[]
}

/* Stylized Westeros — dark parchment cartography. viewBox 1000 x 1400. */
const LANDMASSED =
  "M 420 60 C 500 40, 620 50, 700 90 C 740 120, 730 170, 700 200 C 680 260, 720 300, 700 340 C 690 420, 640 460, 660 520 C 670 580, 620 600, 610 650 C 640 700, 660 740, 640 790 C 620 850, 640 900, 600 940 C 560 990, 480 990, 440 1020 C 400 1060, 420 1120, 380 1150 C 340 1180, 300 1140, 290 1090 C 270 1040, 290 980, 270 930 C 250 880, 280 840, 260 800 C 240 750, 260 700, 240 660 C 220 620, 250 570, 230 530 C 210 480, 250 440, 240 390 C 230 330, 280 300, 300 250 C 320 180, 360 100, 420 60 Z"

const RIVERS = [
  "M 600 150 C 590 220, 610 280, 595 340 C 585 390, 600 430, 592 470",
  "M 470 470 C 500 510, 540 520, 560 540 C 585 560, 600 580, 612 600",
  "M 430 520 C 450 550, 470 565, 480 590 C 490 615, 480 640, 490 660",
  "M 300 700 C 320 740, 350 760, 370 800 C 385 830, 380 860, 390 890",
]

const REALMS: { label: string; x: number; y: number; size?: number }[] = [
  { label: "The North", x: 490, y: 260, size: 30 },
  { label: "The Neck", x: 470, y: 450, size: 15 },
  { label: "The Vale", x: 625, y: 555, size: 15 },
  { label: "Riverlands", x: 465, y: 610, size: 15 },
  { label: "Westerlands", x: 305, y: 655, size: 14 },
  { label: "The Reach", x: 395, y: 815, size: 20 },
  { label: "Stormlands", x: 595, y: 775, size: 14 },
  { label: "Dorne", x: 445, y: 1085, size: 22 },
]

const LANDMARKS: { x: number; y: number }[] = [
  { x: 480, y: 250 },
  { x: 610, y: 650 },
  { x: 270, y: 630 },
  { x: 640, y: 780 },
  { x: 470, y: 1100 },
  { x: 330, y: 860 },
  { x: 660, y: 540 },
  { x: 350, y: 390 },
]

const DEFAULT_LOCATIONS = [
  { x: 480, y: 250, region: "The North" },
  { x: 610, y: 645, region: "The Crownlands" },
  { x: 340, y: 840, region: "The Reach" },
  { x: 300, y: 650, region: "The Westerlands" },
  { x: 600, y: 780, region: "The Stormlands" },
  { x: 460, y: 1080, region: "Dorne" },
]

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

function roman(i: number) {
  return ROMAN[i] ?? String(i + 1)
}

function MapSvg({
  projects,
  selectedId,
  onSelect,
}: {
  projects: Project[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <svg
      viewBox="0 0 1000 1400"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Map of works"
    >
      <defs>
        <radialGradient id="land" cx="45%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#1a150c" />
          <stop offset="55%" stopColor="#141008" />
          <stop offset="100%" stopColor="#0d0b06" />
        </radialGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(215,152,58,0.28)" />
          <stop offset="100%" stopColor="rgba(215,152,58,0)" />
        </radialGradient>
      </defs>

      {/* Water */}
      <rect x="0" y="0" width="1000" height="1400" fill="#0a0908" />

      {/* Faint graticule */}
      <g stroke="rgba(215,152,58,0.05)" strokeWidth="1">
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 120} x2="1000" y2={i * 120} />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 120} y1="0" x2={i * 120} y2="1400" />
        ))}
      </g>

      {/* Landmass */}
      <path d={LANDMASSED} fill="url(#land)" stroke="rgba(215,152,58,0.4)" strokeWidth="2" />

      {/* Coastal inner glow */}
      <path d={LANDMASSED} fill="none" stroke="rgba(215,152,58,0.12)" strokeWidth="10" opacity="0.5" />

      {/* Rivers */}
      <g fill="none" stroke="rgba(120,140,160,0.35)" strokeWidth="2.5" strokeLinecap="round">
        {RIVERS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* Mountains — small chevrons */}
      <g stroke="rgba(215,152,58,0.22)" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M 380 320 l 10 -12 l 10 12 M 405 335 l 9 -11 l 9 11 M 355 350 l 9 -11 l 9 11" />
        <path d="M 300 590 l 10 -12 l 10 12 M 325 605 l 9 -11 l 9 11" />
        <path d="M 520 760 l 10 -12 l 10 12 M 545 775 l 9 -11 l 9 11 M 500 790 l 8 -10 l 8 10" />
        <path d="M 420 1010 l 10 -12 l 10 12 M 445 1025 l 9 -11 l 9 11" />
        <path d="M 560 470 l 9 -11 l 9 11 M 585 455 l 8 -10 l 8 10" />
      </g>

      {/* Forests — tiny strokes */}
      <g stroke="rgba(90,110,80,0.4)" strokeWidth="1.4" strokeLinecap="round">
        <path d="M 440 200 l 0 -10 M 452 205 l 0 -9 M 464 200 l 0 -10 M 476 206 l 0 -9 M 448 218 l 0 -9 M 460 222 l 0 -9" />
        <path d="M 540 340 l 0 -9 M 552 345 l 0 -9 M 528 350 l 0 -8 M 564 338 l 0 -9" />
        <path d="M 380 890 l 0 -9 M 392 895 l 0 -8 M 368 898 l 0 -8" />
      </g>

      {/* Landmark diamonds (flavor) */}
      <g>
        {LANDMARKS.map((p, i) => (
          <rect
            key={i}
            x={p.x - 5}
            y={p.y - 5}
            width="10"
            height="10"
            transform={`rotate(45 ${p.x} ${p.y})`}
            fill="#0a0908"
            stroke="rgba(215,152,58,0.5)"
            strokeWidth="1.4"
          />
        ))}
      </g>

      {/* Realm labels */}
      <g
        fill="rgba(233,221,200,0.4)"
        fontFamily="var(--font-cinzel), serif"
        textAnchor="middle"
        letterSpacing="6"
      >
        {REALMS.map((r, i) => (
          <text key={i} x={r.x} y={r.y} fontSize={r.size}>
            {r.label.toUpperCase()}
          </text>
        ))}
      </g>

      {/* Project markers */}
      {projects.map((p, idx) => {
        const loc = p.location ?? DEFAULT_LOCATIONS[idx % DEFAULT_LOCATIONS.length]
        const selected = selectedId === p.id
        return (
          <g
            key={p.id}
            className="map-marker"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(p.id)
            }}
            data-cursor="view"
          >
            {/* Hit area */}
            <circle cx={loc.x} cy={loc.y} r="34" fill="transparent" />

            {/* Ambient glow */}
            <circle cx={loc.x} cy={loc.y} r="60" fill="url(#glow)" opacity={selected ? 1 : 0.5} />

            {/* Pulse ring */}
            <circle cx={loc.x} cy={loc.y} r="16" fill="none" stroke="rgba(215,152,58,0.6)" strokeWidth="1.2">
              <animate attributeName="r" values="14;34" dur="2.6s" repeatCount="indefinite" begin={`${idx * 0.7}s`} />
              <animate attributeName="opacity" values="0.7;0" dur="2.6s" repeatCount="indefinite" begin={`${idx * 0.7}s`} />
            </circle>

            {/* Diamond */}
            <rect
              x={loc.x - 11}
              y={loc.y - 11}
              width="22"
              height="22"
              transform={`rotate(45 ${loc.x} ${loc.y})`}
              fill={selected ? "#d7983a" : "#141008"}
              stroke="#d7983a"
              strokeWidth="2"
            />
            <rect
              x={loc.x - 4}
              y={loc.y - 4}
              width="8"
              height="8"
              transform={`rotate(45 ${loc.x} ${loc.y})`}
              fill={selected ? "#0a0908" : "#d7983a"}
            />

            {/* Label */}
            <text
              x={loc.x}
              y={loc.y + 40}
              textAnchor="middle"
              fontSize="17"
              letterSpacing="3"
              fontFamily="var(--font-cinzel), serif"
              fill={selected ? "#e8b45f" : "rgba(233,221,200,0.75)"}
            >
              {p.title}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function CompassRose() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="text-gold/70" aria-hidden>
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <path d="M32 6 L36 28 L32 24 L28 28 Z" fill="currentColor" />
      <path d="M32 58 L28 36 L32 40 L36 36 Z" fill="currentColor" opacity="0.5" />
      <path d="M6 32 L28 28 L24 32 L28 36 Z" fill="currentColor" opacity="0.5" />
      <path d="M58 32 L36 36 L40 32 L36 28 Z" fill="currentColor" opacity="0.5" />
      <text x="32" y="14" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="serif">
        N
      </text>
    </svg>
  )
}

export function ProjectsMap({ projects }: ProjectsMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)
  const [hintVisible, setHintVisible] = useState(true)

  const viewportRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<{ startX: number; startY: number; baseTx: number; baseTy: number } | null>(null)

  const clampTransform = useCallback((s: number, x: number, y: number) => {
    const el = viewportRef.current
    if (!el) return { x, y }
    const w = el.clientWidth
    const h = el.clientHeight
    const maxX = ((s - 1) * w) / 2
    const maxY = ((s - 1) * h) / 2
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    }
  }, [])

  const zoomAt = useCallback(
    (factor: number, cx?: number, cy?: number) => {
      setScale((prevScale) => {
        const next = Math.min(3.5, Math.max(1, prevScale * factor))
        if (next === prevScale) return prevScale

        const el = viewportRef.current
        if (!el) {
          if (next === 1) {
            setTx(0)
            setTy(0)
          }
          return next
        }

        const rect = el.getBoundingClientRect()
        const px = cx ?? rect.left + rect.width / 2
        const py = cy ?? rect.top + rect.height / 2
        const localX = px - rect.left - rect.width / 2
        const localY = py - rect.top - rect.height / 2

        setTx((prevTx) => {
          const raw = localX - (localX - prevTx) * (next / prevScale)
          return clampTransform(next, raw, ty).x
        })
        setTy((prevTy) => {
          const raw = localY - (localY - prevTy) * (next / prevScale)
          return clampTransform(next, tx, raw).y
        })

        if (next === 1) {
          setTx(0)
          setTy(0)
        }
        return next
      })
    },
    [clampTransform, tx, ty]
  )

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY)
      setHintVisible(false)
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [zoomAt])

  const onPointerDown = (e: React.PointerEvent) => {
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    dragState.current = { startX: e.clientX, startY: e.clientY, baseTx: tx, baseTy: ty }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current || scale === 1) return
    const dx = e.clientX - dragState.current.startX
    const dy = e.clientY - dragState.current.startY
    const next = clampTransform(scale, dragState.current.baseTx + dx, dragState.current.baseTy + dy)
    setTx(next.x)
    setTy(next.y)
  }

  const onPointerUp = () => {
    dragState.current = null
  }

  const selectedIndex = projects.findIndex((p) => p.id === selectedId)
  const selected = selectedIndex >= 0 ? projects[selectedIndex] : null
  const selectedLoc = selected
    ? selected.location ?? DEFAULT_LOCATIONS[selectedIndex % DEFAULT_LOCATIONS.length]
    : null

  const step = (dir: 1 | -1) => {
    if (projects.length === 0) return
    const nextIndex = (selectedIndex + dir + projects.length) % projects.length
    setSelectedId(projects[nextIndex].id)
  }

  return (
    <section id="projects" className="relative py-28 sm:py-36">
      <div className="px-6">
        <SectionHeading
          numeral="II · The Realm"
          title="Works of the Realm"
          subtitle="Drag to explore the map. Mark a sigil to read its chronicle."
        />
      </div>

      <div
        ref={viewportRef}
        className="map-viewport relative mx-auto w-full max-w-6xl h-[70vh] min-h-[520px] overflow-hidden border border-gold/15"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClick={() => setSelectedId(null)}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            transformOrigin: "center center",
            transition: dragState.current ? "none" : "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <MapSvg projects={projects} selectedId={selectedId} onSelect={(id) => setSelectedId(id)} />
        </div>

        {/* Compass */}
        <div className="absolute top-5 right-5 pointer-events-none">
          <CompassRose />
        </div>

        {/* Zoom controls */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              zoomAt(1.3)
              setHintVisible(false)
            }}
            className="w-9 h-9 border border-gold/30 bg-ink/80 text-gold font-serif text-lg hover:bg-gold hover:text-ink transition-colors"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              zoomAt(1 / 1.3)
              setHintVisible(false)
            }}
            className="w-9 h-9 border border-gold/30 bg-ink/80 text-gold font-serif text-lg hover:bg-gold hover:text-ink transition-colors"
            aria-label="Zoom out"
          >
            −
          </button>
        </div>

        {/* Bottom bar: hint + prev/next */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-4 bg-gradient-to-t from-ink via-ink/80 to-transparent pointer-events-none">
          <p className={`font-serif text-[10px] tracking-[0.35em] uppercase text-stone/70 transition-opacity duration-700 ${hintVisible ? "opacity-100" : "opacity-0"}`}>
            Drag to travel · Scroll to behold closer
          </p>

          <div className="flex items-center gap-4 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation()
                step(-1)
              }}
              className="w-10 h-10 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-ink transition-colors font-serif"
              aria-label="Previous project"
            >
              ‹
            </button>
            <span className="font-serif text-sm text-stone tracking-[0.2em] min-w-[64px] text-center">
              {selected ? `${roman(selectedIndex)} / ${roman(projects.length - 1)}` : "— / —"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                step(1)
              }}
              className="w-10 h-10 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-ink transition-colors font-serif"
              aria-label="Next project"
            >
              ›
            </button>
          </div>
        </div>

        {/* Detail panel */}
        {selected && selectedLoc && (
          <aside
            className="absolute z-20 right-0 top-0 bottom-0 w-full sm:w-[440px] bg-ink/95 backdrop-blur-md border-l border-gold/25 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "wipe-in 0.6s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            {selected.imageUrl && (
              <div className="relative h-52 overflow-hidden">
                <img src={selected.imageUrl} alt={selected.title} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
              </div>
            )}

            <div className="p-8 sm:p-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-serif text-[11px] tracking-[0.4em] uppercase text-gold mb-3">
                    {selectedLoc.region}
                  </p>
                  <h3 className="font-serif text-3xl text-parchment tracking-wide">{selected.title}</h3>
                  <p className="font-body italic text-stone mt-1">{selected.category}</p>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="text-stone hover:text-gold transition-colors text-xl leading-none p-1"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="my-6">
                <GoldDivider />
              </div>

              <p className="font-body text-lg leading-relaxed text-parchment/75">{selected.description}</p>

              {selected.languages.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {selected.languages.map((lang, i) => (
                    <span
                      key={i}
                      className="font-serif text-[10px] tracking-[0.25em] uppercase border border-gold/25 text-gold/80 px-3 py-1.5"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              )}

              {selected.highlights.length > 0 && (
                <ul className="mt-8 space-y-3">
                  {selected.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 font-body text-parchment/70 text-base">
                      <svg width="9" height="9" viewBox="0 0 10 10" className="mt-2 shrink-0 text-gold">
                        <rect x="2.2" y="2.2" width="5.6" height="5.6" transform="rotate(45 5 5)" fill="currentColor" />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {selected.githubUrl && (
                <a
                  href={selected.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 inline-block px-7 py-3 border border-gold/50 text-gold font-serif text-[11px] tracking-[0.3em] uppercase hover:bg-gold hover:text-ink transition-all duration-500"
                >
                  Inspect the Work
                </a>
              )}
            </div>
          </aside>
        )}
      </div>
    </section>
  )
}
