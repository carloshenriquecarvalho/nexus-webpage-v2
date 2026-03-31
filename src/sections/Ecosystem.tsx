"use client"

import { motion } from "framer-motion"
import { Buildings, Hospital, FirstAid, Heartbeat, Stethoscope, Prescription } from "@phosphor-icons/react"

const metrics = [
  { value: "+R$ 15M", label: "Gerados em Faturamento para Clientes." },
  { value: "300%", label: "Aumento Médio de LTV." },
  { value: "ROI 8.5x", label: "Média de retorno sobre investimento em anúncios." }
]

const logos = [
  { icon: Hospital, name: "Instituto Prime" },
  { icon: Heartbeat, name: "Vitae Clinic" },
  { icon: Stethoscope, name: "Advanced Med" },
  { icon: Buildings, name: "Global Health" },
  { icon: FirstAid, name: "Aurora Center" },
  { icon: Prescription, name: "Nova Care" }
]

export default function Ecosystem() {
  return (
    <section className="relative w-full py-32 md:py-48 bg-[#121212] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col gap-24">
        
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-6">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#F24639] to-[#F22471] text-xs font-bold tracking-[0.2em] uppercase"
          >
            Implementação Premium
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white text-3xl md:text-5xl font-bold tracking-tighter leading-tight"
          >
            A engenharia por trás de operações que faturam 7 dígitos.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg md:text-xl leading-relaxed max-w-[50ch]"
          >
            Metodologias aplicadas em clínicas e negócios de alto padrão que buscam previsibilidade, não sorte.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-white/5">
          {metrics.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="flex flex-col items-center text-center gap-3 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#F22471]/0 via-[#F22471]/[0.02] to-transparent group-hover:from-[#F22471]/[0.08] transition-colors duration-500 rounded-3xl -z-10 blur-xl" />
              
              <span className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#F24639] to-[#F22471]">
                {item.value}
              </span>
              <span className="text-white/60 text-sm md:text-base font-medium max-w-[200px] leading-snug">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="w-full flex flex-col items-center gap-12 pt-8">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-12 items-center justify-items-center w-full max-w-6xl">
             {logos.map((logo, idx) => (
               <motion.div 
                 key={idx} 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ duration: 0.8, delay: idx * 0.1, type: "spring", bounce: 0.4 }}
                 className="group flex flex-col items-center justify-center gap-3 opacity-40 hover:opacity-100 transition-all duration-500 cursor-default"
               >
                 <div className="relative flex items-center justify-center">
                   <div className="absolute inset-0 bg-[#F22471] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
                   
                   <logo.icon weight="duotone" className="w-10 h-10 md:w-12 md:h-12 text-white group-hover:text-white transition-colors duration-500 relative z-10" />
                 </div>
                 
                 <span className="text-white/80 group-hover:text-white text-xs md:text-sm font-semibold tracking-wide uppercase whitespace-nowrap text-center transition-colors duration-500">
                   {logo.name}
                 </span>
               </motion.div>
             ))}
          </div>
        </div>

      </div>
    </section>
  )
}
