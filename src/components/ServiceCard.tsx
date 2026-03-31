import { motion, Variants } from "framer-motion"
import { Icon } from "@phosphor-icons/react"

interface ServiceCardProps {
  category: string
  title: string
  desc: string
  icon: Icon
  variants?: Variants
}

export function ServiceCard({ category, title, desc, icon: IconComponent, variants }: ServiceCardProps) {
  return (
    <motion.div 
      variants={variants}
      className="group relative p-[1px] rounded-[24px] overflow-hidden bg-white/5 shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#F24639] to-[#F22471] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out z-0" />
      
      <div className="relative z-10 h-full w-full bg-[#000000]/60 backdrop-blur-xl rounded-[23px] p-8 md:p-10 flex flex-col justify-between gap-12 group-hover:bg-[#000000]/70 transition-colors duration-500">
        
        <div className="flex flex-col gap-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 group-hover:border-[#F22471]/40 transition-colors duration-500">
            <IconComponent weight="light" className="w-6 h-6 text-white group-hover:text-[#F22471] transition-colors duration-500" />
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-white/40 text-xs font-semibold tracking-wider uppercase">
              {category}
            </span>
            <h3 className="text-white text-2xl font-bold tracking-tight leading-snug">
              {title}
            </h3>
          </div>
          
          <p className="text-white/60 text-sm md:text-base leading-relaxed">
            {desc}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 group-hover:border-[#F22471]/20 transition-colors duration-500 w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:bg-[#F22471] group-hover:shadow-[0_0_8px_#F22471] transition-all duration-500" />
          <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase">
            Status: Pronto para Implementação
          </span>
        </div>
        
      </div>
    </motion.div>
  )
}
