'use client';
import { motion } from "framer-motion"
import { ShieldCheck, FileText, Sparkles } from "lucide-react"
export default function MartechLabSection() {
  const features = [
    {
      title: "Normalização Inteligente",
      description:
        "Esqueça a bagunça de planilhas. Nossa engine identifica semânticamente seus dados de qualquer plataforma e normaliza o histórico para uma visão clara do seu funil de vendas.",
      icon: Sparkles,
    },
    {
      title: "Algoritmo de Alertas",
      description:
        "Detectamos vazamentos no seu funil antes que eles queimem seu budget. Alertas automáticos de severidade indicam exatamente onde otimizar e onde escalar.",
      icon: ShieldCheck,
    },
    {
      title: "Relatórios de Diretoria",
      description:
        "Transforme dados complexos em decisões simples. Exporte relatórios executivos em PDF com recomendações estratégicas prontas para reuniões de escala.",
      icon: FileText,
    },
  ]

  return (
    <motion.section
      id="martech-lab"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className="relative overflow-hidden bg-[#0D0D0D] px-6 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 xl:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-zinc-400">
              TECNOLOGIA EXCLUSIVA NEXUS
            </div>
            <div className="space-y-6">
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Pare de adivinhar. Comece a lucrar com inteligência de dados real.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
                Métricas isoladas mentem. Um CPL baixo não garante lucro se a conversão falha ou se o faturamento não escala. O Martech Lab é a nossa resposta à complexidade do tráfego pago: um sistema proprietário que cruza dados de investimento, leads e faturamento para entregar diagnósticos brutais e acionáveis em segundos. Não entregamos apenas relatórios; entregamos o caminho para a escala sustentável.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="/martech-lab"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#F24639] to-[#F22471] px-7 py-3 text-sm font-semibold text-[#0d0d0d] transition hover:brightness-110"
              >
                Analisar minha performance agora
              </a>
              <a
                href="#diagnostic"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Ver diagnóstico rápido
              </a>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="group rounded-[1.75rem] border border-white/10 bg-[#111111] p-6 shadow-[0_20px_60px_rgba(242,36,113,0.12)] transition-all hover:border-[#F24639]/40"
                  >
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-[#F24639] to-[#F22471] text-white shadow-lg shadow-[#F24639]/20">
                      <Icon size={24} />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{feature.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111111] p-8 shadow-[0_40px_120px_rgba(242,36,113,0.15)]"
          >
            <div className="absolute -right-16 top-8 h-32 w-32 rounded-full bg-[#F24639]/10 blur-2xl" />
            <div className="absolute -left-16 bottom-10 h-28 w-28 rounded-full bg-[#F22471]/10 blur-2xl" />
            <div className="relative z-10 space-y-6">
              <div className="rounded-[1.5rem] bg-[#0B0B0B] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Dashboard Mockup</p>
                    <h3 className="mt-4 text-xl font-semibold text-white">Martech Lab Preview</h3>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-white/5" />
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-[#151515] p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">ROAS</p>
                    <p className="mt-4 text-3xl font-semibold text-white">4.2x</p>
                    <p className="mt-2 text-sm text-zinc-400">Retorno por investimento</p>
                  </div>
                  <div className="rounded-3xl bg-[#151515] p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Faturamento</p>
                    <p className="mt-4 text-3xl font-semibold text-white">R$ 428.000</p>
                    <p className="mt-2 text-sm text-zinc-400">Performance consolidada</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-[1.5rem] bg-[#0B0B0B] p-5">
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span>Taxa de conversão</span>
                    <span className="text-white">5.8%</span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-[#F24639] to-[#F22471]" />
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-[#0B0B0B] p-5">
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span>Leads qualificados</span>
                    <span className="text-white">1.240</span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#F24639] to-[#F22471]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-center text-sm italic text-zinc-500">
          Inteligência de marketing é conectar os pontos, não celebrar números soltos.
        </div>
      </div>
    </motion.section>
  )
}