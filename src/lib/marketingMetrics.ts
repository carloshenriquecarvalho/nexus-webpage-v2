export interface MarketingMetrics {
  campaign: string
  channel: string
  investimento: number
  impressoes: number
  cliques: number
  leads: number
  conversoes: number
  faturamento: number
  cpl: number
  cpa: number
  ctr: number
  taxaConversao: number
  roas: number
  period: string
}

export type MarketingColumn = keyof MarketingMetrics

type GrammarMap = Record<string, MarketingColumn>

const SEMANTIC_COLUMN_MAP: GrammarMap = {
  campanha: "campaign",
  campaign: "campaign",
  "nome da campanha": "campaign",
  "campaign name": "campaign",
  canal: "channel",
  channel: "channel",
  origem: "channel",
  "marketing channel": "channel",
  investimento: "investimento",
  investment: "investimento",
  spend: "investimento",
  budget: "investimento",
  custo: "investimento",
  impressoes: "impressoes",
  impressões: "impressoes",
  impressions: "impressoes",
  impression: "impressoes",
  cliques: "cliques",
  clicks: "cliques",
  click: "cliques",
  leads: "leads",
  "lead count": "leads",
  conversoes: "conversoes",
  conversões: "conversoes",
  conversions: "conversoes",
  conversion: "conversoes",
  cpl: "cpl",
  "custo por lead": "cpl",
  cost_per_lead: "cpl",
  "cost per lead": "cpl",
  cpa: "cpa",
  "custo por aquisição": "cpa",
  "custo por aquisicao": "cpa",
  cost_per_acquisition: "cpa",
  "cost per acquisition": "cpa",
  ctr: "ctr",
  "taxa de clique": "ctr",
  "taxa de cliques": "ctr",
  "click through rate": "ctr",
  "taxa de conversão": "taxaConversao",
  "taxa de conversao": "taxaConversao",
  conversion_rate: "taxaConversao",
  "conversion rate": "taxaConversao",
  roas: "roas",
  "retorno sobre investimento": "roas",
  "return on ad spend": "roas",
  faturamento: "faturamento",
  receita: "faturamento",
  revenue: "faturamento",
  "receita bruta": "faturamento",
  data: "period",
  date: "period",
  mes: "period",
  mês: "period",
  month: "period",
  periodo: "period",
  "data do período": "period",

}

function normalizeKey(key: string) {
  return key
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[_\s\-\.]+/g, " ")
}

function mapHeaderToColumn(header: string): MarketingColumn | undefined {
  return SEMANTIC_COLUMN_MAP[normalizeKey(header)]
}

function parseNumber(value: unknown): number {
  if (value === null || value === undefined) return 0
  if (typeof value === "number") return Number.isFinite(value) ? value : 0

  const raw = String(value).trim()
  if (!raw) return 0

  const sanitized = raw.replace(/[^0-9,\.\-]/g, "")
  if (!sanitized) return 0

  const commaCount = (sanitized.match(/,/g) || []).length
  const dotCount = (sanitized.match(/\./g) || []).length

  if (commaCount > 1 && dotCount === 0) {
    return Number(sanitized.replace(/,/g, "")) || 0
  }

  if (commaCount === 1 && dotCount === 0) {
    return Number(sanitized.replace(",", ".")) || 0
  }

  return Number(sanitized) || 0
}

function safeDivide(value: number, divisor: number) {
  if (!Number.isFinite(value) || !Number.isFinite(divisor) || divisor === 0) return 0
  return value / divisor
}

function normalizePeriodValue(rawValue: unknown) {
  const raw = String(rawValue ?? "").trim()
  if (!raw) return ""

  const cleaned = raw.replace(/\./g, "-").replace(/\s+/g, " ").replace(/_/g, "-").trim()

  const yearMonth = cleaned.match(/^(\d{4})[-/](\d{1,2})$/)
  if (yearMonth) {
    const year = Number(yearMonth[1])
    const month = Number(yearMonth[2])
    if (month >= 1 && month <= 12) {
      return `${year}-${String(month).padStart(2, "0")}`
    }
  }

  const yearMonthDay = cleaned.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/)
  if (yearMonthDay) {
    const year = Number(yearMonthDay[1])
    const month = Number(yearMonthDay[2])
    if (month >= 1 && month <= 12) {
      return `${year}-${String(month).padStart(2, "0")}`
    }
  }

  const monthYear = cleaned.match(/^(\d{1,2})[-/](\d{4})$/)
  if (monthYear) {
    const month = Number(monthYear[1])
    const year = Number(monthYear[2])
    if (month >= 1 && month <= 12) {
      return `${year}-${String(month).padStart(2, "0")}`
    }
  }

  return cleaned
}

