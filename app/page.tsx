"use client"

import { useEffect, useState } from "react"
import { BookPortfolio } from "@/components/book-portfolio"
import { fetchPortfolioData, type PortfolioData } from "@/lib/firebase"

export default function Page() {
  const [data, setData] = useState<PortfolioData | null>(null)

  useEffect(() => {
    fetchPortfolioData().then(setData).catch(() => setData(null))
  }, [])

  if (!data) {
    return <div className="book-loading">Opening the portfolio…</div>
  }

  return <BookPortfolio name={data.hero.name} backgroundArt={data.hero.backgroundArt} sections={data.sections} />
}
