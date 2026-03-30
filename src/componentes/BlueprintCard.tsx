import { motion } from "framer-motion"
import { Icon } from "@phosphor-icons/react"

interface BlueprintCardProps {
  title: string
  desc: string
  icon: Icon
  idx: number
}

export function BlueprintCard({ title, desc, icon: IconComponent, idx }: BlueprintCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: 0.2 + (idx * 0.1), ease: "easeOut" }}
      className={`flex flex-col gap-8 p-8 md:p-12 relative group ${idx !== 2 ? 'md:border-r border-white/5' : ''}`}
    >
      {/* Vertical Pipeline Hover Effect (Traço vertical Blueprint) */}
      <div className="absolute left-0 top-0 w-[2px] h-0 bg-gradient-to-b from-[#F24639] to-[#F22471] group-hover:h-full transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100" />
      
      {/* Ambiente Escurecido para dar Profundidade no Quadro no Hover */}
      <div className="absolute inset-0 bg-[#0D0D0D]/0 group-hover:bg-[#0D0D0D]/40 transition-colors duration-500 -z-10" />

      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/10 group-hover:border-[#F22471]/30 transition-colors duration-500">
        <IconComponent className="w-7 h-7 text-white group-hover:text-[#F22471] transition-colors duration-500" weight="light" />
      </div>
      
      <div className="flex flex-col gap-4">
        <h3 className="text-white text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-white/60 text-base md:text-lg leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}