const REQUIRED_MARKETING_COLUMNS: MarketingColumn[] = [
  "period",
  "campaign",
  "channel",
  "investimento",
  "impressoes",
  "cliques",
  "leads",
  "conversoes",
  "faturamento",
]

export function validateCsvHeaders(headers: string[]) {
  const found = new Set<MarketingColumn>()

  for (const header of headers) {
    const column = mapHeaderToColumn(header)
    if (column) {
      found.add(column)
    }
  }

  return REQUIRED_MARKETING_COLUMNS.filter(column => !found.has(column))
}

export function normalizeCsvRows(rawRows: Record<string, unknown>[]) {
  return rawRows
    .map(rawRow => {
      const row: Partial<MarketingMetrics> = {
        campaign: "",
        channel: "",
        investimento: 0,
        impressoes: 0,
        cliques: 0,
        leads: 0,
        conversoes: 0,
        faturamento: 0,
        cpl: 0,
        cpa: 0,
        ctr: 0,
        taxaConversao: 0,
        roas: 0,
        period: "",
      }

      for (const [rawKey, rawValue] of Object.entries(rawRow)) {
        const column = mapHeaderToColumn(rawKey)
        if (!column) continue

        if (column === "campaign" || column === "channel") {
          row[column] = String(rawValue ?? "").trim()
          continue
        }

        if (column === "period") {
          row.period = normalizePeriodValue(rawValue)
          continue
        }

        row[column] = parseNumber(rawValue)
      }

      const investimento = row.investimento || 0
      const leads = row.leads || 0
      const conversoes = row.conversoes || 0
      const faturamento = row.faturamento || 0
      const cliques = row.cliques || 0
      const impressoes = row.impressoes || 0
      const roas = row.roas || 0

      const cpl = row.cpl || safeDivide(investimento, leads)
      const cpa = row.cpa || safeDivide(investimento, conversoes)
      const ctr = row.ctr || safeDivide(cliques, impressoes)
      const taxaConversao = row.taxaConversao || safeDivide(conversoes, cliques)

      return {
        campaign: row.campaign || "",
        channel: row.channel || "",
        investimento,
        impressoes,
        cliques,
        leads,
        conversoes,
        faturamento,
        cpl,
        cpa,
        ctr,
        taxaConversao,
        roas,
        period: row.period || "",
      }
    })
    .filter(row => {
      const periodKey = row.period.trim()
      if (!periodKey) return false
      const campaignKey = normalizeKey(row.campaign || row.channel || "")
      if (/(^|\s)(total|subtotal|resumo|acumulado|geral)(\s|$)/i.test(campaignKey)) {
        return false
      }
      return (
        row.investimento > 0 ||
        row.impressoes > 0 ||
        row.cliques > 0 ||
        row.leads > 0 ||
        row.conversoes > 0 ||
        row.faturamento > 0 ||
        row.cpl > 0 ||
        row.cpa > 0 ||
        row.ctr > 0 ||
        row.roas > 0
      )
    })
}

export function aggregateMarketingMetrics(rows: MarketingMetrics[]) {
  const totals = rows.reduce(
    (acc, row) => {
      acc.investimento += row.investimento
      acc.impressoes += row.impressoes
      acc.cliques += row.cliques
      acc.leads += row.leads
      acc.conversoes += row.conversoes
      acc.faturamento += row.faturamento
      return acc
    },
    {
      investimento: 0,
      impressoes: 0,
      cliques: 0,
      leads: 0,
      conversoes: 0,
      faturamento: 0,
    },
  )

  const roas = totals.investimento > 0 ? totals.faturamento / totals.investimento : 0
  const cpl = safeDivide(totals.investimento, totals.leads)
  const cpa = safeDivide(totals.investimento, totals.conversoes)
  const ctr = safeDivide(totals.cliques, totals.impressoes)
  const taxaConversao = safeDivide(totals.conversoes, totals.cliques)

  return {
    campaign: "",
    channel: "",
    investimento: totals.investimento,
    impressoes: totals.impressoes,
    cliques: totals.cliques,
    leads: totals.leads,
    conversoes: totals.conversoes,
    faturamento: totals.faturamento,
    cpl,
    cpa,
    ctr,
    taxaConversao,
    roas,
    period: "",
  }
}

export function percentageDelta(current: number, previous: number) {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return 0
  if (previous === 0) return current === 0 ? 0 : 100
  return ((current - previous) / Math.abs(previous)) * 100
}
