"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, CheckCircle } from "@phosphor-icons/react"
import { Button } from "@/components/Button"

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 15 : -15,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "tween" as const, duration: 0.3 },
      opacity: { duration: 0.2 }
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 15 : -15,
    opacity: 0,
    transition: {
      x: { type: "tween" as const, duration: 0.2 },
      opacity: { duration: 0.2 }
    }
  })
}

export default function Diagnostic() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  
  const [formData, setFormData] = useState({
    nomeClinica: "",
    faturamento: "",
    gargalo: "",
    investimento: "",
    whatsapp: "",
    email: ""
  })

  // Validação por Step
  const isStepValid = useMemo(() => {
    switch (step) {
      case 1:
        return formData.faturamento !== "" && formData.nomeClinica.trim() !== "";
      case 2:
        return formData.gargalo !== "";
      case 3:
        return formData.investimento !== "";
      case 4:
        return formData.whatsapp.trim().length >= 8; // Mínimo para um telefone
      default:
        return false;
    }
  }, [step, formData]);

  const nextStep = useCallback(() => {
    if (!isStepValid) return; // Bloqueio de segurança na função
    setDirection(1)
    setStep(s => s + 1)
  }, [isStepValid])

  const prevStep = useCallback(() => {
    setDirection(-1)
    setStep(s => s - 1)
  }, [])

  const progressScale = useMemo(() => step / 4, [step])

  const OptionCard = ({ field, value, label }: { field: keyof typeof formData, value: string, label: string }) => {
    const isSelected = formData[field] === value
    return (
      <div 
        onClick={() => setFormData(prev => ({ ...prev, [field]: value }))}
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

  const submitForm = () => {
    
    window.open("https://wa.me/556196550552?text=Olá! Vim pelo site e gostaria de solicitar meu diagnóstico de escala.", "_blank");
  }

  return (
    <section className="relative w-full py-32 md:py-48 bg-[#0D0D0D] overflow-hidden flex justify-center" id="diagnostic">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#F24639] to-[#F22471] rounded-full blur-[150px] opacity-15 pointer-events-none [will-change:transform]" />

      <div className="relative z-10 w-full max-w-[1400px] px-6 md:px-12 flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
        
        <div className="w-full lg:w-[45%] flex flex-col gap-6 pt-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[10px] uppercase font-bold tracking-[0.2em] text-white/50 w-fit"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F22471] animate-pulse" />
            Diagnóstico de Viabilidade
          </motion.div>
          
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05]">
            Sua operação está <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F24639] to-[#F22471]">pronta para o próximo nível?</span>
          </h2>

          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-[45ch]">
            Analisamos detalhadamente a maturidade da sua clínica para garantir que nossa engenharia de growth gere o ROI que exigimos.
          </p>
        </div>

        <div className="w-full lg:w-[55%] relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full bg-[#121212]/90 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden relative lg:backdrop-blur-2xl"
          >
            <div className="w-full h-1 bg-white/5 rounded-full mb-10 relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-[#F24639] to-[#F22471] origin-left"
                initial={{ scaleX: 0.25 }}
                animate={{ scaleX: progressScale }}
                transition={{ duration: 0.4, ease: "circOut" }}
              />
            </div>

            <div className="relative min-h-[400px] md:min-h-[350px] [contain:paint]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={step}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full flex flex-col gap-8 [will-change:transform,opacity]"
                >
                  {step === 1 && (
                    <div className="flex flex-col gap-8 w-full">
                      <div className="flex flex-col gap-2">
                        <span className="text-[#F24639] text-sm font-bold tracking-wide uppercase">Etapa 01 de 04</span>
                        <h3 className="text-white text-2xl font-bold tracking-tight">Diagnóstico rápido</h3>
                      </div>
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                           <label className="text-white/60 text-sm font-medium">Nome da clínica *</label>
                           <input 
                             type="text" 
                             placeholder="Digite o nome da clínica..."
                             value={formData.nomeClinica}
                             onChange={(e) => setFormData(prev => ({...prev, nomeClinica: e.target.value}))}
                             className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#F22471]/50 transition-all"
                           />
                        </div>
                        <div className="flex flex-col gap-3">
                           <label className="text-white/60 text-sm font-medium">Quantas consultas sua clínica precisa por mês? *</label>
                           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <OptionCard field="faturamento" value="10-20" label="10-20" />
                              <OptionCard field="faturamento" value="21-35" label="21-35" />
                              <OptionCard field="faturamento" value="36+" label="36+" />
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="flex flex-col gap-8 w-full">
                      <div className="flex flex-col gap-2">
                        <span className="text-[#F24639] text-sm font-bold tracking-wide uppercase">Etapa 02 de 04</span>
                        <h3 className="text-white text-2xl font-bold tracking-tight">Qual é a dor atual?</h3>
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="text-white/60 text-sm font-medium">Qual é o maior problema hoje? *</label>
                        <div className="flex flex-col gap-3 mt-2">
                          <OptionCard field="gargalo" value="agenda_vazia" label="Agenda vazia" />
                          <OptionCard field="gargalo" value="leads_fracos" label="Muitos leads que não convertem" />
                          <OptionCard field="gargalo" value="sem_tempo" label="Sem tempo para cuidar do marketing" />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="flex flex-col gap-8 w-full">
                      <div className="flex flex-col gap-2">
                        <span className="text-[#F24639] text-sm font-bold tracking-wide uppercase">Etapa 03 de 04</span>
                        <h3 className="text-white text-2xl font-bold tracking-tight">Capacidade Escalar</h3>
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="text-white/60 text-sm font-medium">Quanto você já investe ou está disposto a investir em tráfego? *</label>
                        <div className="flex flex-col gap-3 mt-2">
                          <OptionCard field="investimento" value="ate_5000" label="Até R$5.000" />
                          <OptionCard field="investimento" value="5000_15000" label="R$5.000-R$15.000" />
                          <OptionCard field="investimento" value="acima_15000" label="Acima de R$15.000" />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="flex flex-col gap-8 w-full">
                      <div className="flex flex-col gap-2">
                        <span className="text-[#F24639] text-sm font-bold tracking-wide uppercase">Etapa 04 de 04</span>
                        <h3 className="text-white text-2xl font-bold tracking-tight">Melhor contato para você</h3>
                      </div>
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                           <label className="text-white/60 text-sm font-medium">WhatsApp Direto *</label>
                           <input 
                             type="tel" 
                             placeholder="(00) 00000-0000"
                             value={formData.whatsapp}
                             onChange={(e) => setFormData(prev => ({...prev, whatsapp: e.target.value}))}
                             className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#F22471]/50 transition-all"
                           />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-white/60 text-sm font-medium">E-mail Comercial Oficial (Opcional)</label>
                           <input 
                             type="email" 
                             placeholder="nome@suaclinica.com.br"
                             value={formData.email}
                             onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                             className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#F22471]/50 transition-all"
                           />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between pt-8 mt-4 border-t border-white/10">
              {step > 1 ? (
                <button 
                  onClick={prevStep}
                  className="cursor-pointer inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                >
                  <ArrowLeft weight="bold" />
                  <span className="font-medium text-sm">Voltar</span>
                </button>
              ) : <div />}

              {step < 4 ? (
                <button 
                  onClick={nextStep}
                  disabled={!isStepValid}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    isStepValid 
                    ? "text-white bg-white/10 hover:bg-white/20 cursor-pointer" 
                    : "text-white/20 bg-white/[0.02] cursor-not-allowed opacity-50"
                  }`}
                >
                  <span>Continuar</span>
                  <ArrowRight weight="bold" />
                </button>
              ) : (
                <Button 
                  onClick={submitForm}
                  disabled={!isStepValid}
                  className={`inline-flex items-center gap-2 text-sm md:text-base py-3 px-6 md:px-8 shadow-[0_0_35px_-5px_#F22471] ${
                    !isStepValid ? "opacity-50 cursor-not-allowed grayscale" : ""
                  }`}
                >
                  <CheckCircle weight="fill" className="w-5 h-5" />
                  Enviar Diagnóstico
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}