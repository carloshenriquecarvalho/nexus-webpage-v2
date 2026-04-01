"use client";

import React, { useRef, useTransition } from "react";
import { motion } from "framer-motion";
import { Building2, Save, X } from "lucide-react";
import { toast } from "sonner";
import type { Company } from "@/types/database";

interface CompanyFormProps {
  company?: Company;
  createAction: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  updateAction: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  onClose: () => void;
}

export function CompanyForm({ company, createAction, updateAction, onClose }: CompanyFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const isEditing = !!company;

  const actionHandler = async (formData: FormData) => {
    startTransition(async () => {
      const result = await (isEditing ? updateAction : createAction)(formData);
      if (result?.error) {
        toast.error("Erro", { description: result.error });
      } else if (result?.success) {
        toast.success(isEditing ? "Empresa atualizada!" : "Empresa criada!", {
          description: isEditing ? "Alterações salvas com sucesso." : "Nova empresa adicionada ao painel.",
        });
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-md bg-[#111111] border border-white/10 rounded-3xl p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F24639]/20 to-[#F22471]/20 border border-[#F22471]/20 flex items-center justify-center">
              <Building2 size={18} className="text-[#F22471]" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg leading-tight">
                {isEditing ? "Editar Empresa" : "Nova Empresa"}
              </h2>
              <p className="text-white/40 text-xs mt-0.5">
                {isEditing ? "Atualize os dados da empresa" : "Adicione um novo cliente ao painel"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <form ref={formRef} action={actionHandler} className="space-y-5">
          {isEditing && <input type="hidden" name="id" value={company.id} />}

          <label className="block space-y-2">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Nome da Empresa</span>
            <input
              name="name"
              required
              defaultValue={company?.name ?? ""}
              className="cursor-text w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#F22471]/50 focus:bg-white/8 transition-all"
              placeholder="Ex: Clínica Estética Prime"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              URL do Logo <span className="text-white/30 normal-case font-normal">(opcional)</span>
            </span>
            <input
              name="logo_url"
              type="url"
              defaultValue={company?.logo_url ?? ""}
              className="cursor-text w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#F22471]/50 focus:bg-white/8 transition-all"
              placeholder="https://..."
            />
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-sm text-white/60 hover:text-white"
            >
              Cancelar
            </button>
            <motion.button
              type="submit"
              disabled={isPending}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer flex-1 py-3 rounded-xl bg-gradient-to-r from-[#F24639] to-[#F22471] text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_30px_-10px_#F22471] hover:shadow-[0_0_40px_0px_#F22471] hover:brightness-110 transition-all"
            >
              {isPending ? (
                <span className="animate-pulse">Salvando...</span>
              ) : (
                <>
                  <Save size={15} />
                  <span>{isEditing ? "Salvar Alterações" : "Criar Empresa"}</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
