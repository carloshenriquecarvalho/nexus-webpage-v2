import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer"
import { MarketingMetrics } from "@/lib/marketingMetrics"

type InsightWarning = {
  severity: "positive" | "attention" | "critical"
  title: string
  explanation: string
  recommendation: string
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

function formatPeriodLabel(period: string) {
  const match = period.match(/^(\d{4})-(\d{2})$/)
  if (match) {
    const year = match[1].slice(2)
    const month = Number(match[2])
    return `${monthNames[month - 1]}/${year}`
  }
  return period
}

function getExecutivePdfStyles() {
  return StyleSheet.create({
    page: {
      padding: 24,
      fontSize: 12,
      fontFamily: "Helvetica",
      color: "#111111",
      backgroundColor: "#ffffff",
    },
    header: {
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 6,
      color: "#111111",
    },
    subtitle: {
      fontSize: 10,
      color: "#555555",
      marginBottom: 16,
    },
    cardGrid: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8,
      marginBottom: 16,
    },
    card: {
      width: "48%",
      padding: 10,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderRadius: 6,
      backgroundColor: "#fafafa",
      marginBottom: 8,
    },
    cardLabel: {
      fontSize: 10,
      color: "#6b7280",
      marginBottom: 4,
    },
    cardValue: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#111111",
    },
    warningItem: {
      padding: 10,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderRadius: 6,
      marginBottom: 10,
    },
    warningTitle: {
      fontSize: 12,
      fontWeight: "bold",
      marginBottom: 4,
    },
    warningSeverity: {
      fontSize: 10,
      color: "#9b1c1c",
      marginBottom: 4,
    },
    warningText: {
      fontSize: 10,
      color: "#333333",
      marginBottom: 4,
    },
    section: {
      marginBottom: 18,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#111111",
    },
    table: {
      width: "100%",
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderStyle: "solid",
      marginBottom: 16,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
      borderBottomStyle: "solid",
    },
    tableHeader: {
      width: "12.5%",
      padding: 6,
      fontSize: 9,
      fontWeight: "bold",
      color: "#111111",
      borderRightWidth: 1,
      borderRightColor: "#e5e7eb",
      borderRightStyle: "solid",
    },
    tableHeaderWide: {
      width: "20%",
      padding: 6,
      fontSize: 9,
      fontWeight: "bold",
      color: "#111111",
      borderRightWidth: 1,
      borderRightColor: "#e5e7eb",
      borderRightStyle: "solid",
    },
    tableCell: {
      width: "12.5%",
      padding: 6,
      fontSize: 9,
      color: "#333333",
      borderRightWidth: 1,
      borderRightColor: "#e5e7eb",
      borderRightStyle: "solid",
    },
    tableCellWide: {
      width: "20%",
      padding: 6,
      fontSize: 9,
      color: "#333333",
      borderRightWidth: 1,
      borderRightColor: "#e5e7eb",
      borderRightStyle: "solid",
    },
    smallText: {
      fontSize: 10,
      color: "#555555",
    },
  })
}

function ExecutiveReportDocument({
  overallSummary,
  warnings,
  periodChannelSummaries,
}: {
  overallSummary: MarketingMetrics
  warnings: InsightWarning[]
  periodChannelSummaries: Array<{ period: string; channel: string; summary: MarketingMetrics }>
}) {
  const styles = getExecutivePdfStyles()

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Nexus Tecnologia e Inovação</Text>
          <Text style={styles.subtitle}>Relatório Executivo de Performance de Marketing</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sumário de Performance</Text>
          <View style={styles.cardGrid}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Investimento Total</Text>
              <Text style={styles.cardValue}>{formatCurrency(overallSummary.investimento)}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Leads</Text>
              <Text style={styles.cardValue}>{overallSummary.leads}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Conversões</Text>
              <Text style={styles.cardValue}>{overallSummary.conversoes}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Faturamento Total</Text>
              <Text style={styles.cardValue}>{formatCurrency(overallSummary.faturamento)}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>CPL Médio</Text>
              <Text style={styles.cardValue}>{formatCurrency(overallSummary.cpl)}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>ROAS Geral</Text>
              <Text style={styles.cardValue}>{overallSummary.roas > 0 ? overallSummary.roas.toFixed(2) : "N/A"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O Diagnóstico</Text>
          <Text style={styles.smallText}>
            “Métricas isoladas mentem. Inteligência de marketing é conectar os pontos”.
          </Text>
          {warnings.length > 0 ? warnings.map((warning, index) => (
            <View key={index} style={styles.warningItem}>
              <Text style={styles.warningTitle}>{warning.title}</Text>
              <Text style={styles.warningSeverity}>Severidade: {warning.severity.toUpperCase()}</Text>
              <Text style={styles.warningText}>{warning.explanation}</Text>
              <Text style={styles.warningText}>Recomendação: {warning.recommendation}</Text>
            </View>
          )) : (
            <Text style={styles.smallText}>Nenhum alerta crítico detectado no momento.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tabela Detalhada</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeaderWide}>Período</Text>
              <Text style={styles.tableHeader}>Canal</Text>
              <Text style={styles.tableHeader}>Invest.</Text>
              <Text style={styles.tableHeader}>Leads</Text>
              <Text style={styles.tableHeader}>Conv.</Text>
              <Text style={styles.tableHeader}>Fatur.</Text>
              <Text style={styles.tableHeader}>CPL</Text>
              <Text style={styles.tableHeader}>ROAS</Text>
            </View>
            {periodChannelSummaries.map((item, index) => (
              <View key={`${item.period}-${item.channel}-${index}`} style={styles.tableRow}>
                <Text style={styles.tableCellWide}>{formatPeriodLabel(item.period)}</Text>
                <Text style={styles.tableCell}>{item.channel}</Text>
                <Text style={styles.tableCell}>{formatCurrency(item.summary.investimento)}</Text>
                <Text style={styles.tableCell}>{item.summary.leads}</Text>
                <Text style={styles.tableCell}>{item.summary.conversoes}</Text>
                <Text style={styles.tableCell}>{formatCurrency(item.summary.faturamento)}</Text>
                <Text style={styles.tableCell}>{formatCurrency(item.summary.cpl)}</Text>
                <Text style={styles.tableCell}>{item.summary.roas > 0 ? item.summary.roas.toFixed(2) : "N/A"}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}

export async function generateAndDownloadPdf(
  overallSummary: MarketingMetrics,
  warnings: InsightWarning[],
  periodChannelSummaries: Array<{ period: string; channel: string; summary: MarketingMetrics }>
) {
  const reportElement = (
    <ExecutiveReportDocument
      overallSummary={overallSummary}
      warnings={warnings}
      periodChannelSummaries={periodChannelSummaries}
    />
  )

  const blob = await pdf(reportElement).toBlob()
  if (!blob) {
    throw new Error("Falha ao gerar o PDF.")
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "relatorio-executivo-martech.pdf"
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
