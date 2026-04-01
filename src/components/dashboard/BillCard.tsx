"use client";

import React, { useTransition } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Trash2, Calendar, Tag, Pencil, CalendarCheck2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { Bill, BillStatus } from "@/types/database";

interface BillCardProps {
  bill: Bill;
  deleteAction: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  onEdit: (bill: Bill) => void;
}

const statusConfig: Record<BillStatus, { label: string; dot: string; text: string; bg: string; border: string; icon: React.ReactNode }> = {
  Paga: {
    label: "Paga",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-400/8",
    border: "border-emerald-400/20",
    icon: <CheckCircle2 size={12} />,
  },
  Pendente: {
    label: "Pendente",
    dot: "bg-amber-400",
    text: "text-amber-400",
    bg: "bg-amber-400/8",
    border: "border-amber-400/20",
    icon: <Clock size={12} />,
  },
  Vencido: {
    label: "Vencido",
    dot: "bg-[#F24639]",
    text: "text-[#F24639]",
    bg: "bg-[#F24639]/8",
    border: "border-[#F24639]/20",
    icon: <AlertCircle size={12} />,
  },
};

function formatDate(d: string | null | undefined) {
  if (!d) return null;
  return new Date(d + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export function BillCard({ bill, deleteAction, onEdit }: BillCardProps) {
  const [isPending, startTransition] = useTransition();
  const s = statusConfig[bill.status];

  const handleDelete = (formData: FormData) => {
    startTransition(async () => {
      const result = await deleteAction(formData);
      if (result?.error) toast.error("Erro ao excluir", { description: result.error });
      else toast.success("Boleto removido.");
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="group flex items-center justify-between gap-3 p-4 bg-white/3 hover:bg-white/6 border border-white/8 hover:border-white/12 rounded-xl transition-all duration-200"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Status badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium flex-shrink-0 ${s.text} ${s.bg} ${s.border}`}>
          {s.icon}
          <span>{s.label}</span>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white/90 truncate leading-tight">{bill.title}</p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {bill.overdue_date && (
              <span className="flex items-center gap-1 text-xs text-white/40">
                <Calendar size={10} />
                <span>Vence {formatDate(bill.overdue_date)}</span>
              </span>
            )}
            {bill.payment_date && (
              <span className="flex items-center gap-1 text-xs text-emerald-400/70">
                <CalendarCheck2 size={10} />
                <span>Pago em {formatDate(bill.payment_date)}</span>
              </span>
            )}
            {bill.tag && (
              <span className="flex items-center gap-1 text-xs text-white/30">
                <Tag size={10} />
                <span>{bill.tag}</span>
              </span>
            )}
            {bill.google_event_id && (
              <span className="text-xs text-[#F22471]/60">● Calendar</span>
            )}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-sm font-bold text-white">{formatCurrency(bill.amount)}</span>

        {/* Hidden action buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(bill)}
            className="cursor-pointer w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"
            title="Editar"
          >
            <Pencil size={12} />
          </button>
          <form action={handleDelete}>
            <input type="hidden" name="id" value={bill.id} />
            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-[#F24639] hover:bg-[#F24639]/10 transition-all disabled:opacity-30"
              title="Excluir"
            >
              <Trash2 size={12} />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
