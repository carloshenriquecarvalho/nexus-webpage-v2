"use client";

import React, { useRef, useTransition } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag, CreditCard, BellRing, Save, Hash, X } from "lucide-react";
import { toast } from "sonner";
import type { Bill, BillStatus } from "@/types/database";

interface BillEditModalProps {
  bill: Bill;
  updateAction: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  onClose: () => void;
}

export function BillEditModal({ bill, updateAction, onClose }: BillEditModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const actionHandler = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateAction(formData);
      if (result?.error) {
        toast.error("Erro ao atualizar", { description: result.error });
      } else if (result?.success) {
        toast.success("Boleto atualizado!");
        onClose();
      }
    });
  };

  const inputClass = "cursor-text w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#F22471]/50 focus:bg-white/8 transition-all";
  const labelClass = "text-xs font-semibold text-white/50 uppercase tracking-wider";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-lg bg-[#111111] border border-white/10 rounded-3xl p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="font-bold text-white text-lg">Editar Boleto</h2>
            <p className="text-white/40 text-xs mt-0.5">Atualize os dados do lançamento financeiro</p>
          </div>
          <button onClick={onClose} className="cursor-pointer w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X size={16} />
          </button>
        </div>

        <form ref={formRef} action={actionHandler} className="space-y-4">
          <input type="hidden" name="id" value={bill.id} />

          {/* Título */}
          <label className="block space-y-2">
            <span className={labelClass}>Título</span>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input name="title" required defaultValue={bill.title} className={inputClass} placeholder="Título do boleto" />
            </div>
          </label>

          <div className="grid grid-cols-2 gap-4">
            {/* Valor */}
            <label className="block space-y-2">
              <span className={labelClass}>Valor (R$)</span>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input name="amount" type="number" step="0.01" required defaultValue={bill.amount} className={inputClass} />
              </div>
            </label>

            {/* Tag */}
            <label className="block space-y-2">
              <span className={labelClass}>Tag</span>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input name="tag" defaultValue={bill.tag ?? ""} className={inputClass} placeholder="Categoria" />
              </div>
            </label>
          </div>

          {/* Status */}
          <label className="block space-y-2">
            <span className={labelClass}>Status</span>
            <select
              name="status"
              defaultValue={bill.status}
              className="cursor-pointer w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F22471]/50 transition-all appearance-none [&>option]:bg-[#111111]"
            >
              <option value="Pendente">⏳ Aguardando Pagamento</option>
              <option value="Paga">✅ Boleto Pago</option>
              <option value="Vencido">🔴 Em Atraso (Vencido)</option>
            </select>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className={labelClass}>Vencimento</span>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input name="overdue_date" type="date" defaultValue={bill.overdue_date ?? ""} className={`${inputClass} [color-scheme:dark]`} />
              </div>
            </label>
            <label className="block space-y-2">
              <span className={labelClass}>Dt. Pagamento</span>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input name="payment_date" type="date" defaultValue={bill.payment_date ?? ""} className={`${inputClass} [color-scheme:dark]`} />
              </div>
            </label>
          </div>

          <label className="block space-y-2">
            <span className={labelClass}>Data de Notificação</span>
            <div className="relative">
              <BellRing className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F22471]" />
              <input
                name="notification_date"
                type="date"
                defaultValue={bill.notification_date ?? ""}
                className={`cursor-text w-full bg-[#F22471]/5 border border-[#F22471]/20 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#F22471]/60 transition-all [color-scheme:dark]`}
              />
            </div>
          </label>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="cursor-pointer flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-sm text-white/60 hover:text-white">
              Cancelar
            </button>
            <motion.button
              type="submit"
              disabled={isPending}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer flex-1 py-3 rounded-xl bg-gradient-to-r from-[#F24639] to-[#F22471] text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_30px_-10px_#F22471] hover:shadow-[0_0_40px_0px_#F22471] transition-all"
            >
              {isPending ? <span className="animate-pulse">Salvando...</span> : <><Save size={14} /><span>Salvar Alterações</span></>}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
