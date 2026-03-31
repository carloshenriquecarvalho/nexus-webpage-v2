"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ChartLineUp, Crown, ShieldCheck } from "@phosphor-icons/react"
import { Button } from "@/components/Button"
import { SecondaryNavbar } from "@/components/SecondaryNavbar"

export default function AboutUs() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Fade In Variant para Conteúdo Surgir ao Rolar
  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  }

  return (
    <main ref={containerRef} className="min-h-screen bg-[var(--background)] flex flex-col items-center selection:bg-[var(--accent)] selection:text-white">
      {/* Navigation Layer - Minimalist */}
      <SecondaryNavbar />

      {/* Bloco 1: Hero Institucional (Split Screen 50/50) */}
      <section className="relative w-full min-h-screen flex flex-col lg:flex-row items-center border-b border-white/5">
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative overflow-hidden bg-[#0a0a0a]">
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "25%"]) }}
            className="absolute inset-0 w-full h-[120%]"
          >
            <Image 
              src="/carlos.png" 
              alt="O Fundador - Nexus"
              fill
              className="object-cover grayscale contrast-125 brightness-90"
              priority
            />
            {/* Gradient Overlay to blend with UI */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[var(--background)] lg:via-[var(--background)]/40 to-transparent opacity-90 lg:opacity-100" />
          </motion.div>
        </div>
        <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}>
            <span className="text-[#F22471] text-sm font-bold tracking-[0.2em] uppercase mb-6 block">
              O Fundador
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-white mb-8 leading-[1.1]">
              A Nexus não nasceu de uma agência.<br />
              <span className="text-zinc-500">Nasceu de um laboratório de engenharia.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl">
              Muitos veem o marketing como sorte. Nós vemos como precisão matemática. A Nexus surgiu da fusão entre o rigor da Engenharia de Computação e a agressividade do Growth Marketing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bloco 2: O Manifesto (Typography Block) */}
      <section className="w-full py-32 md:py-48 bg-[#0D0D0D] px-6 text-center border-b border-white/5 flex justify-center">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-tight">
            Não entregamos anúncios. Entregamos a <span className="bg-gradient-to-r from-[#F24639] to-[#F22471] bg-clip-text text-transparent">infraestrutura de escala</span> que permite que clínicas de alto padrão parem de se preocupar com a próxima venda e foquem na excelência do atendimento.
          </h2>
        </motion.div>
      </section>

      {/* Bloco 3: Pilares de Atuação (Bento Grid) */}
      <section className="w-full py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pilar 1 */}
            <div className="bento-card relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F22471]/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#F22471]/20 transition-colors duration-500" />
              <ChartLineUp size={48} weight="light" className="text-[#F24639] mb-8" />
              <div className="text-zinc-600 text-xs font-bold tracking-widest mb-3 font-mono">01.</div>
              <h4 className="text-2xl font-medium text-white mb-4">Rigor Analítico</h4>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Se não pode ser medido, não pode ser gerenciado. Cada centavo do seu orçamento é rastreado com precisão de engenharia.
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="bento-card relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F24639]/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#F24639]/20 transition-colors duration-500" />
              <Crown size={48} weight="light" className="text-[#F22471] mb-8" />
              <div className="text-zinc-600 text-xs font-bold tracking-widest mb-3 font-mono">02.</div>
              <h4 className="text-2xl font-medium text-white mb-4">Exclusividade</h4>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Trabalhamos com um número estrito de projetos. Sua clínica não é um número; é uma operação que recebe atenção total.
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="bento-card relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F22471]/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#F22471]/20 transition-colors duration-500" />
              <ShieldCheck size={48} weight="light" className="text-[#F24639] mb-8" />
              <div className="text-zinc-600 text-xs font-bold tracking-widest mb-3 font-mono">03.</div>
              <h4 className="text-2xl font-medium text-white mb-4">Transparência</h4>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Esqueça relatórios confusos. Você terá clareza absoluta de cada etapa, sem termos técnicos vazios, apenas ROI real.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bloco 4: Social Proof / Storytelling (O "Porquê") */}
      <section className="w-full py-24 md:py-32 px-6 bg-[var(--background)] flex justify-center">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
          className="max-w-4xl mx-auto"
        >
          <div className="p-10 md:p-16 border border-white/5 rounded-[2.5rem] bg-white/[0.01] liquid-glass relative overflow-hidden">
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#F24639]/5 to-[#F22471]/5 blur-3xl rounded-full" />
            <p className="relative text-xl md:text-3xl text-zinc-300 leading-snug font-light text-center">
              Fundada por Carlos Henrique, a <span className="text-white font-medium">Nexus Growth Marketing</span> é o resultado de uma busca por eficiência. Percebemos que o mercado de clínicas premium sofria com amadorismo e falta de dados. Decidimos mudar o jogo. Hoje, a Nexus é o braço direito de quem busca o que chamamos de <span className="bg-gradient-to-r from-[#F24639] to-[#F22471] bg-clip-text text-transparent font-medium">Premium Implementation</span>: uma execução de elite para quem não aceita menos que o topo.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Bloco 5: CTA de Saída */}
      <section className="w-full py-32 md:py-48 px-6 bg-[#F22471] relative overflow-hidden flex justify-center">
        {/* Abstract Background Design for Elite Feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F24639] to-[#F22471]"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-black/10 via-transparent to-transparent blur-3xl"></div>
        
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center"
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-16 leading-[1.05]">
            Não somos para todos.<br className="hidden md:block" /> Somos para quem está pronto.
          </h2>
          <motion.a 
            href="/#diagnostic"
            className="cursor-pointer px-10 md:px-14 py-6 md:py-8 bg-white text-[#F22471] font-bold rounded-2xl hover:brightness-95 hover:-translate-y-1 transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] text-xl flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Solicitar Diagnóstico de Viabilidade
          </motion.a>
        </motion.div>
      </section>
    </main>
  )
}
