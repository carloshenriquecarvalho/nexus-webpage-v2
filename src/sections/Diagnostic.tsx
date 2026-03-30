"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, CheckCircle } from "@phosphor-icons/react"
import { Button } from "@/componentes/Button"

// Definindo as animações para transição das etapas do formulário
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
    position: 'absolute' as any
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    position: 'relative' as any
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 40 : -40,
    opacity: 0,
    position: 'absolute' as any
  })
}

export default function Diagnostic() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  
  // Estado para armazenar respostas simuladas
  const [formData, setFormData] = useState({
    nomeClinica: "",
    faturamento: "",
    gargalo: "",
    investimento: "",
    whatsapp: "",
    email: ""
  })

  const nextStep = () => {
    setDirection(1)
    setStep(s => s + 1)
  }

  const prevStep = () => {
    setDirection(-1)
    setStep(s => s - 1)
  }

  // Opções customizadas de rádio
  const OptionCard = ({ field, value, label }: { field: keyof typeof formData, value: string, label: string }) => {
    const isSelected = formData[field] === value
    return (
      <div 
        onClick={() => setFormData({ ...formData, [field]: value })}
        className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
          isSelected 
            ? "bg-[#F22471]/10 border-[#F22471] shadow-[0_0_15px_rgba(242,36,113,0.15)]" 
            : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
        }`}
      >
        <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
          isSelected ? "border-[#F24639]" : "border-white/30"
        }`}>
          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#F24639] to-[#F22471]" />}
        </div>
        <span className={`text-sm md:text-base font-medium ${isSelected ? "text-white" : "text-white/60"}`}>
          {label}
        </span>
      </div>
    )
  }

  return (
    <section className="relative w-full py-32 md:py-48 bg-[#0D0D0D] overflow-hidden flex justify-center">
      
      {/* Aura Subliminar no Centro (Conceito de Filtro de Poder) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#F24639] to-[#F22471] rounded-full blur-[150px] opacity-15 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1400px] px-6 md:px-12 flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
        
        {/* Copywriting de Filtro (Esquerda) */}
        <div className="w-full lg:w-[45%] flex flex-col gap-6 pt-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[10px] uppercase font-bold tracking-[0.2em] text-white/50 w-fit"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F22471] animate-pulse" />
            Diagnóstico de Viabilidade
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05]"
          >
            Sua operação está <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F24639] to-[#F22471]">pronta para o próximo nível?</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-white/70 text-base md:text-lg leading-relaxed max-w-[45ch]"
          >
            Não aceitamos todos os projetos. Analisamos detalhadamente a maturidade da sua clínica para garantir que nossa engenharia de growth gere o ROI que exigimos. 
            Preencha o diagnóstico e receba um retorno de viabilidade em até 12 horas.
          </motion.p>
        </div>

        {/* Multi-step Form Component (Direita) */}
        <div className="w-full lg:w-[55%] relative">
          
          {/* Caixa de Vidro Premium do Formulário */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full bg-[#121212]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden relative"
          >
            {/* ProgressBar */}
            <div className="w-full h-1 bg-white/5 rounded-full mb-10 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#F24639] to-[#F22471]"
                initial={{ width: "25%" }}
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

            <div className="relative overflow-hidden min-h-[350px]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                
                {/* ETAPA 1 */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="flex flex-col gap-8 w-full"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-[#F24639] text-sm font-bold tracking-wide">ETAPA 01 DE 04</span>
                      <h3 className="text-white text-2xl font-bold tracking-tight">O Raio-X Inicial</h3>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                         <label className="text-white/60 text-sm font-medium">Nome Oficial da Clínica / Operação</label>
                         <input 
                           type="text" 
                           placeholder="Digite o nome da empresa..."
                           value={formData.nomeClinica}
                           onChange={(e) => setFormData({...formData, nomeClinica: e.target.value})}
                           className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#F22471]/50 focus:bg-white/[0.05] transition-all"
                         />
                      </div>

                      <div className="flex flex-col gap-3">
                         <label className="text-white/60 text-sm font-medium">Faturamento Médio Mensal</label>
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <OptionCard field="faturamento" value="< 50k" label="Até R$ 50k" />
                            <OptionCard field="faturamento" value="50k-150k" label="R$ 50k - R$ 150k" />
                            <OptionCard field="faturamento" value="> 150k" label="Acima de 150k" />
                         </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ETAPA 2 */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="flex flex-col gap-8 w-full"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-[#F24639] text-sm font-bold tracking-wide">ETAPA 02 DE 04</span>
                      <h3 className="text-white text-2xl font-bold tracking-tight">Qual é a dor atual?</h3>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-white/60 text-sm font-medium">Selecione o seu principal gargalo tecnológico ou comercial hoje:</label>
                      <div className="flex flex-col gap-3 mt-2">
                        <OptionCard field="gargalo" value="falta_leads" label="Falta de Volume de Leads na ponta." />
                        <OptionCard field="gargalo" value="leads_sujos" label="Muitos leads curiosos e desqualificados." />
                        <OptionCard field="gargalo" value="agenda_vazia" label="A equipe não consegue converter em agendamento (CRM)." />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ETAPA 3 */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="flex flex-col gap-8 w-full"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-[#F24639] text-sm font-bold tracking-wide">ETAPA 03 DE 04</span>
                      <h3 className="text-white text-2xl font-bold tracking-tight">Capacidade Escalar</h3>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-white/60 text-sm font-medium">Volume disposto para injetar em Tráfego (Mídia) para Escalar:</label>
                      <div className="flex flex-col gap-3 mt-2">
                        <OptionCard field="investimento" value="iniciante" label="Conservador: R$ 2.000 a R$ 5.000 / mês" />
                        <OptionCard field="investimento" value="mediano" label="Agressivo: R$ 5.000 a R$ 15.000 / mês" />
                        <OptionCard field="investimento" value="avancado" label="Poder de Aquisição Total: +R$ 15.000 / mês" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ETAPA 4 */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="flex flex-col gap-8 w-full"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-[#F24639] text-sm font-bold tracking-wide">ETAPA 04 DE 04</span>
                      <h3 className="text-white text-2xl font-bold tracking-tight">Contato do Diretor</h3>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                         <label className="text-white/60 text-sm font-medium">WhatsApp Direto</label>
                         <input 
                           type="tel" 
                           placeholder="(00) 00000-0000"
                           value={formData.whatsapp}
                           onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                           className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#F22471]/50 focus:bg-white/[0.05] transition-all"
                         />
                      </div>
                      <div className="flex flex-col gap-2">
                         <label className="text-white/60 text-sm font-medium">E-mail Comercial Oficial</label>
                         <input 
                           type="email" 
                           placeholder="nome@suaclinica.com.br"
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#F22471]/50 focus:bg-white/[0.05] transition-all"
                         />
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Controles do Multi-step */}
            <div className="flex items-center justify-between pt-8 mt-4 border-t border-white/10">
              {step > 1 ? (
                <button 
                  onClick={prevStep}
                  className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                >
                  <ArrowLeft weight="bold" />
                  <span className="font-medium text-sm">Voltar</span>
                </button>
              ) : <div />}

              {step < 4 ? (
                <button 
                  onClick={nextStep}
                  // Botão desativado temporariamente visualmente se inputs estiverem vazios na demo (se quiser rigor)
                  className="inline-flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-medium transition-all"
                >
                  <span>Continuar</span>
                  <ArrowRight weight="bold" />
                </button>
              ) : (
                <Button 
                  className="gap-2 text-sm md:text-base py-4 md:py-4 px-6 md:px-8 shadow-[0_0_35px_-5px_#F22471] brightness-110"
                >
                  <CheckCircle weight="fill" className="w-5 h-5 text-white" />
                  Enviar Diagnóstico para Análise
                </Button>
              )}
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  )
}
