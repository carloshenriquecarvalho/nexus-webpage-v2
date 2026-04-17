import { MartechLabWorkspace } from "./MartechLabWorkspace"

export default function MartechLabPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] px-4 py-8 sm:px-6 sm:py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-6 sm:p-10 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.24em] text-zinc-300">
                Nexus • Martech Intelligence
              </span>
              <h1 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-white">Dashboard de Inteligência de Marketing</h1>
              <p className="mt-4 max-w-2xl text-zinc-400 text-sm sm:text-base">
                Carregue um único CSV com campo de data ou mês para analisar períodos automaticamente e gerar alertas inteligentes.
              </p>
            </div>
            <div className="rounded-[2rem] bg-gradient-to-r from-[#F24639] to-[#F22471] px-6 py-5 text-sm font-semibold text-[#0d0d0d] shadow-[0_20px_60px_rgba(242,36,113,0.24)] lg:max-w-xs">
              Use colunas em português ou inglês. A data é inferida automaticamente pelo campo de período.
            </div>
          </div>

          <MartechLabWorkspace />
        </div>
      </div>
    </main>
  )
}
