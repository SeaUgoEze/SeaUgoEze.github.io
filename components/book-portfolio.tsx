"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { PortfolioSection, PortfolioEntry } from "@/lib/firebase"

interface BookPortfolioProps {
  name: string
  backgroundArt?: string
  sections: PortfolioSection[]
}

type BookView = { kind: "contents" } | { kind: "section"; sectionId: string; entryIndex: number }
type TurnDirection = "next" | "previous" | null

function getEntry(section: PortfolioSection, index: number): PortfolioEntry | undefined {
  return section.entries[index]
}

export function BookPortfolio({ name, backgroundArt, sections }: BookPortfolioProps) {
  const [opened, setOpened] = useState(false)
  const [opening, setOpening] = useState(false)
  const [view, setView] = useState<BookView>({ kind: "contents" })
  const [turnDirection, setTurnDirection] = useState<TurnDirection>(null)
  const [turning, setTurning] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragProgress, setDragProgress] = useState(0)
  const dragStart = useRef<number | null>(null)
  const dragPointerId = useRef<number | null>(null)
  const bookRef = useRef<HTMLDivElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const visibleSections = useMemo(
    () => sections.filter((section) => section.visible !== false),
    [sections],
  )
  const activeSection = view.kind === "section" ? visibleSections.find((section) => section.id === view.sectionId) : undefined
  const activeEntry = activeSection && view.kind === "section" ? getEntry(activeSection, view.entryIndex) : undefined
  const sectionIndex = activeSection ? visibleSections.findIndex((section) => section.id === activeSection.id) : -1

  const finishTurn = useCallback((nextView: BookView, direction: TurnDirection) => {
    setTurnDirection(direction)
    setTurning(true)
    window.setTimeout(() => {
      setView(nextView)
      setTurning(false)
      setTurnDirection(null)
    }, 180)
  }, [])

  const openBook = useCallback(() => {
    if (opened || opening) return
    setOpening(true)
    window.setTimeout(() => {
      setOpened(true)
      setOpening(false)
    }, 420)
  }, [opened, opening])

  const enterSection = useCallback((section: PortfolioSection) => {
    if (!section.entries.length) return
    finishTurn({ kind: "section", sectionId: section.id, entryIndex: -1 }, "next")
  }, [finishTurn])

  const goBack = useCallback(() => {
    if (view.kind === "contents") return
    if (view.entryIndex >= 0) {
      finishTurn({ ...view, entryIndex: -1 }, "previous")
    } else {
      finishTurn({ kind: "contents" }, "previous")
    }
  }, [finishTurn, view.kind])

  const goPrevious = useCallback(() => {
    if (view.kind === "contents" || !activeSection) return
    if (view.entryIndex > 0) {
      finishTurn({ ...view, entryIndex: view.entryIndex - 1 }, "previous")
    } else if (view.entryIndex === 0) {
      finishTurn({ ...view, entryIndex: -1 }, "previous")
    } else {
      finishTurn({ kind: "contents" }, "previous")
    }
  }, [activeSection, finishTurn, view])

  const goNext = useCallback(() => {
    if (view.kind === "contents" || !activeSection) return
    if (view.entryIndex < 0) {
      finishTurn({ ...view, entryIndex: 0 }, "next")
    } else if (view.entryIndex < activeSection.entries.length - 1) {
      finishTurn({ ...view, entryIndex: view.entryIndex + 1 }, "next")
    } else if (sectionIndex < visibleSections.length - 1) {
      const nextSection = visibleSections[sectionIndex + 1]
      finishTurn({ kind: "section", sectionId: nextSection.id, entryIndex: -1 }, "next")
    }
  }, [activeSection, finishTurn, sectionIndex, view, visibleSections])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!opened) return
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        goPrevious()
      }
      if (event.key === "ArrowRight") {
        event.preventDefault()
        if (view.kind === "contents") {
          const first = visibleSections[0]
          if (first) enterSection(first)
        } else {
          goNext()
        }
      }
      if (event.key === "Escape" && view.kind === "section") {
        event.preventDefault()
        goBack()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [enterSection, goBack, goNext, opened, view.kind, visibleSections])

  function onCornerPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (!opened || turning) return
    dragStart.current = event.clientX
    dragPointerId.current = event.pointerId
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onCornerPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragging || dragStart.current === null) return
    const distance = event.clientX - dragStart.current
    const progress = Math.min(1, Math.abs(distance) / 180)
    setDragProgress(progress)
  }

  function onCornerPointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragging || dragStart.current === null) return
    const distance = event.clientX - dragStart.current
    setDragging(false)
    setDragProgress(0)
    dragStart.current = null
    dragPointerId.current = null
    if (Math.abs(distance) > 72) {
      if (distance < 0) {
        if (view.kind === "contents") {
          const first = visibleSections[0]
          if (first) enterSection(first)
        } else {
          goNext()
        }
      } else if (view.kind === "section") {
        goPrevious()
      }
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function onTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const touch = event.changedTouches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  function onTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (!touchStart.current) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - touchStart.current.x
    const dy = touch.clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0) {
      if (view.kind === "contents") {
        const first = visibleSections[0]
        if (first) enterSection(first)
      } else {
        goNext()
      }
    } else if (view.kind === "section") {
      goPrevious()
    }
  }

  const pageStyle = dragging ? { transform: `rotateY(${dragProgress * -14}deg)` } : undefined

  return (
    <main className="book-stage" ref={bookRef}>
      {!opened ? (
        <section className={`cover-scene ${opening ? "is-opening" : ""}`} aria-label="Portfolio cover">
          <p className="cover-name">{name}</p>
          <button
            className={`cover-book ${backgroundArt ? "cover-book-with-art" : ""}`}
            onClick={openBook}
            aria-label="Open Sean Ezeocha's portfolio"
            style={backgroundArt ? { backgroundImage: `linear-gradient(rgba(61,36,25,.48), rgba(36,21,15,.72)), url(${backgroundArt})` } : undefined}
          >
            <span className="cover-spine" />
            <span className="cover-rule" />
            <span className="cover-title">The Work<br />of {name}</span>
            <span className="cover-subtitle">Portfolio · 2026</span>
            <span className="cover-corner cover-corner-top" />
            <span className="cover-corner cover-corner-bottom" />
          </button>
          <button className="open-prompt" onClick={openBook}>
            <span>Tap the book</span>
            <span className="prompt-arrow" aria-hidden="true">→</span>
          </button>
          <p className="cover-hint">Use the page edges to turn through the book</p>
        </section>
      ) : (
        <section className="book-reader" aria-label="Interactive portfolio book" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className={`book-object ${turning ? `is-turning-${turnDirection}` : ""}`}>
            <div className="book-page book-page-left" aria-hidden="true">
              <span className="page-mark">SE</span>
              <span className="page-number">{view.kind === "contents" ? "i" : String(view.entryIndex + 1).padStart(2, "0")}</span>
            </div>
            <div className="book-page book-page-right" style={pageStyle}>
              {view.kind === "contents" ? (
                <div className="contents-page">
                  <p className="page-kicker">A record of making</p>
                  <h1>Contents</h1>
                  <p className="contents-intro">A considered collection of work, study, and questions worth following.</p>
                  <nav className="contents-list" aria-label="Portfolio sections">
                    {visibleSections.map((section, index) => (
                      <button key={section.id} onClick={() => enterSection(section)} className="contents-entry" disabled={!section.entries.length}>
                        <span className="contents-index">{String(index + 1).padStart(2, "0")}</span>
                        <span className="contents-label">{section.title}</span>
                        <span className="contents-count">{section.entries.length ? `${section.entries.length} ${section.entries.length === 1 ? "entry" : "entries"}` : ""}</span>
                      </button>
                    ))}
                  </nav>
                  <p className="contents-instruction">Select a chapter, or turn the page</p>
                </div>
              ) : activeSection && view.entryIndex < 0 ? (
                <article className="chapter-page" aria-live="polite">
                  <button className="back-link" onClick={goBack}>← Contents</button>
                  <p className="page-kicker">Chapter {String(sectionIndex + 1).padStart(2, "0")}</p>
                  <h1>{activeSection.title}</h1>
                  <p className="chapter-intro">{activeSection.intro || "A collection of work, study, and notes."}</p>
                  <button className="chapter-enter" onClick={goNext}>Enter this chapter <span aria-hidden="true">→</span></button>
                </article>
              ) : activeSection && activeEntry ? (
                <article className="entry-page" aria-live="polite">
                  <div className="entry-heading">
                    <button className="back-link" onClick={goBack}>← Chapter</button>
                    <span className="entry-position">{String(view.entryIndex + 1).padStart(2, "0")} / {String(activeSection.entries.length).padStart(2, "0")}</span>
                  </div>
                  <div className="entry-layout">
                    <div className="entry-copy">
                      <p className="page-kicker">{activeSection.title}</p>
                      <h1>{activeEntry.title}</h1>
                      {activeEntry.label && <p className="entry-label">{activeEntry.label}</p>}
                      <div className="entry-body">{activeEntry.body.split("\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
                      {activeEntry.tags.length > 0 && <p className="entry-tags">{activeEntry.tags.join("  ·  ")}</p>}
                      {activeEntry.url && <a className="entry-link" href={activeEntry.url} target="_blank" rel="noreferrer">Read the work ↗</a>}
                    </div>
                    <div className={`entry-image ${activeEntry.imageUrl ? "has-image" : "default-image"}`}>
                      {activeEntry.imageUrl ? <img src={activeEntry.imageUrl} alt="" /> : <span>{activeSection.title.slice(0, 1)}</span>}
                    </div>
                  </div>
                </article>
              ) : null}
              <button className="turn-corner turn-corner-right" onPointerDown={onCornerPointerDown} onPointerMove={onCornerPointerMove} onPointerUp={onCornerPointerUp} onPointerCancel={onCornerPointerUp} aria-label="Turn to the next page">
                <span aria-hidden="true">›</span>
              </button>
              <button className="turn-corner turn-corner-left" onClick={goPrevious} aria-label="Turn to the previous page">
                <span aria-hidden="true">‹</span>
              </button>
            </div>
          </div>
          <div className="reader-controls" aria-label="Book controls">
            <button onClick={goPrevious} disabled={view.kind === "contents" || turning}>Previous</button>
            <span>{view.kind === "contents" ? "Contents" : activeSection?.title}</span>
            <button onClick={view.kind === "contents" ? () => visibleSections[0] && enterSection(visibleSections[0]) : goNext} disabled={turning || (view.kind === "section" && view.entryIndex >= 0 && view.entryIndex === (activeSection?.entries.length ?? 1) - 1 && sectionIndex === visibleSections.length - 1)}>Next</button>
          </div>
          <p className="reader-help">Drag the page corner · swipe · use ← →</p>
        </section>
      )}
    </main>
  )
}
