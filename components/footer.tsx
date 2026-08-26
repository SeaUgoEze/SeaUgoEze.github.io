"use client"

export function Footer() {
  return (
    <footer className="relative z-10 px-6 py-6 flex justify-between items-center border-t border-white/5">
      <p className="font-mono text-lg italic text-white/30">Still growing.</p>
      <div className="flex items-center gap-5">
        <div className="w-1 h-1 rounded-full bg-white/20" />
        <p className="text-[10px] tracking-[0.15em] uppercase text-white/20 font-mono">
          Sean Ezeocha · 2026
        </p>
      </div>
    </footer>
  )
}
