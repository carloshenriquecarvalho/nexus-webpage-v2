"use client"

import { motion } from "framer-motion"

import { SecondaryNavbar } from "@/components/SecondaryNavbar"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center selection:bg-[var(--accent)] selection:text-white pt-24 pb-32">
      {/* Navigation Layer - Minimalist */}
      <SecondaryNavbar />

      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-[800px] px-6 mt-20"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-16 bg-gradient-to-r from-[#F24639] to-[#F22471] bg-clip-text text-transparent">
          Termos de Prestação de Serviços e Uso
        </h1>
        
        <div className="flex flex-col gap-10 text-zinc-300 leading-relaxed font-light text-lg">
          <p>
            Ao navegar no ecossistema da <strong className="text-white font-medium">Nexus</strong> ou contratar nossos serviços de Premium Implementation, você concorda com os seguintes termos:
          </p>

          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-4 bg-gradient-to-r from-[#F24639] to-[#F22471] bg-clip-text text-transparent w-fit">
              Metodologia Nexus
            </h2>
            <p>
              Todo o framework, scripts de automação e estratégias de growth desenvolvidos pela Nexus são de propriedade intelectual da Nexus Tecnologias. O cliente possui licença de uso vitalícia para os ativos criados especificamente para sua operação.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-4 bg-gradient-to-r from-[#F24639] to-[#F22471] bg-clip-text text-transparent w-fit">
              Responsabilidade de Resultados
            </h2>
            <p>
              O Growth Marketing é uma ciência de otimização contínua. Resultados passados não garantem resultados futuros. A Nexus compromete-se com a execução técnica de elite, mas o sucesso comercial depende da infraestrutura de atendimento do cliente.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-4 bg-gradient-to-r from-[#F24639] to-[#F22471] bg-clip-text text-transparent w-fit">
              Sigilo Comercial
            </h2>
            <p>
              Ambas as partes comprometem-se a manter sigilo absoluto sobre faturamentos, estratégias de anúncios e processos internos revelados durante a consultoria.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-4 bg-gradient-to-r from-[#F24639] to-[#F22471] bg-clip-text text-transparent w-fit">
              Jurisdição
            </h2>
            <p>
              Eventuais controvérsias serão resolvidas no foro da sede da Nexus Tecnologias.
            </p>
          </div>
        </div>
      </motion.section>
    </main>
  )
}
