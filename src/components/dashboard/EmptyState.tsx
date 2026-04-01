import React from "react";
import { FileX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "Nenhum registro encontrado",
  description = "Assim que novos dados forem cadastrados, eles aparecerão aqui.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center rounded-2xl border border-dashed border-white/10 bg-white/2">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F24639]/10 to-[#F22471]/10 border border-[#F22471]/15 flex items-center justify-center mb-5">
        <FileX size={24} className="text-[#F22471]/60" />
      </div>
      <h3 className="text-base font-semibold text-white/80 mb-2">{title}</h3>
      <p className="text-sm text-white/40 max-w-xs leading-relaxed mb-6">{description}</p>
      {action}
    </div>
  );
}
