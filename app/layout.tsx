import type { Metadata } from "next"
import { Cinzel, Cormorant_Garamond } from "next/font/google"
import "./globals.css"

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Sean Ezeocha — Portfolio",
  description:
    "Computer Science student at Queen's University. Building AI systems, software tools, and digital experiences.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable}`}>
      <body className="grain vignette bg-ink text-parchment font-body antialiased cursor-none-fine">
        {children}
      </body>
    </html>
  )
}
