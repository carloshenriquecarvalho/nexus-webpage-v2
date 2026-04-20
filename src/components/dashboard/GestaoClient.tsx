"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, TrendingUp, Receipt, AlertCircle, Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { CompanyCard } from "@/components/dashboard/CompanyCard";
import { CompanyForm } from "@/components/dashboard/CompanyForm";
import { BillCard } from "@/components/dashboard/BillCard";
import { BillEditModal } from "@/components/dashboard/BillEditModal";
import { BillDetailModal } from "@/components/dashboard/BillDetailModal";
import { BillForm } from "@/components/dashboard/BillForm";
import { EmptyState } from "@/components/dashboard/EmptyState";
import type { Company, Bill } from "@/types/database";
import { getEffectiveStatus, filterBillsByDate } from "@/utils/billUtils";

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
  const [viewingBill, setViewingBill] = useState<Bill | undefined>();

  // Filtros de data
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  // Aplicar lógica de status dinâmico e filtros
  const processedBills = useMemo(() => {
    const withDynamicStatus = bills.map(b => ({
      ...b,
      status: getEffectiveStatus(b)
    }));
    return filterBillsByDate(withDynamicStatus, startDate, endDate);
  }, [bills, startDate, endDate]);

  const filteredBills = processedBills.filter(b => b.company_id === selectedCompanyId);

  // Métricas globais (respeitando os filtros de data)
  const totalPending = processedBills.filter(b => b.status === "Pendente").length;
  const totalOverdue = processedBills.filter(b => b.status === "Vencido").length;
  const totalAmount = processedBills.reduce((sum, b) => sum + Number(b.amount), 0);

  // Métricas por empresa (respeitando os filtros de data)
  const billCountFor = (id: string) => processedBills.filter(b => b.company_id === id).length;
  const pendingCountFor = (id: string) => processedBills.filter(b => b.company_id === id && b.status === "Pendente").length;
  const totalAmountFor = (id: string) => processedBills.filter(b => b.company_id === id).reduce((s, b) => s + Number(b.amount), 0);

  const hasActiveFilters = startDate !== "" || endDate !== "";
  const clearFilters = () => { setStartDate(""); setEndDate(""); };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10 space-y-8">

      {/* ─── Header ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Nexus • Gestão Financeira</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Contas a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F24639] to-[#F22471]">Pagar</span>
          </h1>
        </div>

        {/* Date Filter Bar */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
          <div className="flex items-center gap-2 px-3 text-white/40">
            <Filter size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Período</span>
          </div>
          <div className="flex items-center gap-1">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-xs text-white p-1.5 focus:outline-none [color-scheme:dark]"
            />
            <span className="text-white/20">/</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-xs text-white p-1.5 focus:outline-none [color-scheme:dark]"
            />
          </div>
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
              title="Limpar filtros"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <motion.button
          onClick={() => { setEditingCompany(undefined); setShowCompanyForm(true); }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="cursor-pointer flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#F24639] to-[#F22471] text-white font-bold text-sm shadow-[0_15px_30px_-10px_rgba(242,36,113,0.3)] hover:shadow-[0_15px_40px_-5px_rgba(242,36,113,0.5)] transition-all flex-shrink-0"
        >
          <Plus size={16} />
          <span>Nova Empresa</span>
        </motion.button>
      </div>

      {/* ─── Stats ──────────────────────────────────── */}
      {processedBills.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Volume Total", value: formatCurrency(totalAmount), icon: <TrendingUp size={16} />, color: "text-white", bg: "bg-white/5" },
            { label: "Pendentes", value: totalPending, icon: <Receipt size={16} />, color: "text-amber-400", bg: "bg-amber-400/5" },
            { label: "Vencidos", value: totalOverdue, icon: <AlertCircle size={16} />, color: "text-[#F24639]", bg: "bg-[#F24639]/5" },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} border border-white/8 rounded-2xl px-5 py-4`}>
              <div className={`flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1`}>
                <span className={stat.color}>{stat.icon}</span>
                <span>{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ─── Main Layout ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Companies + Bills */}
        <div className="lg:col-span-7 space-y-8">

          {/* Companies */}
          <section>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Empresas Clientes</p>
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
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                    Contas — <span className="text-[#F22471]">{selectedCompany.name}</span>
                  </p>
                  {filteredBills.length > 0 && (
                    <span className="text-[10px] font-bold text-white/20 uppercase">
                      {filteredBills.length} registro{filteredBills.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                {filteredBills.length === 0 ? (
                  <EmptyState
                    title={hasActiveFilters ? "Nenhum resultado" : "Sem contas para esta empresa"}
                    description={hasActiveFilters ? "Tente ajustar o período selecionado." : "Use o formulário ao lado para registrar o primeiro lançamento."}
                  />
                ) : (
                  <div className="space-y-3">
                    {filteredBills.map(bill => (
                      <BillCard
                        key={bill.id}
                        bill={bill}
                        deleteAction={deleteBillAction}
                        onEdit={b => setEditingBill(b)}
                        onView={b => setViewingBill(b)}
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
            <div className="bg-[#111111] border border-dashed border-white/10 rounded-[2.5rem] p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Receipt size={24} className="text-white/20" />
              </div>
              <p className="text-white/40 text-sm">Selecione uma empresa para começar a registrar contas.</p>
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
        {viewingBill && (
          <BillDetailModal
            key="bill-detail"
            bill={viewingBill}
            onClose={() => setViewingBill(undefined)}
            onEdit={() => setEditingBill(viewingBill)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
