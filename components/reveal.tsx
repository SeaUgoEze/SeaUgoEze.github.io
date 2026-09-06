"use client"

import { useEffect, useRef } from "react"

/**
 * Attaches a scroll-reveal IntersectionObserver to all `.reveal` and
 * `.reveal-fade` descendants of the returned ref. Elements gain
 * `.is-visible` when they enter the viewport.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )

    const elements = root.querySelectorAll(".reveal, .reveal-fade")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return ref
}

/**
 * Normalized scroll progress (0..1) of the whole page.
 */
export function useScrollProgress(): number {
  const ref = useRef(0)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      ref.current = max > 0 ? window.scrollY / max : 0
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return ref.current
}
