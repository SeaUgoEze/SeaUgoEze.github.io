export function GoldDivider({ wide = false }: { wide?: boolean }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${wide ? "w-64" : "w-40"} mx-auto`} aria-hidden>
      <span className="rule-gold flex-1" />
      <svg width="10" height="10" viewBox="0 0 10 10" className="text-gold shrink-0">
        <rect x="2.2" y="2.2" width="5.6" height="5.6" transform="rotate(45 5 5)" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <rect x="3.7" y="3.7" width="2.6" height="2.6" transform="rotate(45 5 5)" fill="currentColor" />
      </svg>
      <span className="rule-gold flex-1" />
    </div>
  )
}

export function SectionHeading({
  numeral,
  title,
  subtitle,
}: {
  numeral: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="text-center mb-14 reveal">
      <p className="text-[11px] tracking-[0.5em] uppercase text-gold/70 font-serif mb-4">{numeral}</p>
      <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-parchment tracking-wide">
        {title}
      </h2>
      {subtitle && (
        <p className="font-body italic text-stone text-lg mt-4">{subtitle}</p>
      )}
      <div className="mt-7">
        <GoldDivider wide />
      </div>
    </div>
  )
}

export function CornerFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`ornament-frame ${className}`}>{children}</div>
  )
}

export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      width="120"
      height="22"
      viewBox="0 0 120 22"
      fill="none"
      className={`text-gold/60 ${className}`}
      aria-hidden
    >
      <path d="M0 11 H44" stroke="currentColor" strokeWidth="0.75" />
      <path d="M76 11 H120" stroke="currentColor" strokeWidth="0.75" />
      <path d="M60 2 L69 11 L60 20 L51 11 Z" stroke="currentColor" strokeWidth="0.9" fill="none" />
      <path d="M60 6.5 L64.5 11 L60 15.5 L55.5 11 Z" fill="currentColor" />
      <circle cx="47" cy="11" r="1.4" fill="currentColor" />
      <circle cx="73" cy="11" r="1.4" fill="currentColor" />
    </svg>
  )
}
