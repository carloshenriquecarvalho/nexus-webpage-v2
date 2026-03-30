"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/Button"

export default function Hero() {
  const handleScroll = () => {
  const elemento = document.getElementById('method');
  if (elemento) {
    elemento.scrollIntoView();
  }
  };
  return (
    <section className="relative w-full min-h-[100dvh] bg-[#0D0D0D] overflow-hidden flex items-center" id="hero">
      
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
            Saia da increteza do marketing tradicional. Implementamos um framework científico para transformar dados em agenda cheia e faturamento exponencial para clínicas de alto padrão.
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
            <Button onClick={handleScroll}  variant="ghost" className="w-full sm:w-auto">
              Conhecer o Método
            </Button>
          </motion.div>

        </div>

        {/* Lado Direito: O Objeto de Poder (40%) - Otimizado para Performance */}
        <div className="w-full lg:w-[40%] aspect-square relative flex items-center justify-center">
          
          {/* Fundo de luz (Neon Glow) - Estático ou com opacidade simples para poupar GPU */}
          <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-[#F24639] to-[#F22471] rounded-full blur-[120px] opacity-20" />

          {/* Estrutura Geométrica Abstrata com Hardware Acceleration */}
          <div className="relative z-10 w-full h-full flex items-center justify-center transform perspective-1000 [backface-visibility:hidden]">
            
            {/* Núcleo Pulsante Primário */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.7, 0.9, 0.7]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-24 h-24 bg-gradient-to-br from-[#F24639] to-[#F22471] rounded-full blur-md opacity-80 shadow-[0_0_50px_rgba(242,36,113,0.4)] [will-change:transform,opacity]"
            />

            {/* Anel 1 - Externo (Otimizado: Backdrop-blur apenas em Desktop) */}
            <motion.div 
              animate={{ rotateZ: 360, rotateX: 75, rotateY: 15 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-80 h-80 rounded-full border border-white/10 border-t-[#F24639] bg-white/[0.02] lg:backdrop-blur-sm [will-change:transform]"
            />

            {/* Anel 2 - Médio */}
            <motion.div 
              animate={{ rotateZ: -360, rotateX: 65, rotateY: -25 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-60 h-60 rounded-full border border-white/20 border-b-[#F22471] bg-white/[0.03] lg:backdrop-blur-md [will-change:transform]"
            />

            {/* Anel 3 - Interno */}
            <motion.div 
              animate={{ rotateZ: 360, rotateX: 45, rotateY: 45 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute w-40 h-40 rounded-full border border-white/30 border-l-[#F22471] bg-white/[0.05] [will-change:transform]"
            />

            {/* Partículas de Dados (Uso de Hardware Acceleration para evitar stuttering) */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 150, opacity: 0 }}
                animate={{ y: -150, opacity: [0, 1, 0] }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  delay: i * 1,
                  ease: "linear"
                }}
                className="absolute w-1.5 h-1.5 rounded-full bg-[#F24639] shadow-[0_0_10px_#F22471] [will-change:transform,opacity]"
                style={{ left: `calc(50% + ${(i - 2) * 40}px)` }}
              />
            ))}

          </div>

        </div>

      </div>
      
      {/* Isolamento Visual para Soft Transition */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0D0D0D] to-transparent pointer-events-none" />
    </section>
  )
}