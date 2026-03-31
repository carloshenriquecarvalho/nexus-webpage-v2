"use client"

import { motion } from "framer-motion"
import { Crosshair, Target, TrendUp, Cpu, Network } from "@phosphor-icons/react"

import { SecondaryNavbar } from "@/components/SecondaryNavbar"

export default function MethodPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center selection:bg-[var(--accent)] selection:text-white">
      {/* Navigation Layer - Minimalist */}
      <SecondaryNavbar />

      {/* Bloco 1: Hero Técnico (The Core Concept) */}
      <section className="w-full pt-48 pb-32 px-6 flex flex-col items-center text-center border-b border-white/5 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#F24639]/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-4xl mx-auto relative z-10">
          <span className="text-[#F22471] text-sm font-bold tracking-[0.2em] uppercase mb-8 block">
            O Método Nexus
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-white mb-8 leading-[1.05]">
            A Ciência por trás do<br />
            <span className="bg-gradient-to-r from-[#F24639] to-[#F22471] bg-clip-text text-transparent">Crescimento Exponencial.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-3xl mx-auto font-light">
            Não operamos com intuição. Operamos com protocolos de engenharia validados para o mercado High-End.
          </p>
        </motion.div>

        {/* Blueprint Animado (Visual Element) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-24 w-full max-w-5xl h-[400px] lg:h-[500px] relative rounded-[2.5rem] border border-white/10 bg-[#080808] flex items-center justify-center overflow-hidden liquid-glass"
        >
          {/* Blueprint Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* Central Framework Illustration */}
          <div className="relative z-10 flex items-center justify-center gap-4 md:gap-12 w-full px-12">
            {/* Node 1 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-zinc-800 bg-zinc-900/80 flex items-center justify-center mb-4 relative z-10">
                <Crosshair className="text-zinc-500 w-8 h-8 md:w-10 md:h-10" />
              </div>
            </div>

            {/* Glowing Connection Line */}
            <div className="flex-1 h-[2px] bg-gradient-to-r from-[#F24639] to-[#F22471] relative overflow-hidden opacity-80">
              <motion.div 
                animate={{ x: ["-100%", "300%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-1/3 h-full bg-white shadow-[0_0_10px_#fff]"
              />
            </div>

            {/* Node 2 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border border-[#F22471]/40 bg-[#F22471]/10 flex items-center justify-center mb-4 relative z-10 shadow-[0_0_40px_-10px_#F22471]">
                <Cpu className="text-[#F22471] w-10 h-10 md:w-14 md:h-14" />
              </div>
            </div>

            {/* Glowing Connection Line */}
            <div className="flex-1 h-[2px] bg-gradient-to-r from-[#F22471] to-[#F24639] relative overflow-hidden opacity-80">
              <motion.div 
                animate={{ x: ["-100%", "300%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                className="absolute top-0 left-0 w-1/3 h-full bg-white shadow-[0_0_10px_#fff]"
              />
            </div>

            {/* Node 3 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-zinc-800 bg-zinc-900/80 flex items-center justify-center mb-4 relative z-10">
                <Network className="text-zinc-500 w-8 h-8 md:w-10 md:h-10" />
              </div>
            </div>
          </div>

          <div className="absolute font-mono text-zinc-700 text-xs bottom-6 right-8 tracking-widest">
            NEXUS_CORE_v2.4 // STATUS: OPTIMIZED
          </div>
        </motion.div>
      </section>

      {/* Bloco 2: As 4 Fases da Engenharia (Sticky Content) */}
      <section className="w-full py-32 md:py-48 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 lg:gap-32">
        {/* Left: Sticky Title */}
        <div className="w-full lg:w-[40%]">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
            className="sticky top-32"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-6 leading-tight">
              As 4 Fases da <br className="hidden lg:block"/>
              <span className="bg-gradient-to-r from-[#F24639] to-[#F22471] bg-clip-text text-transparent">Engenharia</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed text-lg lg:text-xl font-light">
              Nosso processo é desenhado como uma linha de montagem de alta precisão. Cada etapa é uma camada de proteção e escalabilidade para o seu negócio.
            </p>
          </motion.div>
        </div>

        {/* Right: The Steps */}
        <div className="w-full lg:w-[60%] relative py-10">
          {/* Main Gradient Connection Line */}
          <div className="absolute left-[27px] md:left-[39px] top-12 bottom-12 w-[2px] bg-gradient-to-b from-[#F24639] via-[#F22471] to-[#F24639] opacity-30"></div>

          <div className="flex flex-col gap-24 md:gap-32">
            {/* Step 01 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
              className="relative flex gap-8 md:gap-12"
            >
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#0a0a0a] border border-[#F24639]/30 flex items-center justify-center shrink-0 shadow-[0_0_30px_-10px_#F24639] z-10">
                <span className="text-[#F24639] font-bold font-mono text-lg md:text-xl">01</span>
              </div>
              <div className="pt-2 md:pt-4">
                <span className="text-[#F24639] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                  MAPEAMENTO DE OPORTUNIDADES
                </span>
                <h3 className="text-2xl md:text-3xl font-medium text-white mb-6">Diagnóstico de Ativos <span className="text-zinc-500 font-light block md:inline md:ml-2">(Auditoria)</span></h3>
                <p className="text-zinc-400 leading-relaxed text-lg font-light">
                  Antes de acelerar, verificamos a estrutura. Analisamos seus canais atuais, rastreamento de dados e gargalos de conversão. Não construímos sobre areia.
                </p>
              </div>
            </motion.div>

            {/* Step 02 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
              className="relative flex gap-8 md:gap-12"
            >
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#0a0a0a] border border-[#F22471]/40 flex items-center justify-center shrink-0 shadow-[0_0_30px_-10px_#F22471] z-10">
                <span className="text-[#F22471] font-bold font-mono text-lg md:text-xl">02</span>
              </div>
              <div className="pt-2 md:pt-4">
                <span className="text-[#F22471] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                  DATA-DRIVEN FOUNDATION
                </span>
                <h3 className="text-2xl md:text-3xl font-medium text-white mb-6">Setup de Infraestrutura <span className="text-zinc-500 font-light block md:inline md:ml-2">(Implementação)</span></h3>
                <p className="text-zinc-400 leading-relaxed text-lg font-light">
                  Instalamos a fundação técnica: API de Conversão, Pixel de precisão e integração com CRM. Garantimos que cada centavo investido seja rastreável e otimizável.
                </p>
              </div>
            </motion.div>

            {/* Step 03 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
              className="relative flex gap-8 md:gap-12"
            >
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#0a0a0a] border border-[#F22471]/40 flex items-center justify-center shrink-0 shadow-[0_0_30px_-10px_#F22471] z-10">
                <span className="text-[#F22471] font-bold font-mono text-lg md:text-xl">03</span>
              </div>
              <div className="pt-2 md:pt-4">
                <span className="text-[#F22471] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                  VALIDAÇÃO ESTATÍSTICA
                </span>
                <h3 className="text-2xl md:text-3xl font-medium text-white mb-6">Ciclos de Tração <span className="text-zinc-500 font-light block md:inline md:ml-2">(Escala Segura)</span></h3>
                <p className="text-zinc-400 leading-relaxed text-lg font-light">
                  Iniciamos a fase de testes controlados. Validamos criativos e públicos com baixo risco antes de abrir a torneira do investimento. Foco total em CAC (Custo de Aquisição) saudável.
                </p>
              </div>
            </motion.div>

            {/* Step 04 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
              className="relative flex gap-8 md:gap-12"
            >
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#0a0a0a] border border-[#F24639]/30 flex items-center justify-center shrink-0 shadow-[0_0_30px_-10px_#F24639] z-10">
                <span className="text-[#F24639] font-bold font-mono text-lg md:text-xl">04</span>
              </div>
              <div className="pt-2 md:pt-4">
                <span className="text-[#F24639] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                  MAXIMIZAÇÃO DE LUCRO
                </span>
                <h3 className="text-2xl md:text-3xl font-medium text-white mb-6">Escala e LTV <span className="text-zinc-500 font-light block md:inline md:ml-2">(O Motor Perpétuo)</span></h3>
                <p className="text-zinc-400 leading-relaxed text-lg font-light">
                  Com o método validado, escalamos o faturamento. Implementamos réguas de retenção para que o paciente retorne e indique sua clínica, maximizando o valor de cada cliente conquistado.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Bloco 3: O Diferencial "Premium Implementation" */}
      <section className="w-full py-32 md:py-48 px-6 bg-[#111111] border-y border-white/5 flex justify-center">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
          className="max-w-5xl mx-auto flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-white/[0.03] rounded-2xl border border-white/10 flex items-center justify-center mb-10">
            <Target className="w-10 h-10 text-white opacity-50" weight="light" />
          </div>
          <p className="text-2xl md:text-3xl lg:text-4xl text-zinc-300 leading-tight font-light">
            A maioria das agências entrega apenas <span className="text-zinc-500 line-through">relatórios de cliques</span>. A Nexus entrega uma infraestrutura proprietária. Se o contrato acaba hoje, a inteligência de dados construída permanece na sua clínica. Isso é <span className="bg-gradient-to-r from-[#F24639] to-[#F22471] bg-clip-text text-transparent font-medium">propriedade intelectual</span>, isso é valor de mercado.
          </p>
        </motion.div>
      </section>

      {/* Bloco 4: Call to Action (The Final Push) */}
      <section className="w-full py-40 md:py-56 px-6 bg-[var(--background)] flex justify-center">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
          className="max-w-4xl mx-auto flex flex-col items-center text-center"
        >
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-16 leading-[1.1]">
            Sua clínica está pronta para esse nível de rigor?
          </h2>
          <motion.a 
            href="/#diagnostic"
            className="cursor-pointer px-12 py-6 bg-gradient-to-r from-[#F24639] to-[#F22471] text-white font-bold text-lg md:text-xl rounded-2xl hover:brightness-125 transition-all duration-300 shadow-[0_0_30px_-10px_#F22471] hover:shadow-[0_0_40px_0px_#F22471] group flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Solicitar Diagnóstico
            <TrendUp className="w-6 h-6 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>
      </section>
    </main>
  )
}
