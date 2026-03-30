"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { InstagramLogo, LinkedinLogo, WhatsappLogo } from "@phosphor-icons/react"

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#121212] pt-24 pb-8 overflow-hidden z-20">
      
      {/* Luz muito sutil de isolamento vindo do fundo (Engine Exhaust effect) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-[#F22471] to-transparent rounded-t-[100%] blur-[120px] opacity-10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col gap-16 md:gap-24">
        
        {/* Top Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Esquerda: Identidade (Ocupando 5 colunas em Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Link href="/" className="inline-block w-fit">
              <img src="/logo-colorida.png" alt="Nexus" className="h-8 md:h-10 w-auto object-contain" />
            </Link>
            <p className="text-white/60 text-base max-w-[300px] leading-relaxed">
              Engenharia de Growth para o mercado High-End.
            </p>
          </div>

          {/* Centro: Navegação Rápida (Ocupando 4 colunas em Desktop) */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:pl-12">
            <span className="text-white/30 font-bold text-[10px] tracking-[0.2em] uppercase">Navegação Rápida</span>
            <nav className="flex flex-col gap-4">
              <Link href="#" className="w-fit text-white/70 hover:text-white transition-colors font-medium">
                O Método Nexus
              </Link>
              <Link href="#" className="w-fit text-white/70 hover:text-white transition-colors font-medium">
                Escala Operacional
              </Link>
              <Link href="#" className="w-fit text-white/70 hover:text-white transition-colors font-medium">
                Diagnóstico de Escala
              </Link>
            </nav>
          </div>

          {/* Direita: Contato & Social (Ocupando 3 colunas em Desktop) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <span className="text-white/30 font-bold text-[10px] tracking-[0.2em] uppercase">Contato Corporativo</span>
            
            {/* Ícones de Rede */}
            <div className="flex items-center gap-3">
              <Link href="#" className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-[#F22471]/10 hover:border-[#F22471]/30 hover:text-[#F22471] transition-all text-white/50">
                <InstagramLogo weight="fill" className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-[#F22471]/10 hover:border-[#F22471]/30 hover:text-[#F22471] transition-all text-white/50">
                <LinkedinLogo weight="fill" className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-[#25D366]/10 hover:border-[#25D366]/30 hover:text-[#25D366] transition-all text-white/50">
                <WhatsappLogo weight="fill" className="w-5 h-5" />
              </Link>
            </div>

            {/* Falar Direto c/ Diretor */}
            <Link href="#" className="group inline-flex items-center gap-2 mt-2 w-fit">
              <span className="text-[#F24639] group-hover:text-[#F22471] font-bold text-sm transition-colors">
                Falar c/ Diretor via WhatsApp
              </span>
              <motion.span 
                className="text-[#F24639] group-hover:text-[#F22471] transition-colors"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
              >
                &rarr;
              </motion.span>
            </Link>
          </div>
          
        </div>

        {/* Linha de Fechamento ("O Easter Egg") */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-8 gap-4 text-center md:text-left">
          
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <span className="text-white/30 text-[10px] md:text-xs font-semibold tracking-[0.15em] uppercase">
              © 2026 Nexus Tecnologias.
            </span>
            <span className="text-white/20 text-[10px] font-mono tracking-widest">
              CNPJ: 59.245.046/0001-13
            </span>
          </div>
          
          {/* Efeito sutil no Easter Egg que brilha em rosa ao passar o mouse confirmando VIP */}
          <span className="text-white/20 hover:text-white/60 transition-colors text-[9px] md:text-[10px] tracking-[0.3em] font-bold uppercase cursor-default group">
            A Premium Implementation. <span className="group-hover:text-[#F22471] group-hover:shadow-[0_0_10px_#F22471] transition-colors duration-500">Strictly Limited Capacity.</span>
          </span>
          
        </div>

      </div>
    </footer>
  )
}
