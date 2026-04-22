"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, TrendingUp, Receipt, AlertCircle, Calendar as CalendarIcon, Filter, X, ChevronDown, Settings } from "lucide-react";
import { CompanyCard } from "@/components/dashboard/CompanyCard";
import { CompanyForm } from "@/components/dashboard/CompanyForm";
import { BillCard } from "@/components/dashboard/BillCard";
import { BillEditModal } from "@/components/dashboard/BillEditModal";
import { BillDetailModal } from "@/components/dashboard/BillDetailModal";
import { BillForm } from "@/components/dashboard/BillForm";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { SettingsModal } from "@/components/dashboard/SettingsModal";
import type { Company, Bill, Category, CostCenter, Supplier } from "@/types/database";
import { getEffectiveStatus, filterBillsByDate, getDaysUntilDue, getBillTotal } from "@/utils/billUtils";

interface GestaoClientProps {
  companies: Company[];
  bills: Bill[];
  createCompanyAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  updateCompanyAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  deleteCompanyAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  createBillAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  updateBillAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  deleteBillAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  categories: Category[];
  costCenters: CostCenter[];
  createCategoryAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  deleteCategoryAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  createCostCenterAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  deleteCostCenterAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  suppliers: Supplier[];
  createSupplierAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  deleteSupplierAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export function GestaoClient({
  companies, bills, categories, costCenters, suppliers,
  createCompanyAction, updateCompanyAction, deleteCompanyAction,
  createBillAction, updateBillAction, deleteBillAction,
  createCategoryAction, deleteCategoryAction,
  createCostCenterAction, deleteCostCenterAction,
  createSupplierAction, deleteSupplierAction,
}: GestaoClientProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companies[0]?.id ?? "");
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>();
  const [editingBill, setEditingBill] = useState<Bill | undefined>();
  const [viewingBill, setViewingBill] = useState<Bill | undefined>();
  const [showBillForm, setShowBillForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Filtros
  const [startDate, setStartDate] = useState<string>("");
  const defaultEndDate = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(new Date(y, now.getMonth() + 1, 0).getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);
  const [endDate, setEndDate] = useState<string>(defaultEndDate);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [initialBillForClone, setInitialBillForClone] = useState<Partial<Bill> | undefined>();

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  // Aplicar lógica de status dinâmico e filtros
  const processedBills = useMemo(() => {
    // Primeiro, aplica o status dinâmico
    let list = bills.map(b => ({
      ...b,
      status: getEffectiveStatus(b)
    }));

    // Filtro por período (agora atua como o filtro de visibilidade principal)
    list = filterBillsByDate(list, startDate, endDate);

    // Filtro por status/proximidade
    if (statusFilter === "near") {
      list = list.filter(b => b.status === "Pendente" && b.overdue_date && getDaysUntilDue(b.overdue_date) <= 3);
    } else if (statusFilter === "overdue") {
      list = list.filter(b => b.status === "Vencido");
    } else if (statusFilter === "pending") {
      list = list.filter(b => b.status === "Pendente");
    } else if (statusFilter === "paid") {
      list = list.filter(b => b.status === "Paga");
    }

    // Filtro por categoria
    if (categoryFilter !== "all") {
      list = list.filter(b => b.category === categoryFilter);
    }

    return list;
  }, [bills, startDate, endDate, statusFilter, categoryFilter]);

  const filteredBills = processedBills.filter(b => b.company_id === selectedCompanyId);

  // Métricas globais (respeitando os filtros de data)
  const totalPending = processedBills.filter(b => b.status === "Pendente").length;
  const totalOverdue = processedBills.filter(b => b.status === "Vencido").length;
  const totalAmount = processedBills.reduce((sum, b) => sum + getBillTotal(b), 0);

  // Métricas por empresa (respeitando os filtros de data)
  const billCountFor = (id: string) => processedBills.filter(b => b.company_id === id).length;
  const pendingCountFor = (id: string) => processedBills.filter(b => b.company_id === id && b.status === "Pendente").length;
  const totalAmountFor = (id: string) => processedBills.filter(b => b.company_id === id).reduce((s, b) => s + getBillTotal(b), 0);

  const hasActiveFilters = startDate !== "" || endDate !== defaultEndDate || statusFilter !== "all" || categoryFilter !== "all";
  const clearFilters = () => { setStartDate(""); setEndDate(defaultEndDate); setStatusFilter("all"); setCategoryFilter("all"); };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10 space-y-8">

      {/* ─── Header ─────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Nexus • Gestão Financeira</p>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Contas a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F24639] to-[#F22471]">Pagar</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => { setEditingCompany(undefined); setShowCompanyForm(true); }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-wider"
            >
              <Plus size={14} />
              <span>Empresa</span>
            </motion.button>

            <motion.button
              onClick={() => setShowSettings(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <Settings size={16} />
            </motion.button>

            <motion.button
              onClick={() => {
                setInitialBillForClone(undefined);
                setShowBillForm(true);
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={!selectedCompany}
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#F24639] to-[#F22471] text-white font-bold text-xs uppercase tracking-wider shadow-[0_15px_30px_-10px_rgba(242,36,113,0.3)] hover:shadow-[0_15px_40px_-5px_rgba(242,36,113,0.5)] transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
              <span>Novo Boleto</span>
            </motion.button>
          </div>
        </div>

        {/* Unified Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-1 bg-white/3 border border-white/8 rounded-2xl">
          {/* Status Select Container */}
          <div className="flex items-center gap-2 flex-1 min-w-[140px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl group hover:border-white/20 transition-all relative">
            <Filter size={14} className="text-white/40 group-hover:text-white/60 transition-colors" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-transparent text-sm text-white/90 focus:outline-none cursor-pointer appearance-none pr-6 z-10"
            >
              <option value="all" className="bg-[#111111]">Todos os Lançamentos</option>
              <option value="near" className="bg-[#111111]">Perto de Vencer</option>
              <option value="overdue" className="bg-[#111111]">Boletos Vencidos</option>
              <option value="pending" className="bg-[#111111]">Boletos Pendentes</option>
              <option value="paid" className="bg-[#111111]">Boletos Pagos</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 text-white/20 pointer-events-none" />
          </div>

          {/* Category Select Container */}
          <div className="flex items-center gap-2 flex-1 min-w-[140px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl group hover:border-white/20 transition-all relative">
            <Filter size={14} className="text-white/40 group-hover:text-white/60 transition-colors" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-transparent text-sm text-white/90 focus:outline-none cursor-pointer appearance-none pr-6 z-10"
            >
              <option value="all" className="bg-[#111111]">Todas as Categorias</option>
              {categories.map(c => (
                <option key={c.id} value={c.name} className="bg-[#111111]">{c.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 text-white/20 pointer-events-none" />
          </div>

          {/* Date Pickers Container */}
          <div className="flex-2 flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl group hover:border-white/20 transition-all">
            <CalendarIcon size={14} className="text-white/40 group-hover:text-white/60 transition-colors" />
            <div className="flex items-center gap-1 flex-1">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-sm text-white/90 focus:outline-none [color-scheme:dark] w-full"
              />
              <span className="text-white/10 px-1">/</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-sm text-white/90 focus:outline-none [color-scheme:dark] w-full"
              />
            </div>
          </div>

          {/* Clear Actions */}
          {hasActiveFilters && (
            <motion.button 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <X size={14} />
              <span>Limpar Filtros</span>
            </motion.button>
          )}
        </div>
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
                        onClone={b => {
                          // Prepare initial data for cloning
                          setInitialBillForClone({
                            description: b.description + " (Cópia)",
                            amount: b.amount,
                            category: b.category,
                            cost_center: b.cost_center,
                            supplier: b.supplier,
                            notes: b.notes,
                            status: "Pendente",
                            // PDF, payment details, and recurrences are not cloned by default
                          });
                          setShowBillForm(true);
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Metrics / Info */}
        <div className="lg:col-span-5 lg:sticky lg:top-10 h-fit space-y-6">
          <div className="bg-[#111111] border border-white/8 rounded-[2.5rem] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
                <TrendingUp size={18} className="text-[var(--accent)]" />
              </div>
              <h3 className="font-bold text-white uppercase text-[10px] tracking-widest text-white/40">Resumo da Empresa</h3>
            </div>
            
            {selectedCompany ? (
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Total em Aberto</p>
                  <p className="text-2xl font-bold text-white tracking-tight">
                    {formatCurrency(totalAmountFor(selectedCompany.id))}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Lançamentos</p>
                    <p className="text-lg font-bold text-white">{billCountFor(selectedCompany.id)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Pendentes</p>
                    <p className="text-lg font-bold text-amber-400">{pendingCountFor(selectedCompany.id)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-white/20 text-xs italic">Selecione uma empresa para ver detalhes.</p>
            )}
          </div>

          {!selectedCompany && (
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
        {showBillForm && selectedCompany && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowBillForm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl z-10 max-h-[90vh] overflow-y-auto scrollbar-hide rounded-3xl"
            >
              <BillForm 
                companyId={selectedCompany.id} 
                categories={categories}
                costCenters={costCenters}
                suppliers={suppliers}
                createAction={createBillAction} 
                initialData={initialBillForClone}
                onClose={() => {
                  setShowBillForm(false);
                  setInitialBillForClone(undefined);
                }}
              />
            </motion.div>

          </div>
        )}
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
            categories={categories}
            costCenters={costCenters}
            suppliers={suppliers}
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
        {showSettings && (
          <SettingsModal
            key="settings-modal"
            categories={categories}
            costCenters={costCenters}
            suppliers={suppliers}
            createCategoryAction={createCategoryAction}
            deleteCategoryAction={deleteCategoryAction}
            createCostCenterAction={createCostCenterAction}
            deleteCostCenterAction={deleteCostCenterAction}
            createSupplierAction={createSupplierAction}
            deleteSupplierAction={deleteSupplierAction}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
