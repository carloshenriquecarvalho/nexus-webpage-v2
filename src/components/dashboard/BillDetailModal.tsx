"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  X, Calendar, Tag, CreditCard, Hash, FileText, 
  Download, Pencil, CheckCircle2, Clock, AlertCircle 
} from "lucide-react";
import type { Bill, BillStatus } from "@/types/database";
import { getEffectiveStatus } from "@/utils/billUtils";

interface BillDetailModalProps {
  bill: Bill;
  onClose: () => void;
  onEdit: () => void;
}

const statusConfig: Record<BillStatus, { label: string; dot: string; text: string; bg: string; border: string; icon: React.ReactNode }> = {
  Paga: {
    label: "Paga",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-400/8",
    border: "border-emerald-400/20",
    icon: <CheckCircle2 size={14} />,
  },
  Pendente: {
    label: "Pendente",
    dot: "bg-amber-400",
    text: "text-amber-400",
    bg: "bg-amber-400/8",
    border: "border-amber-400/20",
    icon: <Clock size={14} />,
  },
  Vencido: {
    label: "Vencido",
    dot: "bg-[#F24639]",
    text: "text-[#F24639]",
    bg: "bg-[#F24639]/8",
    border: "border-[#F24639]/20",
    icon: <AlertCircle size={14} />,
  },
};

function formatDate(d: string | null | undefined) {
  if (!d) return "Não informado";
  return new Date(d + "T00:00:00").toLocaleDateString("pt-BR", { 
    day: "2-digit", 
    month: "long", 
    year: "numeric" 
  });
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export function BillDetailModal({ bill, onClose, onEdit }: BillDetailModalProps) {
  const status = getEffectiveStatus(bill);
  const s = statusConfig[status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
      >
        {/* Header */}
        <div className="relative p-8 pb-0 flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Detalhes da Conta</p>
            <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
              {bill.description}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="cursor-pointer w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Status & Amount Area */}
          <div className="flex items-center justify-between p-6 rounded-3xl bg-white/3 border border-white/5">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold ${s.text} ${s.bg} ${s.border}`}>
              {s.icon}
              <span className="uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(bill.amount)}</p>
          </div>

          {/* Grid Info */}
          <div className="grid grid-cols-1 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 flex-shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-wider">Data de Vencimento</p>
                <p className="text-sm font-medium text-white/80">{formatDate(bill.overdue_date)}</p>
              </div>
            </div>

            {bill.payment_date && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-400/40 uppercase tracking-wider">Data de Pagamento</p>
                  <p className="text-sm font-medium text-emerald-400/90">{formatDate(bill.payment_date)}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 flex-shrink-0">
                  <Tag size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-wider">Categoria</p>
                  <p className="text-sm font-medium text-white/80">{bill.category || "—"}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 flex-shrink-0">
                  <Hash size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-wider">Centro de Custo</p>
                  <p className="text-sm font-medium text-white/80">{bill.cost_center || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* PDF Section */}
          <div className="pt-4 space-y-4">
            {bill.pdf_url ? (
              <a 
                href={bill.pdf_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all shadow-xl"
              >
                <Download size={18} />
                <span>Baixar Boleto (PDF)</span>
              </a>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/5 text-white/20">
                <FileText size={24} className="mb-2 opacity-50" />
                <p className="text-xs">Nenhum PDF anexado</p>
              </div>
            )}

            <button 
              onClick={() => { onClose(); onEdit(); }}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-white/5 text-white/60 font-bold text-sm hover:bg-white/10 hover:text-white transition-all border border-white/10"
            >
              <Pencil size={18} />
              <span>Editar Informações</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
