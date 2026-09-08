import type { Metadata } from "next"
import { Cormorant_Garamond, IM_Fell_English_SC } from "next/font/google"
import "./globals.css"

const display = IM_Fell_English_SC({ subsets: ["latin"], variable: "--font-display", weight: "400" })
const body = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600"], style: ["normal", "italic"] })

export const metadata: Metadata = {
  title: "Sean Ezeocha — Portfolio",
  description: "A portfolio of Sean Ezeocha's work, study, and research.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {/* THESIS: A portfolio that behaves like a book; it refuses the standard scrolling card wall.
            OWN-WORLD: Walnut, parchment, moss, oxblood, and aged brass form a printed reading object.
            STORY: Visitors open the cover, choose a chapter, and turn through Sean's work one page at a time.
            FIRST VIEWPORT: Name at top-left, book centered, brown "Tap the book" tab at lower-right.
            FORM: Interactive book with literal corner gesture, keyboard, button, and swipe fallbacks.
            FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md */}
        {children}
      </body>
    </html>
  )
}
