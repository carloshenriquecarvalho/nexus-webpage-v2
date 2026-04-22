"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Tag, Hash, Truck } from "lucide-react";
import { toast } from "sonner";
import type { Category, CostCenter, Supplier } from "@/types/database";

interface SettingsModalProps {
  categories: Category[];
  costCenters: CostCenter[];
  suppliers: Supplier[];
  createCategoryAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  deleteCategoryAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  createCostCenterAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  deleteCostCenterAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  createSupplierAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  deleteSupplierAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  onClose: () => void;
}

export function SettingsModal({
  categories,
  costCenters,
  suppliers,
  createCategoryAction,
  deleteCategoryAction,
  createCostCenterAction,
  deleteCostCenterAction,
  createSupplierAction,
  deleteSupplierAction,
  onClose,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"categories" | "costCenters" | "suppliers">("categories");
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const action = 
      activeTab === "categories" ? createCategoryAction : 
      activeTab === "costCenters" ? createCostCenterAction : 
      createSupplierAction;

    startTransition(async () => {
      const result = await action(formData);
      if (result.error) {
        toast.error("Erro", { description: result.error });
      } else {
        toast.success("Adicionado com sucesso!");
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  const handleDelete = (id: string) => {
    const action = 
      activeTab === "categories" ? deleteCategoryAction : 
      activeTab === "costCenters" ? deleteCostCenterAction : 
      deleteSupplierAction;
      
    const formData = new FormData();
    formData.append("id", id);

    startTransition(async () => {
      const result = await action(formData);
      if (result.error) {
        toast.error("Erro ao deletar", { description: result.error });
      } else {
        toast.success("Removido com sucesso!");
      }
    });
  };

  const list = 
    activeTab === "categories" ? categories : 
    activeTab === "costCenters" ? costCenters : 
    suppliers;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg z-10 bg-[#111111] border border-white/8 rounded-3xl p-6 md:p-7 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-white/30 hover:text-white transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-white">Configurações Financeiras</h3>
          <p className="text-white/40 text-xs mt-1">
            Padronize as categorias e centros de custo da sua equipe.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "categories"
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/40 hover:text-white/80"
            }`}
          >
            Categorias
          </button>
          <button
            onClick={() => setActiveTab("costCenters")}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "costCenters"
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/40 hover:text-white/80"
            }`}
          >
            Centros de Custo
          </button>
          <button
            onClick={() => setActiveTab("suppliers")}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "suppliers"
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/40 hover:text-white/80"
            }`}
          >
            Fornecedores
          </button>
        </div>

        {/* Form Add */}
        <form onSubmit={handleCreate} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            {activeTab === "categories" && <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />}
            {activeTab === "costCenters" && <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />}
            {activeTab === "suppliers" && <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />}
            <input
              name="name"
              required
              disabled={isPending}
              placeholder={`Novo(a) ${activeTab === "categories" ? "Categoria" : activeTab === "costCenters" ? "Centro de Custo" : "Fornecedor"}...`}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#F22471]/50 focus:bg-white/8 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 rounded-xl bg-gradient-to-r from-[#F24639] to-[#F22471] text-white font-bold text-sm shadow-[0_15px_30px_-10px_rgba(242,36,113,0.3)] hover:shadow-[0_15px_40px_-5px_rgba(242,36,113,0.5)] transition-all disabled:opacity-50 flex items-center justify-center"
          >
            <Plus size={18} />
          </button>
        </form>

        {/* List */}
        <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {list.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center"
              >
                <p className="text-white/30 text-sm">Nenhum item cadastrado.</p>
              </motion.div>
            ) : (
              list.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-white/20 transition-all"
                >
                  <span className="text-sm font-medium text-white/90">{item.name}</span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isPending}
                    className="p-1.5 rounded-md text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
