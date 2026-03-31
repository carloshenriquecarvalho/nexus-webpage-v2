"use client"

import { motion } from "framer-motion"
import { CheckCircle, MagnifyingGlass, Flask, WhatsappLogo, ArrowRight } from "@phosphor-icons/react"
import { SecondaryNavbar } from "@/components/SecondaryNavbar"

export default function ThanksPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center selection:bg-[var(--accent)] selection:text-white pt-32 pb-24 overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#F24639] to-[#F22471] rounded-full blur-[180px] opacity-[0.05] pointer-events-none" />

      {/* Navigation Layer - Minimalist */}
      <SecondaryNavbar />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 mt-10 md:mt-20 flex flex-col items-center text-center">
        
        {/* Radar / Check Animation */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center mb-12"
        >
          {/* Radar Waves */}
          <motion.div 
            animate={{ scale: [1, 1.8, 2.5], opacity: [0.6, 0.2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-[#F22471]"
          />
          <motion.div 
            animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
            className="absolute inset-0 rounded-full border border-[#F24639]"
          />
          
          {/* Core Check Icon */}
          <div className="relative z-10 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-[#F24639] to-[#F22471] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(242,36,113,0.4)]">
            <CheckCircle weight="bold" className="text-white w-10 h-10 md:w-12 md:h-12" />
          </div>
        </motion.div>

        {/* Copywriting de Elite */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-3xl mb-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-6">
            Diagnóstico Recebido. <br/>
            <span className="bg-gradient-to-r from-[#F24639] to-[#F22471] bg-clip-text text-transparent">Iniciando Análise Técnica.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-light">
            Carlos Henrique e o time de engenharia da Nexus já receberam seus dados. Não fazemos ligações de vendas genéricas; estudamos sua operação rigorosamente antes de falar com você.
          </p>
        </motion.div>

        {/* O "Roadmap" de Espera (Bento Grid Pequeno) */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 text-left"
        >
          {/* Step 1 */}
          <div className="bento-card relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F24639]/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#F24639]/10 transition-colors" />
            <MagnifyingGlass size={36} weight="light" className="text-[#F24639] mb-6" />
            <div className="text-[#F24639] text-xs font-bold tracking-[0.2em] mb-4 font-mono">0-4 HORAS</div>
            <h4 className="text-xl md:text-2xl font-medium text-white mb-3">Auditoria Interna</h4>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-light">
              Analisamos seu nicho e presença digital atual detalhadamente.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bento-card relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F22471]/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#F22471]/10 transition-colors" />
            <Flask size={36} weight="light" className="text-[#F22471] mb-6" />
            <div className="text-[#F22471] text-xs font-bold tracking-[0.2em] mb-4 font-mono">4-8 HORAS</div>
            <h4 className="text-xl md:text-2xl font-medium text-white mb-3">Validação de Viabilidade</h4>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-light">
              Verificamos se nossa engenharia consegue gerar ROI imediato para você.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bento-card relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F24639]/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#F24639]/10 transition-colors" />
            <WhatsappLogo size={36} weight="light" className="text-[#F24639] mb-6" />
            <div className="text-[#F24639] text-xs font-bold tracking-[0.2em] mb-4 font-mono">MÁX. 12 HORAS</div>
            <h4 className="text-xl md:text-2xl font-medium text-white mb-3">O Contato</h4>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-light">
              Você receberá uma mensagem via WhatsApp para agendarmos a Reunião.
            </p>
          </div>
        </motion.div>

        {/* O Botão "Enquanto Isso" (Conteúdo de Autoridade) */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <span className="text-white/50 text-sm font-medium tracking-widest uppercase mb-6">Enquanto aguarda</span>
          <motion.a 
            href="/method"
            className="cursor-pointer px-10 py-5 border border-white/10 bg-white/[0.03] text-white font-medium rounded-2xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 text-lg flex items-center gap-3 group liquid-glass"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Acessar nosso Método Detalhado
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 text-[#F24639] transition-transform" />
          </motion.a>
        </motion.div>

      </div>
    </main>
  )
}
