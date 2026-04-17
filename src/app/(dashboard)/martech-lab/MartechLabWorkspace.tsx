"use client"

import { useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"

export const tabs = ["Dashboard", "Upload de Dados", "Warnings & Insights"] as const
export type Tab = (typeof tabs)[number]

const MartechContent = dynamic(() => import("./MartechContent"), {
  ssr: true, // We want the empty state to SSR instantly
  loading: () => (
    <div className="flex h-[500px] w-full items-center justify-center rounded-[2rem] border border-white/10 bg-[#111111] p-10 text-zinc-400">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-500 border-t-[#F24639]" />
        <p>Iniciando o motor de Inteligência de Marketing...</p>
      </div>
    </div>
  ),
})

function classNames(...values: Array<string | boolean | undefined>) {
  return values.filter(Boolean).join(" ")
}

function buildSampleCsv() {
  const rows = [
    [
      "periodo",
      "campanha",
      "canal",
      "investimento",
      "impressoes",
      "cliques",
      "leads",
      "conversoes",
      "faturamento",
    ],
    ["2025-01", "Lançamento A", "Google Ads", "12000", "250000", "4200", "220", "40", "120000"],
    ["2025-02", "Campanha B", "Facebook Ads", "9000", "180000", "3100", "180", "28", "98000"],
    ["2025-03", "Promoção C", "LinkedIn", "15000", "140000", "1900", "95", "18", "68000"],
    ["2025-04", "Remarketing D", "Instagram", "8000", "95000", "1600", "110", "20", "69000"],
    ["2025-05", "Retargeting E", "YouTube", "10000", "130000", "2100", "150", "25", "87500"],
  ]

  return rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\r\n")
}

function downloadExampleCsv() {
  const csv = buildSampleCsv()
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "martech-lab-modelo.csv"
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function MartechLabWorkspace() {
  const [activeTab, setActiveTab] = useState<Tab>("Upload de Dados")

  return (
    <>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {tabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={classNames(
                "rounded-3xl cursor-pointer px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition",
                activeTab === tab
                  ? "bg-gradient-to-r from-[#F24639] to-[#F22471] text-white shadow-[0_20px_40px_rgba(242,36,113,0.25)]"
                  : "border border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Voltar para a página inicial
          </Link>
          <button
            type="button"
            onClick={downloadExampleCsv}
            className="inline-flex cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[#F24639] to-[#F22471] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#0d0d0d] transition hover:brightness-110"
          >
            Baixar CSV Modelo
          </button>
        </div>
      </div>

      <MartechContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  )
}
