import Hero from "@/sections/Hero"
import Commitment from "@/sections/Commitment"
import Engine from "@/sections/Engine"
import Infrastructure from "@/sections/Infrastructure"
import Diagnostic from "@/sections/Diagnostic"
import Footer from "@/sections/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center selection:bg-[var(--accent)] selection:text-white">
      {/* Navigation Layer */}
      <nav className="fixed top-0 w-full p-6 z-50 flex items-center justify-between pointer-events-none">
        <div className="liquid-glass px-4 py-3 rounded-2xl pointer-events-auto flex items-center justify-center">
          <img src="/logo-branca.png" alt="Nexus Branca" className="h-6 w-auto object-contain" />
        </div>
        <button className="liquid-glass text-[var(--foreground)] px-6 py-2 rounded-full font-medium pointer-events-auto hover:bg-white/20 transition-colors">
          Menu
        </button>
      </nav>

      {/* Sections */}
      <Hero />
      <Commitment />
      <Engine />
      <Infrastructure />
      <Diagnostic />
      <Footer />
    </main>
  )
}
