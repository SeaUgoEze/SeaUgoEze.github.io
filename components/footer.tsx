import { Ornament } from "./ornaments"

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-gold/10">
      <div className="max-w-4xl mx-auto text-center">
        <Ornament className="mx-auto opacity-60" />
        <p className="font-serif text-[10px] tracking-[0.4em] uppercase text-stone/60 mt-6">
          Sean Ezeocha · MMXXVI
        </p>
      </div>
    </footer>
  )
}
