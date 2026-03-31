"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { Funnel, Pulse, Target, Infinity as InfinityIcon } from "@phosphor-icons/react"

const steps = [
  {
    num: "01",
    title: "Aquisição de Precisão",
    subtitle: "Captura de intenção qualificada.",
    icon: Funnel,
    desc: (
      <>
        Identificamos onde seu paciente ideal está e o atraímos com anúncios de alto impacto. Foco total em reduzir o <strong className="text-[#F24639] font-medium">CAC (Custo de Aquisição)</strong> através de <strong className="text-[#F24639] font-medium">testes A/B</strong> constantes e segmentação algorítmica.
      </>
    )
  },
  {
    num: "02",
    title: "Engajamento & Autoridade",
    subtitle: "Construção de confiança pré-venda.",
    icon: Pulse,
    desc: (
      <>
        Um lead frio é um lead caro. Criamos fluxos de nutrição que educam o paciente e elevam o <strong className="text-[#F24639] font-medium">desejo pelo seu serviço</strong> antes mesmo do primeiro contato comercial.
      </>
    )
  },
  {
    num: "03",
    title: "Monetização Estratégica",
    subtitle: "Conversão de alta performance.",
    icon: Target,
    desc: (
      <>
        Páginas de vendas e scripts otimizados. Transformamos o interesse em agendamento confirmado através de <strong className="text-[#F24639] font-medium">gatilhos psicológicos</strong> e infraestrutura de conversão <strong className="text-[#F24639] font-medium">&apos;zero friction&apos;</strong>.
      </>
    )
  },
  {
    num: "04",
    title: "Retenção e LTV",
    subtitle: "O verdadeiro lucro da clínica.",
    icon: InfinityIcon,
    desc: (
      <>
        O lucro real não está na primeira consulta, mas na recorrência. Implementamos réguas de relacionamento e <strong className="text-[#F24639] font-medium">estratégias de upsell</strong> para manter o paciente no seu ecossistema por anos.
      </>
    )
  }
]

export default function Engine() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001
  })

  return (
    <section 
      id="method"
      ref={containerRef}
      className="relative w-full py-32 md:py-48 bg-[#0D0D0D] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      <div className="absolute inset-0 bg-[#0D0D0D] bg-gradient-to-b from-[#0D0D0D] via-transparent to-[#0D0D0D] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col items-center gap-32">
        
        <div className="flex flex-col items-center text-center max-w-4xl gap-6">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tighter leading-[1.05]"
          >
            Do Clique ao LTV Máximo.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-white/70 text-lg md:text-xl leading-relaxed max-w-[65ch]"
          >
            Não operamos com intuição. Seguimos um protocolo rigoroso de 4 fases projetado para extrair a máxima eficiência de cada real investido.
          </motion.p>
        </div>

        <div className="relative w-full max-w-5xl mx-auto flex flex-col gap-12 md:gap-24">
          
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[2px] bg-white/[0.05] -translate-x-1/2" />

          <motion.div 
            style={{ scaleY: smoothProgress, transformOrigin: 'top' }}
            className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[4px] bg-gradient-to-b from-[#F24639] via-[#F22471] to-[#F22471] -translate-x-1/2 shadow-[0_0_20px_#F22471] z-0 rounded-full" 
          />

          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0
            
            return (
              <div 
                key={idx} 
                className={`relative flex flex-col md:flex-row items-center w-full gap-8 md:gap-16 z-10 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                
                <div className="hidden md:block md:w-1/2" />

                <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-[#121212] border-2 border-white/20 -translate-x-1/2 z-20 flex items-center justify-center">
                   {/* Ponto Píxel de Luz dentro do Nó (Acende quando o scroll passa) */}
                   <motion.div 
                     style={{ opacity: useTransform(smoothProgress, [idx * 0.25, (idx + 1) * 0.25], [0, 1]) }}
                     className="w-full h-full bg-[#F24639] rounded-full blur-[2px] shadow-[0_0_15px_#F22471]" 
                   />
                </div>

                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                  className="w-[calc(100%-3rem)] md:w-1/2 ml-12 md:ml-0 group relative"
                >
                  <div className="relative p-8 md:p-12 border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-3xl overflow-hidden hover:bg-white/[0.04] transition-colors duration-500">
                    
                    <div className="absolute -bottom-6 -right-2 text-white/[0.03] text-[10rem] font-black leading-none pointer-events-none tracking-tighter transition-all duration-700 group-hover:text-white/[0.06] group-hover:-translate-y-4">
                      {step.num}
                    </div>

                    <div className="relative z-10 flex flex-col gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 group-hover:border-[#F22471]/30 transition-colors duration-500 backdrop-blur-sm">
                          <step.icon className="w-8 h-8 text-[#F22471]" weight="duotone" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white/50 text-xs md:text-sm uppercase tracking-[0.2em] font-bold">FASE {step.num}</span>
                          <span className="text-[#F24639] text-sm font-medium">{step.subtitle}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 mt-2">
                        <h3 className="text-white text-2xl md:text-3xl font-bold tracking-tight">{step.title}</h3>
                        <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-[40ch]">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
                
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
