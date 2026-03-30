"use client"

import { motion } from "framer-motion"
import { Button } from "@/componentes/Button"

export default function Hero() {
  return (
    <section className="relative w-full min-h-[100dvh] bg-[#0D0D0D] overflow-hidden flex items-center">
      
      {/* Container Principal 60/40 */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-16 py-32">
        
        {/* Lado Esquerdo: Textos (60%) */}
        <div className="w-full lg:w-[60%] flex flex-col items-start gap-8 z-20">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white/70 uppercase tracking-[0.3em] font-medium text-xs md:text-sm"
          >
            Nexus • Engenharia de Growth Marketing
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-white text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tighter leading-[1.05]"
          >
            Escalamos sua Clínica com a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F24639] to-[#F22471]">Precisão da Engenharia.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-white/80 text-lg md:text-xl leading-relaxed max-w-[55ch]"
          >
            Saia da incerteza do marketing tradicional. Implementamos um framework científico para transformar dados em agenda cheia e faturamento exponencial para clínicas de alto padrão.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-5 mt-6 w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto">
              Solicitar Diagnóstico de Escala
            </Button>
            <Button variant="ghost" className="w-full sm:w-auto">
              Conhecer o Método
            </Button>
          </motion.div>

        </div>

        {/* Lado Direito: O Objeto de Poder / UAU Element (40%) */}
        <div className="w-full lg:w-[40%] aspect-square relative flex items-center justify-center">
          
          {/* Fundo de luz (Neon Glow) */}
          <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-[#F24639] to-[#F22471] rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDuration: '4s' }} />

          {/* Estrutura Geométrica Abstrata (Funil de Vidro Dinâmico) */}
          <div className="relative z-10 w-full h-full flex items-center justify-center transform perspective-1000">
            
            {/* Núcleo Pulsante Primário */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-24 h-24 bg-gradient-to-br from-[#F24639] to-[#F22471] rounded-full blur-md opacity-90 shadow-[0_0_80px_#F22471]"
            />

            {/* Anel 1 - Externo */}
            <motion.div 
              animate={{ rotateZ: 360, rotateX: 75, rotateY: 15 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-80 h-80 rounded-full border border-white/10 border-t-[#F24639] bg-white/[0.02] backdrop-blur-sm"
            />

            {/* Anel 2 - Médio */}
            <motion.div 
              animate={{ rotateZ: -360, rotateX: 65, rotateY: -25 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-60 h-60 rounded-full border border-white/20 border-b-[#F22471] bg-white/[0.03] backdrop-blur-md shadow-[inset_0_0_30px_rgba(242,36,113,0.2)]"
            />

            {/* Anel 3 - Interno (Mais Rápido) */}
            <motion.div 
              animate={{ rotateZ: 360, rotateX: 45, rotateY: 45 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute w-40 h-40 rounded-full border border-white/30 border-l-[#F22471] bg-white/[0.05] backdrop-blur-lg"
            />

            {/* Partículas de Dados Subindo (Simulando Fluxo de Escala) */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 200, opacity: 0, scale: 0.5 }}
                animate={{ y: -200, opacity: [0, 1, 0], scale: 1 }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  delay: i * 0.7,
                  ease: "easeInOut"
                }}
                className="absolute w-2 h-2 rounded-full bg-[#F24639] shadow-[0_0_10px_#F22471]"
                style={{ left: `calc(50% + ${(i - 2.5) * 30}px)` }}
              />
            ))}

          </div>

        </div>

      </div>
      
      {/* Isolamento Visual para Soft Transition de Fundo */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0D0D0D] to-transparent pointer-events-none" />
    </section>
  )
}
