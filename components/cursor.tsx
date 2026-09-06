"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Gold ring cursor with a trailing dot. Expands over interactive elements
 * and shows a "View" hint over elements marked data-cursor="view".
 * Hidden on touch devices via matchMedia.
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<"default" | "hover" | "view">("default")
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches
    if (!fine) return
    setEnabled(true)

    const move = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      }
      requestAnimationFrame(() => {
        if (dotRef.current) {
          dotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
        }
      })

      const target = e.target as HTMLElement
      if (target.closest('[data-cursor="view"]')) setMode("view")
      else if (target.closest("a, button, [role='button'], input, textarea, select")) setMode("hover")
      else setMode("default")
    }

    window.addEventListener("mousemove", move, { passive: true })
    return () => window.removeEventListener("mousemove", move)
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[100] pointer-events-none rounded-full border transition-[width,height,background-color,border-color] duration-300 ease-out"
        style={{
          width: mode === "view" ? 72 : mode === "hover" ? 48 : 30,
          height: mode === "view" ? 72 : mode === "hover" ? 48 : 30,
          borderColor: mode === "default" ? "rgba(215,152,58,0.55)" : "rgba(215,152,58,0.9)",
          backgroundColor: mode === "view" ? "rgba(10,9,8,0.55)" : "transparent",
          backdropFilter: mode === "view" ? "blur(1px)" : undefined,
        }}
      >
        {mode === "view" && (
          <span className="absolute inset-0 flex items-center justify-center text-[9px] tracking-[0.25em] uppercase text-gold font-serif">
            View
          </span>
        )}
      </div>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[100] pointer-events-none rounded-full"
        style={{
          width: 4,
          height: 4,
          backgroundColor: "rgba(232,180,95,0.9)",
        }}
      />
    </>
  )
}
