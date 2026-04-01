"use client";

import React, { useRef, useTransition } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag, CreditCard, BellRing, Save, Hash } from "lucide-react";
import { toast } from "sonner";

interface BillFormProps {
  companyId: string;
  createAction: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}

export function BillForm({ companyId, createAction }: BillFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const actionHandler = async (formData: FormData) => {
    formData.append("company_id", companyId);
    startTransition(async () => {
      try {
        const result = await createAction(formData);
        if (result.error) {
          toast.error("Erro ao salvar", { description: result.error });
        } else if (result.success) {
          toast.success("Boleto criado!", { description: "Salvo e sincronizado com sucesso." });
          formRef.current?.reset();
        }
      } catch {
        toast.error("Erro inesperado");
      }
    });
  };

  const inputClass = "cursor-text w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#F22471]/50 focus:bg-white/8 transition-all";
  const labelClass = "text-xs font-semibold text-white/50 uppercase tracking-wider";

  return (
    <div className="bg-[#111111] border border-white/8 rounded-3xl p-6 md:p-7">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Novo Boleto</h3>
        <p className="text-white/40 text-xs mt-1">
          Preencha os dados abaixo. Se informar a data de notificação, um evento será criado no Google Calendar.
        </p>
      </div>

      <form ref={formRef} action={actionHandler} className="space-y-4">
        {/* Título */}
        <label className="block space-y-2">
          <span className={labelClass}>Título</span>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input name="title" required className={inputClass} placeholder="Ex: Mensalidade — Acme Corp" />
          </div>
        </label>

        <div className="grid grid-cols-2 gap-4">
          {/* Valor */}
          <label className="block space-y-2">
            <span className={labelClass}>Valor (R$)</span>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input name="amount" type="number" step="0.01" required className={inputClass} placeholder="0,00" />
            </div>
          </label>

          {/* Tag */}
          <label className="block space-y-2">
            <span className={labelClass}>Tag <span className="text-white/30 normal-case font-normal">(opcional)</span></span>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input name="tag" className={inputClass} placeholder="Ex: Marketing" />
            </div>
          </label>
        </div>

        {/* Status */}
        <label className="block space-y-2">
          <span className={labelClass}>Status</span>
          <select
            name="status"
            defaultValue="Pendente"
            className="cursor-pointer w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F22471]/50 transition-all appearance-none [&>option]:bg-[#111111]"
          >
            <option value="Pendente">⏳ Aguardando Pagamento</option>
            <option value="Paga">✅ Boleto Pago</option>
            <option value="Vencido">🔴 Em Atraso (Vencido)</option>
          </select>
        </label>

        <div className="grid grid-cols-2 gap-4">
          {/* Vencimento */}
          <label className="block space-y-2">
            <span className={labelClass}>Vencimento</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input name="overdue_date" type="date" className={`${inputClass} [color-scheme:dark]`} />
            </div>
          </label>

          {/* Data de Pagamento */}
          <label className="block space-y-2">
            <span className={labelClass}>Dt. Pagamento</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input name="payment_date" type="date" className={`${inputClass} [color-scheme:dark]`} />
            </div>
          </label>
        </div>

        {/* Notificação */}
        <label className="block space-y-2">
          <span className={labelClass}>Data de Notificação</span>
          <div className="relative">
            <BellRing className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F22471]" />
            <input
              name="notification_date"
              type="date"
              className={`cursor-text w-full bg-[#F22471]/5 border border-[#F22471]/20 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#F22471]/60 transition-all [color-scheme:dark]`}
            />
          </div>
          <p className="text-xs text-white/30">Se preenchida, cria um evento no Google Calendar automaticamente.</p>
        </label>

        <motion.button
          type="submit"
          disabled={isPending}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F24639] to-[#F22471] text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_30px_-10px_#F22471] hover:shadow-[0_0_40px_-5px_#F22471] transition-all"
        >
          {isPending ? (
            <span className="animate-pulse">Processando...</span>
          ) : (
            <>
              <Save size={15} />
              <span>Salvar e Sincronizar</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
