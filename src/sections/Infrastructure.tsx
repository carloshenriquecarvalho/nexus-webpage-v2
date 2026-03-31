"use client"

import { motion, Variants } from "framer-motion"
import { Crosshair, Aperture, Lightning, TrendUp } from "@phosphor-icons/react"
import { ServiceCard } from "@/components/ServiceCard"

const services = [
  {
    category: "Tráfego de Precisão (Google & Meta)",
    title: "Aquisição de Intenção Alta.",
    desc: "Não queimamos verba com cliques curiosos. Implementamos um framework de lances inteligentes focado em atrair pacientes que já estão prontos para agendar.",
    icon: Crosshair
  },
  {
    category: "High-Conv Assets (Criativos)",
    title: "Design que Eleva o Ticket.",
    desc: "Criativos de elite que protegem o posicionamento premium da sua clínica enquanto convertem. Anúncios validados para quebrar objeções antes mesmo do primeiro clique.",
    icon: Aperture
  },
  {
    category: "Sales Ops & CRM (Automação)",
    title: "Inteligência de Conversão.",
    desc: "Lead no WhatsApp não é dinheiro no bolso. Estruturamos réguas de automação e CRM para garantir que nenhum interessado fique sem resposta e toda oportunidade vire agendamento.",
    icon: Lightning
  },
  {
    category: "Landing Pages de Performance",
    title: "Arquitetura de Persuasão.",
    desc: "Desenvolvemos páginas com tempo de carregamento sub-2s e copywriting focado em conversão direta. Estruturas de 'Zero Friction' para o agendamento do seu paciente.",
    icon: TrendUp
  }
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

export default function Infrastructure() {
  return (
    <section className="relative w-full py-32 md:py-48 bg-[#121212] overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[400px] bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-full blur-[100px]" />

      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col gap-20 z-10">
        
        <div className="flex flex-col max-w-3xl gap-4">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-white/50 text-xs md:text-sm font-bold tracking-[0.2em] uppercase"
          >
            Infraestrutura de Escala
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-white text-4xl md:text-5xl font-bold tracking-tighter leading-tight"
          >
            O Fim dos Gargalos Operacionais.
          </motion.h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((item, idx) => (
            <ServiceCard 
              key={idx}
              category={item.category}
              title={item.title}
              desc={item.desc}
              icon={item.icon}
              variants={itemVariants}
            />
          ))}
        </motion.div>

      </div>
    </section>
  )
}
