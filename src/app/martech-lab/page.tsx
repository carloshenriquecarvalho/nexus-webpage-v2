"use client"

import { type ChangeEvent, type DragEvent, useMemo, useState } from "react"
import { parse, type ParseResult } from "papaparse"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { CheckCircle2, CloudUpload } from "lucide-react"
import {
  MarketingMetrics,
  aggregateMarketingMetrics,
  normalizeCsvRows,
  percentageDelta,
  validateCsvHeaders,
} from "@/lib/marketingMetrics"

const tabs = ["Dashboard", "Upload de Dados", "Warnings & Insights"] as const

type Tab = (typeof tabs)[number]

type UploadStatus = {
  label: string
  loaded: boolean
  fileName: string
}

type InsightWarning = {
  severity: "positive" | "attention" | "critical"
  title: string
  explanation: string
  recommendation: string
}

function classNames(...values: Array<string | boolean | undefined>) {
  return values.filter(Boolean).join(" ")
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

function formatSmallPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

function severityBadge(severity: "positive" | "attention" | "critical") {
  if (severity === "positive") return "bg-emerald-500/10 text-emerald-300"
  if (severity === "attention") return "bg-amber-500/10 text-amber-300"
  return "bg-rose-500/10 text-rose-300"
}

function severityIcon(severity: "positive" | "attention" | "critical") {
  if (severity === "positive") return "🟢"
  if (severity === "attention") return "🟡"
  return "🔴"
}

function buildInitialStatus(): UploadStatus {
  return { label: "Aguardando upload", loaded: false, fileName: "Nenhum arquivo" }
}

const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

function normalizePeriodForSort(period: string) {
  const raw = period.trim()
  const cleaned = raw.replace(/\./g, "-").replace(/\//g, "-").replace(/\s+/g, "").trim()

  const yearMonth = cleaned.match(/^(\d{4})-(\d{1,2})$/)
  if (yearMonth) {
    const year = Number(yearMonth[1])
    const month = Number(yearMonth[2])
    if (month >= 1 && month <= 12) {
      return `${year}-${String(month).padStart(2, "0")}`
    }
  }

  const yearMonthDay = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (yearMonthDay) {
    const year = Number(yearMonthDay[1])
    const month = Number(yearMonthDay[2])
    if (month >= 1 && month <= 12) {
      return `${year}-${String(month).padStart(2, "0")}`
    }
  }

  const monthYear = cleaned.match(/^(\d{1,2})-(\d{4})$/)
  if (monthYear) {
    const month = Number(monthYear[1])
    const year = Number(monthYear[2])
    if (month >= 1 && month <= 12) {
      return `${year}-${String(month).padStart(2, "0")}`
    }
  }

  return raw.toLowerCase()
}

function formatPeriodLabel(period: string) {
  const canonical = normalizePeriodForSort(period)
  const match = canonical.match(/^(\d{4})-(\d{2})$/)
  if (match) {
    const year = match[1].slice(2)
    const month = Number(match[2])
    return `${monthNames[month - 1]}/${year}`
  }
  return period
}

function compareMetrics(previous: MarketingMetrics, current: MarketingMetrics) {
  return {
    investimentoDelta: percentageDelta(current.investimento, previous.investimento),
    roasDelta: percentageDelta(current.roas, previous.roas),
    faturamentoDelta: percentageDelta(current.faturamento, previous.faturamento),
    conversoesDelta: percentageDelta(current.conversoes, previous.conversoes),
  }
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

function buildUploadDetails(
  status: UploadStatus,
  data: MarketingMetrics[],
  onDrop: (event: DragEvent<HTMLDivElement>) => void,
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void,
) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-7">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Upload único</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Arquivo com período</h3>
          <p className="mt-2 text-sm text-zinc-400">{status.fileName}</p>
        </div>
        <div
          className={classNames(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold",
            status.loaded ? "bg-emerald-500/10 text-emerald-300" : "bg-white/5 text-zinc-300",
          )}
        >
          <CheckCircle2 size={18} />
          {status.loaded ? "Arquivo carregado" : "Aguardando arquivo"}
        </div>
      </div>

      <div
        onDragOver={event => event.preventDefault()}
        onDrop={onDrop}
        className="group mb-6 rounded-[1.75rem] border border-dashed border-white/15 bg-[#0d0d0d] px-6 py-12 text-center transition hover:border-white/30"
      >
        <CloudUpload size={36} className="mx-auto text-[#F24639]" />
        <p className="mt-4 text-lg font-semibold text-white">Arraste e solte seu CSV</p>
        <p className="mt-2 text-sm text-zinc-500">Use um arquivo com campo de data ou mês para analisar períodos automaticamente.</p>
        <label className="mt-6 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F24639] to-[#F22471] px-6 py-3 text-sm font-semibold text-[#0d0d0d] transition hover:brightness-110">
          <input type="file" accept=".csv" className="hidden" onChange={onFileChange} />
          Selecionar arquivo
        </label>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-[#0b0b0b] p-5">
        <p className="text-sm text-zinc-400">Preview das primeiras linhas</p>
        {renderTablePreview(data)}
      </div>
    </div>
  )
}

function renderTablePreview(rows: MarketingMetrics[]) {
  const preview = rows.slice(0, 5)
  if (!preview.length) {
    return <div className="mt-4 rounded-3xl border border-white/10 bg-[#111111] px-6 py-8 text-sm text-zinc-500">Nenhum preview disponível.</div>
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-[1.75rem] border border-white/10 bg-[#111111]">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-[#111111] text-zinc-400">
          <tr>
            <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">Período</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">Campanha</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">Investimento</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">Cliques</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">Conversões</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">Faturamento</th>
          </tr>
        </thead>
        <tbody>
          {preview.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-[#0d0d0d]" : "bg-[#111111]"}>
              <td className="px-4 py-4 text-sm text-zinc-300">{row.period || "-"}</td>
              <td className="px-4 py-4 text-sm text-white">{row.campaign || "-"}</td>
              <td className="px-4 py-4 text-sm text-zinc-300">{formatCurrency(row.investimento)}</td>
              <td className="px-4 py-4 text-sm text-zinc-300">{row.cliques}</td>
              <td className="px-4 py-4 text-sm text-zinc-300">{row.conversoes}</td>
              <td className="px-4 py-4 text-sm text-zinc-300">{formatCurrency(row.faturamento)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function renderKpiCard(label: string, value: string, subtitle: string) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-6">
      <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
    </div>
  )
}

function renderEmptyState(message: string, buttonText: string, onAction: () => void) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-10 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Dashboard vazio</p>
      <h2 className="mt-4 text-3xl font-semibold text-white">{message}</h2>
      <button
        type="button"
        onClick={onAction}
        className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[#F24639] to-[#F22471] px-6 py-3 text-sm font-semibold text-[#0d0d0d] transition hover:brightness-110"
      >
        {buttonText}
      </button>
    </div>
  )
}

function buildInsightWarnings(previous: MarketingMetrics, current: MarketingMetrics): InsightWarning[] {
  const warnings: InsightWarning[] = []
  const cplDown = current.cpl < previous.cpl
  const conversionDown = current.conversoes < previous.conversoes
  const conversionStableOrUp = current.conversoes >= previous.conversoes
  const ctrUp = current.ctr > previous.ctr
  const investimentoUp = current.investimento > previous.investimento
  const leadsUp = current.leads > previous.leads
  const cpaChange = percentageDelta(current.cpa, previous.cpa)
  const ctrVeryLow = current.ctr < 0.01
  const investDelta = percentageDelta(current.investimento, previous.investimento)
  const leadsDelta = percentageDelta(current.leads, previous.leads)
  const currentTicketMedio = current.conversoes > 0 ? current.faturamento / current.conversoes : 0
  const previousTicketMedio = previous.conversoes > 0 ? previous.faturamento / previous.conversoes : 0
  const currentRealRoas = current.investimento > 0 ? current.faturamento / current.investimento : 0
  const previousRealRoas = previous.investimento > 0 ? previous.faturamento / previous.investimento : 0
  const revenueDown = current.faturamento < previous.faturamento
  const investimentoStable = current.investimento === previous.investimento
  const conversoesUp = current.conversoes > previous.conversoes
  const conversoesStable = current.conversoes === previous.conversoes
  const metricsDelta = compareMetrics(previous, current)

  if (cplDown && conversionDown) {
    warnings.push({
      severity: "attention",
      title: "CPL caiu, mas conversão também caiu",
      explanation:
        "CPL menor não significa eficiência quando o volume de conversões diminui. Isso indica que leads mais baratos podem estar menos qualificados.",
      recommendation: "Revise segmentação e criativos para recuperar a qualidade do tráfego.",
    })
  }

  if (cplDown && conversionStableOrUp) {
    warnings.push({
      severity: "positive",
      title: "CPL caiu e conversão se manteve ou subiu",
      explanation:
        "Excelente. A redução do custo por lead está ocorrendo sem perda de resultado. Isso sinaliza uma operação mais eficiente.",
      recommendation: "Considere escalar esta operação mantendo a mesma alocação de mídia.",
    })
  }

  if (ctrUp && conversionDown) {
    warnings.push({
      severity: "attention",
      title: "CTR subiu mas conversão caiu",
      explanation:
        "Mais cliques não significam mais resultados. Pode haver desalinhamento entre anúncio e experiência de pós-clique.",
      recommendation: "Revise jornada pós-clique e oferta antes de escalar mídia.",
    })
  }

  if (metricsDelta.investimentoDelta > 0 && metricsDelta.roasDelta < 0) {
    warnings.push({
      severity: "critical",
      title: "Escalar investimento sem manter eficiência é queimar budget",
      explanation:
        "O investimento subiu enquanto o ROAS real caiu. Isso indica que a média de retorno não acompanha a escala.",
      recommendation:
        "Identifique quais campanhas estão trazendo faturamento e quais trazem apenas cliques caros.",
    })
  }

  if (investimentoUp && currentRealRoas < previousRealRoas) {
    warnings.push({
      severity: "critical",
      title: "Investimento subiu e ROAS real caiu",
      explanation:
        "O investimento subiu, mas o retorno real sobre receita caiu. Escalar sem eficiência é queimar budget.",
      recommendation:
        "Identifique quais campanhas estão trazendo faturamento e quais trazem apenas cliques caros.",
    })
  }

  if (conversoesUp && revenueDown) {
    warnings.push({
      severity: "attention",
      title: "Degradação de Ticket Médio.",
      explanation:
        "Mais vendas com menos receita indicam foco em produtos de baixa margem ou descontos agressivos.",
      recommendation:
        "Reavalie o mix de produtos e a oferta para recuperar o ticket médio.",
    })
  }

  if (investimentoStable && revenueDown) {
    warnings.push({
      severity: "critical",
      title: "Perda de Eficiência Comercial.",
      explanation:
        "Sua capacidade de gerar receita com o mesmo investimento caiu drasticamente.",
      recommendation:
        "Revise a operação comercial e a proposta de valor para restaurar a receita por investimento.",
    })
  }

  if (conversoesStable && current.faturamento > previous.faturamento) {
    warnings.push({
      severity: "positive",
      title: "Otimização de Mix de Vendas.",
      explanation:
        "Você está gerando mais receita com o mesmo volume de conversões. Isso indica melhor desempenho do mix de vendas.",
      recommendation: "Escale a estratégia que elevou a receita sem aumentar o volume de conversões.",
    })
  }

  if (current.cpa > currentTicketMedio && currentTicketMedio > 0) {
    warnings.push({
      severity: "critical",
      title: "Custo de aquisição insustentável.",
      explanation:
        "CPA maior que o ticket médio indica que você está pagando mais para adquirir o cliente do que ele gera de receita.",
      recommendation:
        "Ajuste preço, oferta ou qualificação de leads para melhorar a margem por venda.",
    })
  }

  if (leadsUp && conversionDown) {
    warnings.push({
      severity: "critical",
      title: "Vazamento de valor no funil",
      explanation:
        "O topo do funil atrai mais leads, mas conversões e faturamento não acompanham. Isso indica problemas de qualificação ou de oferta.",
      recommendation:
        "Verifique se o comercial está desqualificando leads ou concedendo descontos agressivos para fechar vendas.",
    })
  }

  if (cpaChange > 20) {
    warnings.push({
      severity: "critical",
      title: "CPA subiu mais de 20%",
      explanation:
        "O custo por aquisição está subindo rapidamente. Se não houver justificativa de ticket médio, há risco de perda de eficiência.",
      recommendation: "Investigue a causa raiz no mix de canais e criativos.",
    })
  }

  const allImproved =
    current.cpl < previous.cpl &&
    current.cpa < previous.cpa &&
    current.conversoes > previous.conversoes &&
    current.ctr > previous.ctr &&
    current.roas > previous.roas

  if (allImproved) {
    warnings.push({
      severity: "positive",
      title: "Todas as métricas melhoraram",
      explanation:
        "Performance sólida em todos os indicadores. Documente o que funciona para escalar com consistência.",
      recommendation: "Crie playbooks para replicar o que deu certo.",
    })
  }

  if (ctrVeryLow) {
    warnings.push({
      severity: "critical",
      title: "CTR muito baixo (<1%)",
      explanation:
        "Taxa de cliques abaixo de 1% indica problemas de relevância do anúncio ou da segmentação.",
      recommendation: "Revise copy, criativos e público imediatamente.",
    })
  }

  if (investimentoUp === false && leadsDelta <= investDelta && leadsDelta >= -investDelta) {
    warnings.push({
      severity: "positive",
      title: "Investimento caiu e leads caíram proporcionalmente",
      explanation:
        "A redução de escala preservou a eficiência. Não há degradação de performance, apenas menor volume.",
      recommendation: "Mantenha o controle e monitore a recuperação da escala.",
    })
  }

  if (investimentoUp === false && leadsDelta < investDelta) {
    warnings.push({
      severity: "attention",
      title: "Investimento caiu e leads caíram mais que proporcionalmente",
      explanation:
        "Cortar verba prejudicou a performance de forma desproporcional. Pode ter sido cortado investimento em canais eficientes.",
      recommendation: "Reavalie alocação de verba e priorize canais que geram volume qualificado.",
    })
  }

  return warnings
}

function parseCsvFile(file: File): Promise<MarketingMetrics[]> {
  return new Promise((resolve, reject) => {
    parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: header => header.trim(),
      complete(result: ParseResult<Record<string, string>>) {
        const headers = result.meta.fields ?? []
        const missingColumns = validateCsvHeaders(headers)

        if (missingColumns.length) {
          reject(
            new Error(
              `Cabeçalhos inválidos ou ausentes: ${missingColumns.join(", ")}. Use período, campanha, canal, investimento, impressões, cliques, leads, conversões e faturamento.`,
            ),
          )
          return
        }

        const normalized = normalizeCsvRows(result.data)
        if (!normalized.length) {
          reject(new Error("Não foram encontradas linhas válidas no CSV. Remova totais ou linhas sem campanha e tente novamente."))
          return
        }

        resolve(normalized)
      },
      error() {
        reject(new Error("Não foi possível ler o CSV. Verifique o formato e tente novamente."))
      },
    })
  })
}

function buildPeriodSummaryTable(summaryA: MarketingMetrics, summaryB: MarketingMetrics, labelA: string, labelB: string) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-6">
      <h3 className="text-xl font-semibold text-white">Comparação de períodos</h3>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[#0d0d0d] text-zinc-400">
            <tr>
              <th className="px-4 py-3 text-center font-semibold uppercase tracking-[0.2em]">Métrica</th>
              <th className="px-4 py-3 text-center font-semibold uppercase tracking-[0.2em]">{formatPeriodLabel(labelA)}</th>
              <th className="px-4 py-3 text-center font-semibold uppercase tracking-[0.2em]">{formatPeriodLabel(labelB)}</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Investimento", formatCurrency(summaryA.investimento), formatCurrency(summaryB.investimento)],
              ["Leads", summaryA.leads.toString(), summaryB.leads.toString()],
              ["Conversões", summaryA.conversoes.toString(), summaryB.conversoes.toString()],
              ["Faturamento", formatCurrency(summaryA.faturamento), formatCurrency(summaryB.faturamento)],
              ["CPL", formatCurrency(summaryA.cpl), formatCurrency(summaryB.cpl)],
              ["CPA", formatCurrency(summaryA.cpa), formatCurrency(summaryB.cpa)],
              ["CTR", formatSmallPercent(summaryA.ctr), formatSmallPercent(summaryB.ctr)],
              ["ROAS", summaryA.roas > 0 ? summaryA.roas.toFixed(2) : "N/A", summaryB.roas > 0 ? summaryB.roas.toFixed(2) : "N/A"],
            ].map(([metric, valueA, valueB], index) => (
              <tr key={metric} className={index % 2 === 0 ? "bg-[#0d0d0d]" : "bg-[#111111]"}>
                <td className="px-4 py-4 text-center font-medium text-white">{metric}</td>
                <td className="px-4 py-4 text-center text-zinc-300">{valueA}</td>
                <td className="px-4 py-4 text-center text-zinc-300">{valueB}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function MartechLabPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Upload de Dados")
  const [data, setData] = useState<MarketingMetrics[]>([])
  const [status, setStatus] = useState<UploadStatus>(buildInitialStatus())
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const overallSummary = useMemo(() => aggregateMarketingMetrics(data), [data])

  const periodSummaries = useMemo(() => {
    if (!data.length) return []

    const groups: Record<string, MarketingMetrics[]> = {}
    data.forEach(row => {
      const key = row.period || "Sem período"
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(row)
    })

    return Object.entries(groups)
      .map(([period, rows]) => ({ period, summary: aggregateMarketingMetrics(rows), rows }))
      .sort((a, b) => normalizePeriodForSort(a.period).localeCompare(normalizePeriodForSort(b.period)))
  }, [data])

  const periodChannelSummaries = useMemo(() => {
    if (!data.length) return []

    const groups: Record<string, MarketingMetrics[]> = {}
    data.forEach(row => {
      const period = row.period || "Sem período"
      const channel = row.channel || "Sem canal"
      const key = `${period}||${channel}`
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(row)
    })

    return Object.entries(groups)
      .map(([key, rows]) => {
        const [period, channel] = key.split("||")
        return {
          period,
          channel,
          summary: aggregateMarketingMetrics(rows),
        }
      })
      .sort((a, b) => {
        const periodCompare = normalizePeriodForSort(a.period).localeCompare(normalizePeriodForSort(b.period))
        return periodCompare !== 0 ? periodCompare : a.channel.localeCompare(b.channel)
      })
  }, [data])

  const hasAnyData = data.length > 0
  const hasMultiplePeriods = periodSummaries.length >= 2
  const latestPeriod = periodSummaries[periodSummaries.length - 1]
  const previousPeriod = periodSummaries[periodSummaries.length - 2]

  const warningItems = useMemo(() => {
    if (!hasMultiplePeriods || !previousPeriod || !latestPeriod) return []
    return buildInsightWarnings(previousPeriod.summary, latestPeriod.summary)
  }, [hasMultiplePeriods, previousPeriod, latestPeriod])

  const periodTrendData = useMemo(() => {
    return periodSummaries.map(item => ({
      period: formatPeriodLabel(item.period),
      CTR: Number((item.summary.ctr * 100).toFixed(2)),
      ROAS: Number(item.summary.roas.toFixed(2)),
      Investimento: item.summary.investimento,
    }))
  }, [periodSummaries])

  const topCampaignData = useMemo(() => {
    return data.slice(0, 6).map((row, index) => ({
      name: row.campaign || `Linha ${index + 1}`,
      Investimento: row.investimento,
      Conversões: row.conversoes,
      Leads: row.leads,
    }))
  }, [data])

  async function handleFile(file: File) {
    setErrorMessage("")
    setIsLoading(true)

    try {
      const normalizedData = await parseCsvFile(file)
      setData(normalizedData)
      setStatus({ label: "Arquivo carregado", loaded: true, fileName: file.name })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao processar o CSV.")
      setStatus({ label: "Upload inválido", loaded: false, fileName: file.name })
    } finally {
      setIsLoading(false)
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-10 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.24em] text-zinc-300">
                Nexus • Martech Intelligence
              </span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white">Dashboard de Inteligência de Marketing</h1>
              <p className="mt-4 max-w-2xl text-zinc-400">
                Carregue um único CSV com campo de data ou mês para analisar períodos automaticamente e gerar alertas inteligentes.
              </p>
            </div>
            <div className="rounded-[2rem] bg-gradient-to-r from-[#F24639] to-[#F22471] px-6 py-5 text-sm font-semibold text-[#0d0d0d] shadow-[0_20px_60px_rgba(242,36,113,0.24)]">
              Use colunas em português ou inglês; a data é inferida automaticamente pelo campo de período.
            </div>
          </div>

          <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              {tabs.map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={classNames(
                    "rounded-3xl cursor-pointer px-5 py-3 text-sm font-medium transition",
                    activeTab === tab
                      ? "bg-gradient-to-r from-[#F24639] to-[#F22471] text-white shadow-[0_20px_40px_rgba(242,36,113,0.25)]"
                      : "border border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={downloadExampleCsv}
              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[#F24639] to-[#F22471] px-6 py-3 text-sm font-semibold text-[#0d0d0d] transition hover:brightness-110"
            >
              Baixar CSV Modelo
            </button>
          </div>

          {activeTab === "Dashboard" && (
            <section className="space-y-8">
              {!hasAnyData ? (
                renderEmptyState("Nenhum CSV carregado ainda.", "Ir para Upload", () => setActiveTab("Upload de Dados"))
              ) : (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {renderKpiCard("Investimento Total", formatCurrency(overallSummary.investimento), "Total agregado do arquivo")}
                    {renderKpiCard("Total de Leads", overallSummary.leads.toString(), "Leads acumulados")}
                    {renderKpiCard("Total de Vendas", overallSummary.conversoes.toString(), "Conversões acumuladas")}
                    {renderKpiCard("Faturamento Total", formatCurrency(overallSummary.faturamento), "Receita bruta total")}
                    {renderKpiCard("CPL", formatCurrency(overallSummary.cpl), "Custo médio por lead")}
                    {renderKpiCard("CPA", formatCurrency(overallSummary.cpa), "Custo médio por aquisição")}
                    {renderKpiCard("CTR", formatSmallPercent(overallSummary.ctr), "Taxa de cliques média")}
                    <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-6">
                      <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">ROAS</p>
                      <p className="mt-4 text-3xl font-semibold text-white">{overallSummary.roas > 0 ? overallSummary.roas.toFixed(2) : "N/A"}</p>
                      <p className="mt-2 text-sm text-zinc-400">Retorno sobre investimento</p>
                    </div>
                  </div>

                  <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-6">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-semibold text-white">Visão por período</h2>
                          <p className="text-sm text-zinc-400">Agregação baseada no campo de data/mês.</p>
                        </div>
                      </div>
                      <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={periodTrendData} margin={{ top: 20, right: 24, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="#2f2f2f" vertical={false} />
                            <XAxis dataKey="period" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                            <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: "#111111", borderColor: "#2f2f2f", color: "#fff" }} />
                            <Legend wrapperStyle={{ color: "#9ca3af" }} />
                            <Bar dataKey="Investimento" name="Investimento" fill="#F24639" radius={[12, 12, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-6">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-semibold text-white">Tendência de CTR e ROAS</h2>
                          <p className="text-sm text-zinc-400">Comparação dos últimos períodos detectados.</p>
                        </div>
                      </div>
                      <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={periodTrendData} margin={{ top: 20, right: 24, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="#2f2f2f" strokeDasharray="3 3" />
                            <XAxis dataKey="period" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                            <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: "#111111", borderColor: "#2f2f2f", color: "#fff" }} />
                            <Legend wrapperStyle={{ color: "#9ca3af" }} />
                            <Line type="monotone" dataKey="CTR" name="CTR (%)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="ROAS" name="ROAS" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-6">
                    <h3 className="text-xl font-semibold text-white">Tabela de resumo</h3>
                    <div className="mt-6 overflow-x-auto">
                      <table className="min-w-full border-collapse text-left text-sm">
                        <thead className="bg-[#0d0d0d] text-zinc-400">
                          <tr>
                            <th className="px-4 py-3 text-center font-semibold uppercase tracking-[0.2em]">Período</th>
                            <th className="px-4 py-3 text-center font-semibold uppercase tracking-[0.2em]">Canal</th>
                            <th className="px-4 py-3 text-center font-semibold uppercase tracking-[0.2em]">Investimento</th>
                            <th className="px-4 py-3 text-center font-semibold uppercase tracking-[0.2em]">Leads</th>
                            <th className="px-4 py-3 text-center font-semibold uppercase tracking-[0.2em]">Conversões</th>
                            <th className="px-4 py-3 text-center font-semibold uppercase tracking-[0.2em]">Faturamento</th>
                            <th className="px-4 py-3 text-center font-semibold uppercase tracking-[0.2em]">CPL</th>
                            <th className="px-4 py-3 text-center font-semibold uppercase tracking-[0.2em]">ROAS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {periodChannelSummaries.map((item, index) => (
                            <tr key={`${item.period}-${item.channel}`} className={index % 2 === 0 ? "bg-[#0d0d0d]" : "bg-[#111111]"}>
                              <td className="px-4 py-4 text-center font-medium text-white">{formatPeriodLabel(item.period)}</td>
                              <td className="px-4 py-4 text-center text-zinc-300">{item.channel}</td>
                              <td className="px-4 py-4 text-center text-zinc-300">{formatCurrency(item.summary.investimento)}</td>
                              <td className="px-4 py-4 text-center text-zinc-300">{item.summary.leads}</td>
                              <td className="px-4 py-4 text-center text-zinc-300">{item.summary.conversoes}</td>
                              <td className="px-4 py-4 text-center text-zinc-300">{formatCurrency(item.summary.faturamento)}</td>
                              <td className="px-4 py-4 text-center text-zinc-300">{formatCurrency(item.summary.cpl)}</td>
                              <td className="px-4 py-4 text-center text-zinc-300">{item.summary.roas > 0 ? item.summary.roas.toFixed(2) : "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {hasMultiplePeriods && previousPeriod && latestPeriod &&
                    buildPeriodSummaryTable(previousPeriod.summary, latestPeriod.summary, previousPeriod.period, latestPeriod.period)
                  }
                </>
              )}
            </section>
          )}

          {activeTab === "Upload de Dados" && (
            <section className="space-y-8">
              {errorMessage ? (
                <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-200">
                  {errorMessage}
                </div>
              ) : null}

              <div className="grid gap-6 xl:grid-cols-1">
                {buildUploadDetails(status, data, handleDrop, handleFileChange)}
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-8">
                <h2 className="text-2xl font-semibold text-white">Como preparar o CSV</h2>
                <p className="mt-4 text-zinc-400">
                  O arquivo deve conter um campo de data ou mês para identificar cada linha, além de métricas de marketing como investimento, impressões, cliques, leads e conversões.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "periodo / period / month / date",
                    "campanha / campaign",
                    "canal / channel",
                    "investimento / spend",
                    "impressoes / impressions",
                    "cliques / clicks",
                    "leads",
                    "conversoes / conversions",
                    "faturamento / revenue",
                  ].map(item => (
                    <span key={item} className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-zinc-300">{item}</span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === "Warnings & Insights" && (
            <section className="space-y-8">
              <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-8">
                <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">Insight central</p>
                <blockquote className="mt-4 text-xl font-semibold leading-9 text-white">
                  “Métricas isoladas mentem. CPL caiu? Ótimo. Mas e a conversão? E o ticket médio? E o ROAS? Inteligência de marketing é conectar os pontos — não celebrar números soltos.”
                </blockquote>
              </div>

              <div className="mb-6 rounded-[2rem] border border-white/10 bg-[#111111] p-5 text-sm text-zinc-400">
                Baixe o CSV modelo com as colunas prontas e 5 linhas de exemplo. Apague os dados de exemplo e substitua pelos seus antes de subir.
              </div>

              {!hasAnyData ? (
                renderEmptyState("Nenhum CSV carregado ainda.", "Ir para Upload", () => setActiveTab("Upload de Dados"))
              ) : !hasMultiplePeriods ? (
                <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-10 text-center text-zinc-300">
                  <h2 className="text-2xl font-semibold text-white">Carregue dois ou mais períodos para gerar warnings</h2>
                  <p className="mt-3 text-zinc-400">O módulo de insights compara o último período com o anterior.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {warningItems.length ? (
                    warningItems.map((warning, index) => (
                      <div key={index} className={classNames("rounded-[2rem] border p-6", severityBadge(warning.severity), "border-white/10 bg-[#111111]/80")}>
                        <div className="flex items-start gap-4">
                          <span className="text-3xl">{severityIcon(warning.severity)}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{warning.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-zinc-400">{warning.explanation}</p>
                            <p className="mt-3 text-sm font-semibold text-white">Recomendação: {warning.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-10 text-center text-zinc-300">
                      <h2 className="text-2xl font-semibold text-white">Sem alertas no momento</h2>
                      <p className="mt-3 text-zinc-400">Os dois últimos períodos estão alinhados. Continue monitorando a operação.</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
