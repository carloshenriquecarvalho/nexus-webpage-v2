'use client';
import dynamic from "next/dynamic"

const MartechLabClient = dynamic(() => import("./MartechLabClient"), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen bg-[#0D0D0D] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-10 text-center text-zinc-300">
          Carregando o Martech Lab...
        </div>
      </div>
    </main>
  ),
})

export default function Page() {
  return <MartechLabClient />
}
