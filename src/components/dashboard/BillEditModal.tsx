"use client";

import React, { useRef, useTransition, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag, CreditCard, BellRing, Save, Hash, X, FileText, Upload, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { Bill } from "@/types/database";

interface BillEditModalProps {
  bill: Bill;
  updateAction: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  onClose: () => void;
}

export function BillEditModal({ bill, updateAction, onClose }: BillEditModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Formato inválido", { description: "Apenas arquivos PDF são aceitos." });
        return;
      }
      setSelectedFile(file);
    }
  };

  const actionHandler = async (formData: FormData) => {
    if (selectedFile) {
      formData.append("pdf_file", selectedFile);
    }
    if (bill.pdf_url) {
      formData.append("existing_pdf_url", bill.pdf_url);
    }

    startTransition(async () => {
      const result = await updateAction(formData);
      if (result?.error) {
        toast.error("Erro ao atualizar", { description: result.error });
      } else if (result?.success) {
        toast.success("Dados atualizados!");
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
        className="w-full max-w-lg bg-[#111111] border border-white/10 rounded-3xl p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="font-bold text-white text-lg tracking-tight">Editar Lançamento</h2>
            <p className="text-white/40 text-xs mt-0.5">Atualize os detalhes da conta a pagar</p>
          </div>
          <button onClick={onClose} className="cursor-pointer w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X size={16} />
          </button>
        </div>

        <form ref={formRef} action={actionHandler} className="space-y-4">
          <input type="hidden" name="id" value={bill.id} />

          {/* Descrição */}
          <label className="block space-y-2">
            <span className={labelClass}>Descrição</span>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input name="description" required defaultValue={bill.description} className={inputClass} placeholder="Descrição da conta" />
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

            {/* Categoria */}
            <label className="block space-y-2">
              <span className={labelClass}>Categoria</span>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input name="category" defaultValue={bill.category ?? ""} className={inputClass} placeholder="Ex: Fixa" />
              </div>
            </label>
          </div>

          {/* Centro de Custo */}
          <label className="block space-y-2">
            <span className={labelClass}>Centro de Custo</span>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input name="cost_center" defaultValue={bill.cost_center ?? ""} className={inputClass} placeholder="Ex: Matriz" />
            </div>
          </label>

          {/* Status */}
          <label className="block space-y-2">
            <span className={labelClass}>Status</span>
            <select
              name="status"
              defaultValue={bill.status}
              className="cursor-pointer w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F22471]/50 transition-all appearance-none [&>option]:bg-[#111111]"
            >
              <option value="Pendente">⏳ Aguardando Pagamento</option>
              <option value="Paga">✅ Conta Paga</option>
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

          {/* PDF Attachment in Edit */}
          <div className="space-y-2">
            <span className={labelClass}>Anexo (PDF)</span>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 transition-all ${
                selectedFile || bill.pdf_url 
                  ? 'bg-emerald-500/5 border-emerald-500/20' 
                  : 'bg-white/2 border-white/10 hover:border-[#F22471]/30 hover:bg-[#F22471]/5'
              }`}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" onChange={handleFileChange} />
              
              {selectedFile ? (
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-emerald-400 truncate text-left">{selectedFile.name}</p>
                    <p className="text-[10px] text-white/30 uppercase text-left">Novo arquivo selecionado</p>
                  </div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }} className="p-1.5 rounded-md hover:bg-white/10 text-white/30 hover:text-white transition-all">
                    <X size={14} />
                  </button>
                </div>
              ) : bill.pdf_url ? (
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-400 truncate text-left">Boleto Anexado</p>
                    <p className="text-[10px] text-white/30 uppercase text-left tracking-wider">Clique para substituir</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload size={18} className="text-white/20 mb-2 group-hover:text-[#F22471] transition-colors" />
                  <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors">Anexar boleto PDF</p>
                </>
              )}
            </div>
          </div>

          <label className="block space-y-2">
            <span className={labelClass}>Lembrete no Calendar</span>
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

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="cursor-pointer flex-1 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-sm font-semibold text-white/60 hover:text-white">
              Cancelar
            </button>
            <motion.button
              type="submit"
              disabled={isPending}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#F24639] to-[#F22471] text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_20px_40px_-15px_rgba(242,36,113,0.3)] hover:shadow-[0_20px_50px_-10px_rgba(242,36,113,0.5)] transition-all"
            >
              {isPending ? <span className="animate-pulse">Salvando...</span> : <><Save size={16} /><span>Salvar</span></>}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
