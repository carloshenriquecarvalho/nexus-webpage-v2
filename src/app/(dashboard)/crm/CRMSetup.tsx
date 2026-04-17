"use client";

import React, { useState, useTransition } from "react";
import { Building2, Save, Plus, ArrowRight } from "lucide-react";
import { createCompany } from "@/app/(dashboard)/actions";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CRMSetup() {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createCompany(formData);
      if (result.error) {
        toast.error("Erro ao criar empresa", { description: result.error });
      } else {
        toast.success("Empresa criada com sucesso!");
        // Refresh para carregar a página com a empresa
        window.location.reload();
      }
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-[#0a0a0a]">
      <div className="w-full max-w-xl">
        {step === 1 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-2xl">
              <Building2 className="text-[var(--accent)]" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Vamos começar?</h1>
            <p className="text-white/40 text-lg mb-10 max-w-md mx-auto leading-relaxed">
              Para começar a usar o CRM e organizar suas oportunidades, precisamos criar o perfil da sua agência ou clínica.
            </p>
            <button
              onClick={() => setStep(2)}
              className="group relative px-8 py-4 rounded-2xl bg-white text-black font-bold text-lg hover:scale-105 transition-all flex items-center space-x-3 mx-auto shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_60px_rgba(255,255,255,0.2)]"
            >
              <span>Configurar minha empresa</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--accent)]/10 blur-[100px] rounded-full" />
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2">Detalhes da Empresa</h2>
              <p className="text-white/40 text-sm mb-8 font-medium">Isso servirá para identificar seus leads e boletos.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Nome da Empresa</label>
                  <input
                    name="name"
                    required
                    placeholder="Ex: Nexus Growth Agency"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:bg-white/10 transition-all text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">URL do Logo (Opcional)</label>
                  <input
                    name="logo_url"
                    type="url"
                    placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:bg-white/10 transition-all"
                  />
                </div>

                <div className="pt-4 flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-4 rounded-2xl border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all font-bold"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 py-4 rounded-2xl bg-[var(--accent)] text-black font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[0_15px_30px_rgba(var(--accent-rgb),0.3)] hover:scale-[1.02]"
                  >
                    {isPending ? (
                      <span className="animate-pulse">Criando...</span>
                    ) : (
                      <>
                        <Plus size={20} />
                        <span>Criar e Começar</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
