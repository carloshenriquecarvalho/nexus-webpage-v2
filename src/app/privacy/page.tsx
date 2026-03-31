"use client"

import { motion } from "framer-motion"

import { SecondaryNavbar } from "@/components/SecondaryNavbar"

export default function PrivacyPage() {
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
          Privacidade e Governança de Dados
        </h1>
        
        <div className="flex flex-col gap-10 text-zinc-300 leading-relaxed font-light text-lg">
          <p>
            Na <strong className="text-white font-medium">Nexus Tecnologias</strong>, a segurança da informação é um pilar da nossa engenharia. Esta política detalha como tratamos os dados coletados para fins de otimização de marketing e gestão de leads.
          </p>

          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-4 bg-gradient-to-r from-[#F24639] to-[#F22471] bg-clip-text text-transparent w-fit">
              Coleta de Dados
            </h2>
            <p>
              Coletamos informações de contato (nome, e-mail, telefone) e dados de navegação estritamente para converter interessados em pacientes reais.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-4 bg-gradient-to-r from-[#F24639] to-[#F22471] bg-clip-text text-transparent w-fit">
              Finalidade
            </h2>
            <p>
              Os dados são utilizados para personalização de anúncios, automação de CRM e análise de ROI (Retorno sobre Investimento).
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-4 bg-gradient-to-r from-[#F24639] to-[#F22471] bg-clip-text text-transparent w-fit">
              Proteção
            </h2>
            <p>
              Utilizamos protocolos de criptografia e integradores de dados seguros. Não vendemos ou compartilhamos bases de dados com terceiros.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-4 bg-gradient-to-r from-[#F24639] to-[#F22471] bg-clip-text text-transparent w-fit">
              Direitos do Usuário
            </h2>
            <p>
              Em conformidade com a LGPD, o titular dos dados pode solicitar o acesso, retificação ou exclusão de suas informações a qualquer momento através do nosso canal de suporte.
            </p>
          </div>
        </div>
      </motion.section>
    </main>
  )
}
