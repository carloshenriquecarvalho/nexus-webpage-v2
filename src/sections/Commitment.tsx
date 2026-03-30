"use client"

import { motion } from "framer-motion"
import { Crosshair, ChartLineUp, HardDrives } from "@phosphor-icons/react"
import { BlueprintCard } from "@/componentes/BlueprintCard"

const features = [
  {
    title: "Rigor Analítico",
    icon: Crosshair,
    desc: "Cada centavo investido é rastreado. Tomamos decisões baseadas em probabilidade estatística, eliminando o achismo da sua escala."
  },
  {
    title: "Foco em LTV",
    icon: ChartLineUp,
    desc: "Não buscamos apenas o clique. Estruturamos o funil para que o custo de aquisição (CAC) seja diluído ao longo do tempo de vida do paciente."
  },
  {
    title: "Implementação Ativa",
    icon: HardDrives,
    desc: "Não entregamos relatórios confusos. Entregamos infraestrutura de marketing pronta para rodar e escalar seu faturamento."
  }
]

export default function Commitment() {
  return (
    <section className="relative w-full py-32 md:py-48 bg-[#121212] flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col gap-24 relative z-10">
        
        {/* Header Content */}
        <div className="flex flex-col max-w-4xl gap-6">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tighter leading-[1.05]"
          >
            Somos uma unidade de implementação.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-white/70 text-lg md:text-xl leading-relaxed max-w-[65ch]"
          >
            Enquanto outros prometem &apos;sorte&apos; nos algoritmos, nós aplicamos um framework de engenharia focado em métricas de negócio, não em métricas de vaidade.
          </motion.p>
        </div>

        {/* Blueprint Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-b border-white/5 relative">
          
          {/* Fio de Neônio Abstrato e Sutil (O Blueprint Line Horizontal) */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F24639]/50 to-transparent" />

          {features.map((item, idx) => (
            <BlueprintCard 
              key={idx}
              idx={idx}
              title={item.title}
              desc={item.desc}
              icon={item.icon}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
