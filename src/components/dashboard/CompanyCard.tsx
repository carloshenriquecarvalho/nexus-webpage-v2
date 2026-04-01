"use client";

import React, { useTransition } from "react";
import { motion } from "framer-motion";
import { Building2, Pencil, Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { Company } from "@/types/database";

interface CompanyCardProps {
  company: Company;
  billCount?: number;
  pendingCount?: number;
  totalAmount?: number;
  isSelected?: boolean;
  onSelect: () => void;
  onEdit: () => void;
  deleteAction: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export function CompanyCard({
  company, billCount = 0, pendingCount = 0, totalAmount = 0,
  isSelected, onSelect, onEdit, deleteAction
}: CompanyCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (formData: FormData) => {
    if (!confirm(`Excluir "${company.name}" e todos os seus boletos? Esta ação não pode ser desfeita.`)) return;
    startTransition(async () => {
      const result = await deleteAction(formData);
      if (result?.error) toast.error("Erro ao excluir", { description: result.error });
      else toast.success("Empresa removida.");
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
      className={`cursor-pointer group relative bg-[#111111] border rounded-2xl p-5 transition-all duration-300 ${
        isSelected
          ? "border-[#F22471]/50 shadow-[0_0_30px_-8px_rgba(242,36,113,0.3)]"
          : "border-white/8 hover:border-white/15"
      }`}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-gradient-to-b from-[#F24639] to-[#F22471] rounded-r-full" />
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              className="w-11 h-11 rounded-xl object-cover border border-white/10 flex-shrink-0"
            />
          ) : (
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all ${
              isSelected
                ? "bg-gradient-to-br from-[#F24639]/20 to-[#F22471]/20 border-[#F22471]/30"
                : "bg-white/5 border-white/10"
            }`}>
              <Building2 size={20} className={isSelected ? "text-[#F22471]" : "text-white/40"} />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-white truncate">{company.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-white/40">
                {billCount === 0 ? "Nenhum boleto" : `${billCount} boleto${billCount > 1 ? "s" : ""}`}
              </span>
              {pendingCount > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  {pendingCount} pendente{pendingCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {totalAmount > 0 && (
            <span className="text-sm font-semibold text-white/70 hidden sm:block">
              {formatCurrency(totalAmount)}
            </span>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
            <button
              onClick={onEdit}
              className="cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              title="Editar"
            >
              <Pencil size={13} />
            </button>
            <form action={handleDelete}>
              <input type="hidden" name="id" value={company.id} />
              <button
                type="submit"
                disabled={isPending}
                className="cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-30"
                title="Excluir"
              >
                <Trash2 size={13} />
              </button>
            </form>
          </div>

          <ChevronRight size={14} className={`transition-all ${isSelected ? "text-[#F22471]" : "text-white/20 group-hover:text-white/40"}`} />
        </div>
      </div>
    </motion.div>
  );
}
