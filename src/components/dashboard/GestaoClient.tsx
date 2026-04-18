"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, TrendingUp, Receipt, AlertCircle } from "lucide-react";
import { CompanyCard } from "@/components/dashboard/CompanyCard";
import { CompanyForm } from "@/components/dashboard/CompanyForm";
import { BillCard } from "@/components/dashboard/BillCard";
import { BillEditModal } from "@/components/dashboard/BillEditModal";
import { BillForm } from "@/components/dashboard/BillForm";
import { EmptyState } from "@/components/dashboard/EmptyState";
import type { Company, Bill } from "@/types/database";

interface GestaoClientProps {
  companies: Company[];
  bills: Bill[];
  createCompanyAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  updateCompanyAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  deleteCompanyAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  createBillAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  updateBillAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  deleteBillAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export function GestaoClient({
  companies, bills,
  createCompanyAction, updateCompanyAction, deleteCompanyAction,
  createBillAction, updateBillAction, deleteBillAction,
}: GestaoClientProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(companies[0]?.id ?? null);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>();
  const [editingBill, setEditingBill] = useState<Bill | undefined>();

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);
  const filteredBills = bills.filter(b => b.company_id === selectedCompanyId);

  // Métricas globais
  const totalPending = bills.filter(b => b.status === "Pendente").length;
  const totalOverdue = bills.filter(b => b.status === "Vencido").length;
  const totalAmount = bills.reduce((sum, b) => sum + Number(b.amount), 0);

  // Métricas por empresa
  const billCountFor = (id: string) => bills.filter(b => b.company_id === id).length;
  const pendingCountFor = (id: string) => bills.filter(b => b.company_id === id && b.status === "Pendente").length;
  const totalAmountFor = (id: string) => bills.filter(b => b.company_id === id).reduce((s, b) => s + Number(b.amount), 0);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10 space-y-8">

      {/* ─── Header ─────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Nexus • Gestão Financeira</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Contas a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F24639] to-[#F22471]">Pagar</span>
          </h1>
        </div>
        <motion.button
          onClick={() => { setEditingCompany(undefined); setShowCompanyForm(true); }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F24639] to-[#F22471] text-white font-semibold text-sm shadow-[0_0_25px_-8px_#F22471] hover:shadow-[0_0_35px_-4px_#F22471] transition-all flex-shrink-0"
        >
          <Plus size={15} />
          <span>Nova Empresa</span>
        </motion.button>
      </div>

      {/* ─── Stats ──────────────────────────────────── */}
      {bills.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Volume Total", value: formatCurrency(totalAmount), icon: <TrendingUp size={15} />, color: "text-white" },
            { label: "Pendentes", value: totalPending, icon: <Receipt size={15} />, color: "text-amber-400" },
            { label: "Vencidos", value: totalOverdue, icon: <AlertCircle size={15} />, color: "text-[#F24639]" },
          ].map(stat => (
            <div key={stat.label} className="bg-[#111111] border border-white/8 rounded-2xl px-4 py-3">
              <div className={`flex items-center gap-1.5 text-xs text-white/40 mb-1`}>
                <span className={stat.color}>{stat.icon}</span>
                <span>{stat.label}</span>
              </div>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ─── Main Layout ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Companies + Bills */}
        <div className="lg:col-span-7 space-y-6">

          {/* Companies */}
          <section>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Empresas Clientes</p>
            {companies.length === 0 ? (
              <EmptyState
                title="Nenhuma empresa cadastrada"
                description="Crie sua primeira empresa para começar a registrar os pagamentos."
                action={
                  <button
                    onClick={() => { setEditingCompany(undefined); setShowCompanyForm(true); }}
                    className="cursor-pointer px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F24639] to-[#F22471] text-white text-sm font-semibold shadow-[0_0_20px_-8px_#F22471] hover:shadow-[0_0_30px_-4px_#F22471] transition-all"
                  >
                    Criar primeira empresa
                  </button>
                }
              />
            ) : (
              <div className="space-y-2">
                {companies.map(company => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    billCount={billCountFor(company.id)}
                    pendingCount={pendingCountFor(company.id)}
                    totalAmount={totalAmountFor(company.id)}
                    isSelected={company.id === selectedCompanyId}
                    onSelect={() => setSelectedCompanyId(company.id)}
                    onEdit={() => { setEditingCompany(company); setShowCompanyForm(true); }}
                    deleteAction={deleteCompanyAction}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Bills */}
          <AnimatePresence mode="wait">
            {selectedCompany && (
              <motion.section
                key={selectedCompany.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                    Contas — <span className="text-[#F22471]">{selectedCompany.name}</span>
                  </p>
                  {filteredBills.length > 0 && (
                    <span className="text-xs text-white/30">{filteredBills.length} registro{filteredBills.length > 1 ? "s" : ""}</span>
                  )}
                </div>
                {filteredBills.length === 0 ? (
                  <EmptyState
                    title="Sem contas para esta empresa"
                    description="Use o formulário ao lado para registrar o primeiro lançamento."
                  />
                ) : (
                  <div className="space-y-2">
                    {filteredBills.map(bill => (
                      <BillCard
                        key={bill.id}
                        bill={bill}
                        deleteAction={deleteBillAction}
                        onEdit={b => setEditingBill(b)}
                      />
                    ))}
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-5 lg:sticky lg:top-10 h-fit">
          {selectedCompany ? (
            <BillForm companyId={selectedCompany.id} createAction={createBillAction} />
          ) : (
            <div className="bg-white/3 border border-dashed border-white/10 rounded-3xl p-8 text-center text-white/30 text-sm">
              Selecione uma empresa para começar a registrar contas.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCompanyForm && (
          <CompanyForm
            key="company-form"
            company={editingCompany}
            createAction={createCompanyAction}
            updateAction={updateCompanyAction}
            onClose={() => setShowCompanyForm(false)}
          />
        )}
        {editingBill && (
          <BillEditModal
            key="bill-edit"
            bill={editingBill}
            updateAction={updateBillAction}
            onClose={() => setEditingBill(undefined)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
