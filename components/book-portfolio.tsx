"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { PortfolioSection, PortfolioEntry } from "@/lib/firebase"

interface BookPortfolioProps {
  name: string
  backgroundArt?: string
  sections: PortfolioSection[]
}

type BookView = { kind: "contents" } | { kind: "section"; sectionId: string; entryIndex: number }
type TurnDirection = "next" | "previous"
type TurnPhase = "out" | "in" | null

type WatchlistRatings = Record<string, number>
const WATCHLIST_RATINGS_KEY = "sean-portfolio-watchlist-ratings"

function getEntry(section: PortfolioSection, index: number): PortfolioEntry | undefined {
  return section.entries[index]
}

function isSinglePageSection(section: PortfolioSection) {
  return section.id === "skills" || section.id === "watchlist" || section.id === "resume"
}

function findSectionWithEntries(sections: PortfolioSection[], start: number, step: 1 | -1) {
  for (let index = start; index >= 0 && index < sections.length; index += step) {
    if (sections[index].entries.length > 0) return sections[index]
  }
  return undefined
}

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function BookPortfolio({ name, backgroundArt, sections }: BookPortfolioProps) {
  const [opened, setOpened] = useState(false)
  const [opening, setOpening] = useState(false)
  const [view, setView] = useState<BookView>({ kind: "contents" })
  const [turnDirection, setTurnDirection] = useState<TurnDirection | null>(null)
  const [turnPhase, setTurnPhase] = useState<TurnPhase>(null)
  const [dragging, setDragging] = useState(false)
  const [dragProgress, setDragProgress] = useState(0)
  const [watchlistRatings, setWatchlistRatings] = useState<WatchlistRatings>({})
  const dragStart = useRef<number | null>(null)
  const turningRef = useRef(false)
  const timers = useRef<number[]>([])
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const suppressClick = useRef(false)

  const visibleSections = useMemo(
    () => sections
      .filter((section) => section.visible !== false)
      .sort((a, b) => a.order - b.order),
    [sections],
  )
  const activeSection = view.kind === "section" ? visibleSections.find((section) => section.id === view.sectionId) : undefined
  const activeEntry = activeSection && view.kind === "section" ? getEntry(activeSection, view.entryIndex) : undefined
  const sectionIndex = activeSection ? visibleSections.findIndex((section) => section.id === activeSection.id) : -1
  const sceneArt = backgroundArt || "/art/reading-room.png"

  useEffect(() => {
    try {
      const savedRatings = window.localStorage.getItem(WATCHLIST_RATINGS_KEY)
      if (savedRatings) setWatchlistRatings(JSON.parse(savedRatings) as WatchlistRatings)
    } catch {
      // Ratings are a local enhancement; the book still works if storage is unavailable.
    }
  }, [])

  const rateWatchlistEntry = useCallback((entryId: string, rating: number) => {
    const nextRatings = { ...watchlistRatings, [entryId]: rating }
    setWatchlistRatings(nextRatings)
    try {
      window.localStorage.setItem(WATCHLIST_RATINGS_KEY, JSON.stringify(nextRatings))
    } catch {
      // Keep the in-memory rating when browser storage is unavailable.
    }
  }, [watchlistRatings])

  const finishTurn = useCallback((nextView: BookView, direction: TurnDirection) => {
    if (turningRef.current) return
    turningRef.current = true
    setTurnDirection(direction)
    setTurnPhase("out")
    if (reducedMotion()) {
      setView(nextView)
      setTurnDirection(null)
      setTurnPhase(null)
      turningRef.current = false
      return
    }
    const midpoint = window.setTimeout(() => {
      setView(nextView)
      setTurnPhase("in")
    }, 250)
    const complete = window.setTimeout(() => {
      setTurnDirection(null)
      setTurnPhase(null)
      turningRef.current = false
    }, 500)
    timers.current.push(midpoint, complete)
  }, [])

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), [])

  const openBook = useCallback(() => {
    if (opened || opening) return
    if (reducedMotion()) {
      setOpened(true)
      return
    }
    setOpening(true)
    const timer = window.setTimeout(() => {
      setOpened(true)
      const settleTimer = window.setTimeout(() => setOpening(false), 460)
      timers.current.push(settleTimer)
    }, 420)
    timers.current.push(timer)
  }, [opened, opening])

  const enterSection = useCallback((section: PortfolioSection) => {
    if (turningRef.current) return
    const requestedIndex = visibleSections.findIndex((item) => item.id === section.id)
    const target = findSectionWithEntries(visibleSections, requestedIndex, 1)
    if (!target) return
    finishTurn({ kind: "section", sectionId: target.id, entryIndex: 0 }, "next")
  }, [finishTurn, visibleSections])

  const goBack = useCallback(() => {
    if (view.kind === "contents" || turningRef.current) return
    finishTurn({ kind: "contents" }, "previous")
  }, [finishTurn, view.kind])

  const goPrevious = useCallback(() => {
    if (view.kind === "contents" || !activeSection || turningRef.current) return
    if (view.entryIndex > 0 && !isSinglePageSection(activeSection)) {
      finishTurn({ ...view, entryIndex: view.entryIndex - 1 }, "previous")
      return
    }
    if (view.entryIndex >= 0) {
      finishTurn({ ...view, entryIndex: -1 }, "previous")
      return
    }
    const previousSection = findSectionWithEntries(visibleSections, sectionIndex - 1, -1)
    if (previousSection) {
      finishTurn({ kind: "section", sectionId: previousSection.id, entryIndex: previousSection.entries.length - 1 }, "previous")
    } else {
      finishTurn({ kind: "contents" }, "previous")
    }
  }, [activeSection, finishTurn, sectionIndex, view, visibleSections])

  const goNext = useCallback(() => {
    if (view.kind === "contents" || !activeSection || turningRef.current) return
    if (view.entryIndex < 0) {
      finishTurn({ ...view, entryIndex: 0 }, "next")
      return
    }
    if (!isSinglePageSection(activeSection) && view.entryIndex < activeSection.entries.length - 1) {
      finishTurn({ ...view, entryIndex: view.entryIndex + 1 }, "next")
      return
    }
    const nextSection = findSectionWithEntries(visibleSections, sectionIndex + 1, 1)
    if (nextSection) finishTurn({ kind: "section", sectionId: nextSection.id, entryIndex: -1 }, "next")
  }, [activeSection, finishTurn, sectionIndex, view, visibleSections])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!opened) return
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        goPrevious()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        if (view.kind === "contents") {
          const first = visibleSections[0]
          if (first) enterSection(first)
        } else goNext()
      } else if (event.key === "Escape" && view.kind === "section") {
        event.preventDefault()
        goBack()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [enterSection, goBack, goNext, opened, view.kind, visibleSections])

  function onCornerPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (!opened || turningRef.current) return
    dragStart.current = event.clientX
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onCornerPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragging || dragStart.current === null) return
    const distance = event.clientX - dragStart.current
    setDragProgress(Math.min(1, Math.abs(distance) / 180))
  }

  function onCornerPointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragging || dragStart.current === null) return
    const distance = event.clientX - dragStart.current
    setDragging(false)
    setDragProgress(0)
    dragStart.current = null
    if (Math.abs(distance) > 72) {
      if (distance < 0) {
        if (view.kind === "contents") {
          const first = visibleSections[0]
          if (first) enterSection(first)
        } else goNext()
      } else if (view.kind === "section") goPrevious()
    } else if (view.kind === "contents") {
      const first = visibleSections[0]
      if (first) enterSection(first)
    } else goNext()
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function onPageClick(event: React.MouseEvent<HTMLDivElement>) {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    const target = event.target as HTMLElement
    if (target.closest("button, a, input, textarea, select, label")) return
    goNext()
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
    suppressClick.current = true
    window.setTimeout(() => { suppressClick.current = false }, 400)
    if (dx < 0) {
      if (view.kind === "contents") {
        const first = visibleSections[0]
        if (first) enterSection(first)
      } else goNext()
    } else if (view.kind === "section") goPrevious()
  }

  const pageStyle = dragging ? { transform: `rotateY(${dragProgress * -16}deg)` } : undefined
  const turnClass = turnPhase ? `is-turning-${turnDirection} is-turning-${turnPhase}` : ""

  return (
    <main className="book-stage" style={{ "--room-art": `url("${sceneArt}")` } as React.CSSProperties}>
      {!opened ? (
        <section className={`cover-scene ${opening ? "is-opening" : ""}`} aria-label="Portfolio cover">
          <p className="cover-name">{name}</p>
          <div className="cover-pedestal" aria-hidden="true">
            <span className="pedestal-top" />
            <span className="pedestal-front" />
            <span className="pedestal-side" />
            <button
              className={`cover-book ${backgroundArt ? "cover-book-with-art" : ""}`}
              onClick={openBook}
              aria-label={`Open ${name}'s portfolio`}
              style={backgroundArt ? { backgroundImage: `linear-gradient(rgba(61,36,25,.48), rgba(36,21,15,.72)), url(${backgroundArt})` } : undefined}
            >
              <span className="cover-spine" />
              <span className="cover-rule" />
              <span className="cover-title">The Work<br />of {name}</span>
              <span className="cover-subtitle">Portfolio · 2026</span>
              <span className="cover-corner cover-corner-top" />
              <span className="cover-corner cover-corner-bottom" />
            </button>
          </div>
          <button className="open-prompt" onClick={openBook}>
            <span>Tap the book</span>
            <span className="prompt-arrow" aria-hidden="true">→</span>
          </button>
          <p className="cover-hint">Use the page edges to turn through the book</p>
        </section>
      ) : (
        <section className={`book-reader ${opening ? "is-entering" : ""}`} aria-label="Interactive portfolio book" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="reader-pedestal" aria-hidden="true"><span /><span /><span /></div>
          <div className={`book-object ${turnClass}`}>
            <div className="book-page book-page-left">
              {view.kind === "contents" ? (
                <div className="bookplate">
                  <span className="bookplate-initials">SE</span>
                  <span className="bookplate-rule" />
                  <span className="bookplate-name">{name}</span>
                  <span className="bookplate-note">A working archive</span>
                </div>
              ) : activeSection && activeEntry ? (
                <div className="spread-art has-image">
                  {activeEntry.imageUrl ? <img src={activeEntry.imageUrl} alt={`${activeEntry.title} image`} /> : <div className="default-image"><span>{activeSection.title}</span></div>}
                  <span className="spread-art-caption">{activeEntry.label || activeSection.title}</span>
                </div>
              ) : activeSection ? (
                <div className="chapter-art">
                  <span className="chapter-art-number">{String(sectionIndex + 1).padStart(2, "0")}</span>
                  <span className="chapter-art-title">{activeSection.title}</span>
                </div>
              ) : null}
              <span className="page-number page-number-left">{view.kind === "contents" ? "i" : String(Math.max(view.entryIndex + 1, 0)).padStart(2, "0")}</span>
            </div>
            <div className="book-page book-page-right" style={pageStyle} onClick={onPageClick}>
              {view.kind === "contents" ? (
                <div className="contents-page">
                  <p className="page-kicker">A record of making</p>
                  <h1>Contents</h1>
                  <nav className="contents-list" aria-label="Portfolio sections">
                    {visibleSections.map((section, index) => (
                      <button key={section.id} onClick={() => enterSection(section)} className="contents-entry">
                        <span className="contents-index">{String(index + 1).padStart(2, "0")}</span>
                        <span className="contents-label">{section.title}</span>
                        <span className="contents-count">{section.entries.length ? `${section.entries.length} ${section.entries.length === 1 ? "entry" : "entries"}` : "Empty"}</span>
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
                  {activeSection.intro && <p className="chapter-intro">{activeSection.intro}</p>}
                  <button className="chapter-enter" onClick={goNext}>Open chapter <span aria-hidden="true">→</span></button>
                </article>
              ) : activeSection && activeEntry ? (
                <article className={`entry-page ${activeSection.id === "skills" ? "skills-page" : ""} ${activeSection.id === "watchlist" ? "watchlist-page" : ""}`} aria-live="polite">
                  <div className="entry-heading">
                    <button className="back-link" onClick={goBack}>← Contents</button>
                    <span className="entry-position">{String(view.entryIndex + 1).padStart(2, "0")} / {String(activeSection.entries.length).padStart(2, "0")}</span>
                  </div>
                  {activeSection.id === "skills" ? (
                    <div className="skills-entry-view">
                      <p className="page-kicker">Skills</p>
                      <h1>Languages &amp; tools</h1>
                      <ul className="skills-list">
                        {activeSection.entries.map((entry) => <li key={entry.id}><span>{entry.title}</span></li>)}
                      </ul>
                    </div>
                  ) : activeSection.id === "watchlist" ? (
                    <div className="entry-copy watchlist-entry-view">
                      <p className="page-kicker">Watchlist</p>
                      <h1>Films &amp; series</h1>
                      {activeSection.intro && <p className="watchlist-intro">{activeSection.intro}</p>}
                      <ul className="watchlist-list">
                        {activeSection.entries.map((entry) => {
                          const rating = watchlistRatings[entry.id] ?? entry.rating ?? 0
                          return (
                            <li key={entry.id} className="watchlist-item">
                              <div className="watchlist-item-copy">
                                <h2>{entry.title}</h2>
                                <p>{entry.mediaType === "show" ? "TV show" : "Movie"}{entry.label ? ` · ${entry.label.replace(/^(Movie|TV show) · /, "")}` : ""}</p>
                              </div>
                              <div className="watchlist-item-rating" aria-label={`Your rating for ${entry.title}`}>
                                <span className="watchlist-rating-label">Rating</span>
                                <div className="rating-stars">
                                  {[1, 2, 3, 4, 5].map((star) => <button key={star} className={`rating-star ${star <= rating ? "is-rated" : ""}`} onClick={() => rateWatchlistEntry(entry.id, star)} aria-label={`Rate ${star} out of 5`} aria-pressed={star <= rating}>★</button>)}
                                </div>
                                <span className="rating-value">{rating || "—"}<span aria-hidden="true">{rating ? " / 5" : ""}</span></span>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ) : activeSection.id === "resume" ? (
                    <div className="entry-copy resume-entry-view">
                      <p className="page-kicker">Resume</p>
                      <h1>Curriculum vitae</h1>
                      {activeSection.intro && <p className="resume-intro">{activeSection.intro}</p>}
                      {activeEntry.url ? (
                        <div className="resume-actions">
                          <a className="resume-button" href={activeEntry.url} target="_blank" rel="noreferrer">View resume ↗</a>
                          <a className="resume-download" href={activeEntry.url} download>Download PDF</a>
                        </div>
                      ) : (
                        <p className="resume-empty">A resume PDF has not been uploaded yet.</p>
                      )}
                      {activeEntry.label && <p className="entry-label">{activeEntry.label}</p>}
                    </div>
                  ) : (
                    <div className="entry-copy">
                      <p className="page-kicker">{activeSection.title}</p>
                      <h1>{activeEntry.title}</h1>
                      {activeEntry.label && <p className="entry-label">{activeEntry.label}</p>}
                      {activeEntry.body && <div className="entry-body">{activeEntry.body.split("\n").filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>}
                      {activeEntry.tags.length > 0 && <p className="entry-tags">{activeEntry.tags.join("  ·  ")}</p>}
                      {activeEntry.url && <a className="entry-link" href={activeEntry.url} target="_blank" rel="noreferrer">Read the work ↗</a>}
                    </div>
                  )}
                </article>
              ) : null}
              <button className="turn-corner turn-corner-right" onPointerDown={onCornerPointerDown} onPointerMove={onCornerPointerMove} onPointerUp={onCornerPointerUp} onPointerCancel={onCornerPointerUp} aria-label="Turn to the next page"><span aria-hidden="true">›</span></button>
              <button className="turn-corner turn-corner-left" onClick={goPrevious} aria-label="Turn to the previous page"><span aria-hidden="true">‹</span></button>
            </div>
          </div>
          <div className="reader-controls" aria-label="Book controls">
            <button onClick={goPrevious} disabled={view.kind === "contents" || Boolean(turnPhase)}>Previous</button>
            <span>{view.kind === "contents" ? "Contents" : activeSection?.title}</span>
            <button onClick={view.kind === "contents" ? () => findSectionWithEntries(visibleSections, 0, 1) && enterSection(findSectionWithEntries(visibleSections, 0, 1)!) : goNext} disabled={Boolean(turnPhase) || (view.kind === "section" && !activeSection?.entries.length) || (view.kind === "section" && !findSectionWithEntries(visibleSections, sectionIndex + 1, 1) && view.entryIndex >= 0 && (isSinglePageSection(activeSection!) || view.entryIndex === (activeSection?.entries.length ?? 1) - 1))}>Next</button>
          </div>
          <p className="reader-help">Drag the page corner · swipe · use ← →</p>
        </section>
      )}
    </main>
  )
}
