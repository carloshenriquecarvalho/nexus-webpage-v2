"use client";

import React, { useRef, useTransition, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag, CreditCard, BellRing, Save, Hash, FileText, Upload, X, ShieldCheck, Truck, Receipt, AlertCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import type { Category, CostCenter, Supplier, Bill } from "@/types/database";

interface BillFormProps {
  companyId: string;
  categories: Category[];
  costCenters: CostCenter[];
  suppliers: Supplier[];
  createAction: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  initialData?: Partial<Bill>;
  onClose?: () => void;
}

export function BillForm({ companyId, categories, costCenters, suppliers, createAction, initialData, onClose }: BillFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<File | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [status, setStatus] = useState(initialData?.status || "Pendente");


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Formato inválido", { description: "Apenas arquivos PDF são aceitos." });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande", { description: "O limite é de 5MB." });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Formato inválido", { description: "Apenas arquivos PDF são aceitos." });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande", { description: "O limite é de 5MB." });
        return;
      }
      setSelectedReceipt(file);
    }
  };

  const actionHandler = async (formData: FormData) => {
    formData.append("company_id", companyId);
    if (selectedFile) {
      formData.append("pdf_file", selectedFile);
    }

    if (selectedReceipt) {
      formData.append("receipt_file", selectedReceipt);
    }

    startTransition(async () => {
      try {
        const result = await createAction(formData);
        if (result.error) {
          toast.error("Erro ao salvar", { description: result.error });
        } else if (result.success) {
          toast.success("Conta cadastrada!", { description: "Lançamento realizado com sucesso." });
          formRef.current?.reset();
          setSelectedFile(null);
          setSelectedReceipt(null);
          // Fechar modal após sucesso se onClose existir
          if (onClose) onClose();
        }
      } catch {
        toast.error("Erro inesperado");
      }
    });
  };

  const inputClass = "cursor-text w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#F22471]/50 focus:bg-white/8 transition-all";
  const labelClass = "text-xs font-semibold text-white/50 uppercase tracking-wider";

  return (
    <div className="bg-[#111111] border border-white/8 rounded-3xl p-6 md:p-7 relative">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-white/30 hover:text-white transition-all z-10"
        >
          <X size={20} />
        </button>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Novo Lançamento</h3>
        <p className="text-white/40 text-xs mt-1">
          Gerencie suas contas a pagar com precisão. Anexe o boleto original para maior controle.
        </p>
      </div>


      <form ref={formRef} action={actionHandler} className="space-y-4">
        {/* Descrição */}
        <label className="block space-y-2">
          <span className={labelClass}>Descrição</span>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input name="description" defaultValue={initialData?.description} required className={inputClass} placeholder="Ex: Aluguel Escritório — Abr/2024" />
          </div>
        </label>

        <div className="grid grid-cols-2 gap-4">
          {/* Valor */}
          <label className="block space-y-2">
            <span className={labelClass}>Valor (R$)</span>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input name="amount" defaultValue={initialData?.amount} type="number" step="0.01" required className={inputClass} placeholder="0,00" />
            </div>
          </label>

          {/* Categoria */}
          <label className="block space-y-2">
            <span className={labelClass}>Categoria</span>
            <div className="relative">
              <select
                name="category"
                defaultValue={initialData?.category ?? ""}
                className="cursor-pointer w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F22471]/50 transition-all appearance-none [&>option]:bg-[#111111]"
              >
                <option value="">Nenhuma Categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </label>
        </div>

        {/* Centro de Custo */}
        <label className="block space-y-2">
          <span className={labelClass}>Centro de Custo</span>
          <div className="relative">
            <select
              name="cost_center"
              defaultValue={initialData?.cost_center ?? ""}
              className="cursor-pointer w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F22471]/50 transition-all appearance-none [&>option]:bg-[#111111]"
            >
              <option value="">Nenhum Centro de Custo</option>
              {costCenters.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </label>

        {/* Fornecedor */}
        <label className="block space-y-2">
          <span className={labelClass}>Fornecedor</span>
          <div className="relative">
            <select
              name="supplier"
              defaultValue={initialData?.supplier ?? ""}
              className="cursor-pointer w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F22471]/50 transition-all appearance-none [&>option]:bg-[#111111]"
            >
              <option value="">Nenhum Fornecedor</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        </label>

        {/* Observações */}
        <label className="block space-y-2">
          <span className={labelClass}>Observações</span>
          <textarea 
            name="notes" 
            defaultValue={initialData?.notes ?? ""}
            rows={2} 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#F22471]/50 transition-all resize-none" 
            placeholder="Anotações adicionais sobre o pagamento..."
          />
        </label>

        {/* Status */}
        <label className="block space-y-2">
          <span className={labelClass}>Status</span>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="cursor-pointer w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F22471]/50 transition-all appearance-none [&>option]:bg-[#111111]"
          >
            <option value="Pendente">⏳ Aguardando Pagamento</option>
            <option value="Paga">✅ Conta Paga</option>
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
              <input name="payment_date" type="date" defaultValue={initialData?.payment_date ?? ""} className={`${inputClass} [color-scheme:dark]`} />
            </div>
          </label>
        </div>

        {status === "Paga" && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10"
          >
            <label className="block space-y-2">
              <span className={labelClass}>Multa (R$)</span>
              <div className="relative">
                <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input name="penalty" type="number" step="0.01" className={inputClass} placeholder="0,00" />
              </div>
            </label>
            <label className="block space-y-2">
              <span className={labelClass}>Juros (R$)</span>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input name="interest" type="number" step="0.01" className={inputClass} placeholder="0,00" />
              </div>
            </label>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PDF Attachment */}
          <div className="space-y-2">
            <span className={labelClass}>Anexo (Boleto PDF)</span>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 transition-all h-32 ${
                selectedFile 
                  ? 'bg-emerald-500/5 border-emerald-500/20' 
                  : 'bg-white/2 border-white/10 hover:border-[#F22471]/30 hover:bg-[#F22471]/5'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="application/pdf"
                onChange={handleFileChange}
              />
              {selectedFile ? (
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <p className="text-sm font-medium text-emerald-400 truncate w-full text-center">{selectedFile.name}</p>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                    className="p-1.5 mt-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={18} className="text-white/20 mb-2 group-hover:text-[#F22471] transition-colors" />
                  <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors">Boleto (PDF até 5MB)</p>
                </>
              )}
            </div>
          </div>

          {/* Receipt Attachment (if status === Paga) */}
          {status === "Paga" && (
            <div className="space-y-2">
              <span className={labelClass}>Comprovante (PDF)</span>
              <div 
                className={`relative group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 transition-all h-32 ${
                  selectedReceipt 
                    ? 'bg-indigo-500/5 border-indigo-500/20' 
                    : 'bg-white/2 border-white/10 hover:border-[#F22471]/30 hover:bg-[#F22471]/5 cursor-pointer'
                }`}
              >
                <input 
                  type="file" 
                  name="receipt_file"
                  id="receipt_file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept="application/pdf"
                  onChange={handleReceiptChange}
                />
                {selectedReceipt ? (
                  <div className="flex flex-col items-center gap-2 w-full z-10 pointer-events-none">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <Receipt size={20} />
                    </div>
                    <div className="flex flex-col items-center w-full">
                      <p className="text-sm font-medium text-indigo-400 truncate w-full text-center">{selectedReceipt.name}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedReceipt(null); }}
                      className="p-1.5 mt-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-all pointer-events-auto"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="pointer-events-none flex flex-col items-center">
                    <Upload size={18} className="text-white/20 mb-2 group-hover:text-[#F22471] transition-colors" />
                    <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors">Comprovante</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Recorrência */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Recorrência</p>
                <p className="text-[10px] text-white/30 uppercase">Gerar parcelas mensais</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="is_recurring" 
                className="sr-only peer" 
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>

          {isRecurring && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2 pl-4 border-l-2 border-indigo-500/30"
            >
              <span className={labelClass}>Repetir por quantos meses?</span>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input 
                  name="recurrence_count" 
                  type="number" 
                  min="2" 
                  defaultValue="2"
                  required={isRecurring}
                  className={inputClass} 
                  placeholder="Mínimo 2 meses" 
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Notificação */}
        <label className="block space-y-2 pt-2">
          <span className={labelClass}>Lembrete no Calendar</span>
          <div className="relative">
            <BellRing className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F22471]" />
            <input
              name="notification_date"
              type="date"
              className={`cursor-text w-full bg-[#F22471]/5 border border-[#F22471]/20 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#F22471]/60 transition-all [color-scheme:dark]`}
            />
          </div>
        </label>


        <motion.button
          type="submit"
          disabled={isPending}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-[#F24639] to-[#F22471] text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_20px_40px_-15px_rgba(242,36,113,0.3)] hover:shadow-[0_20px_50px_-10px_rgba(242,36,113,0.5)] transition-all"
        >
          {isPending ? (
            <span className="animate-pulse">Processando...</span>
          ) : (
            <>
              <Save size={16} />
              <span>Concluir Lançamento</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
