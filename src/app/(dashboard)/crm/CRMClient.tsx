"use client";

import React, { useState, useTransition } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd";
import {
  Plus, MoreVertical, DollarSign, Calendar, User,
  Search, X, Layout, Briefcase, Mail, Phone,
  CheckCircle2, XCircle, Circle, Pencil, Trash2,
  Kanban, Users, AlertTriangle, Edit3, Settings
} from "lucide-react";
import { 
  updateDealStage, createPipeline, createDeal, updateDeal, deleteDeal,
  updatePipeline, deletePipeline, createStage, updateStage, deleteStage
} from "./actions";
import ContactsPanel, { type Contact } from "./ContactsPanel";
import DealDrawer, { type DrawerDeal } from "./DealDrawer";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";


interface Deal {
  id: string;
  title: string;
  value: number;
  status: string;
  stage_id: string;
  position: number;
  contact_id: string | null;
  assigned_to: string | null;
  company_id: string;
  created_at: string;
  crm_contacts?: Contact | null;
}

interface CRMClientProps {
  initialPipelines: any[];
  initialDeals: Deal[];
  initialContacts: Contact[];
  companyId: string;
}

const STATUS_CONFIG = {
  open: { label: "Aberto", icon: Circle, color: "text-white/30", border: "border-white/5", bg: "bg-white/5" },
  won: { label: "Ganho", icon: CheckCircle2, color: "text-emerald-400", border: "border-emerald-400/20", bg: "bg-emerald-400/5" },
  lost: { label: "Perdido", icon: XCircle, color: "text-rose-400", border: "border-rose-400/20", bg: "bg-rose-400/5" },
};

/* ──────────────────────────────────────────────
   Sub-componente: Modal de Criação / Edição
────────────────────────────────────────────── */
interface DealModalProps {
  mode: "create" | "edit";
  deal?: Deal | null;
  stageId?: string;
  contacts: Contact[];
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string; value: number; status: string; contact_id: string | null;
  }) => void;
}

function DealModal({ mode, deal, contacts, isPending, onClose, onSubmit }: DealModalProps) {
  const [title, setTitle] = useState(deal?.title ?? "");
  const [value, setValue] = useState(deal?.value?.toString() ?? "");
  const [status, setStatus] = useState(deal?.status ?? "open");
  const [contactId, setContactId] = useState(deal?.contact_id ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedValue = parseFloat(value);
    if (!title.trim() || isNaN(parsedValue)) return;
    onSubmit({
      title: title.trim(),
      value: parsedValue,
      status,
      contact_id: contactId || null,
    });
  };

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-[#111111] border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEdit ? "bg-[var(--accent)]/10 border border-[var(--accent)]/20" : "bg-emerald-500/10 border border-emerald-500/20"}`}>
              {isEdit
                ? <Pencil size={16} className="text-[var(--accent)]" />
                : <Briefcase size={18} className="text-emerald-400" />
              }
            </div>
            <div>
              <h2 className="font-bold text-white text-lg leading-tight">
                {isEdit ? "Editar Oportunidade" : "Nova Oportunidade"}
              </h2>
              <p className="text-white/30 text-xs mt-0.5">
                {isEdit ? "Atualize os dados do card" : "Adicione um novo deal ao funil"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Título */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">
              Título do Deal *
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              autoFocus
              placeholder="Ex: Clinic Dr. Silva — Pacote Premium"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all text-sm font-medium"
            />
          </div>

          {/* Valor */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">
              Valor Estimado (R$) *
            </label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={value}
                onChange={e => setValue(e.target.value)}
                required
                placeholder="0,00"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-5 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all font-bold text-lg"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">
              Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(STATUS_CONFIG) as [string, typeof STATUS_CONFIG["open"]][]).map(([key, cfg]) => {
                const Icon = cfg.icon;
                const active = status === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatus(key)}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all ${active
                        ? `${cfg.color} ${cfg.border} ${cfg.bg}`
                        : "text-white/20 border-white/5 bg-transparent hover:border-white/10 hover:text-white/40"
                      }`}
                  >
                    <Icon size={13} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">
              Contato Vinculado
            </label>
            {contacts.length === 0 ? (
              <div className="w-full bg-white/[0.03] border border-dashed border-white/10 rounded-2xl px-5 py-3 text-white/20 text-sm text-center">
                Nenhum contato cadastrado ainda
              </div>
            ) : (
              <select
                value={contactId}
                onChange={e => setContactId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#1a1a1a] text-white/40">— Sem contato vinculado —</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#1a1a1a]">
                    {c.name}{c.email ? ` · ${c.email}` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Contato selecionado: preview */}
          {contactId && (() => {
            const c = contacts.find(x => x.id === contactId);
            if (!c) return null;
            return (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center shrink-0">
                  <User size={14} className="text-[var(--accent)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{c.name}</p>
                  <div className="flex gap-3 mt-0.5">
                    {c.email && (
                      <span className="flex items-center gap-1 text-[10px] text-white/30">
                        <Mail size={9} />{c.email}
                      </span>
                    )}
                    {c.phone && (
                      <span className="flex items-center gap-1 text-[10px] text-white/30">
                        <Phone size={9} />{c.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg disabled:opacity-50 mt-2 text-sm ${isEdit
                ? "bg-[var(--accent)] text-black hover:brightness-110"
                : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110"
              }`}
          >
            {isPending
              ? (isEdit ? "Salvando..." : "Criando...")
              : (isEdit ? "Salvar Alterações" : "Adicionar ao Funil")
            }
          </button>
        </form>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Componente Principal
────────────────────────────────────────────── */
export default function CRMClient({ initialPipelines, initialDeals, initialContacts, companyId }: CRMClientProps) {
  const [pipelines, setPipelines] = useState(initialPipelines);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [activePipelineId, setActivePipelineId] = useState(
    initialPipelines.length > 0 ? initialPipelines[0].id : null
  );
  const [activeTab, setActiveTab] = useState<"kanban" | "contacts">("kanban");
  const [isPending, startTransition] = useTransition();

  // Modais
  const [showPipelineModal, setShowPipelineModal] = useState(false);
  const [editPipelineModal, setEditPipelineModal] = useState<{ show: boolean; pipeline: any | null }>({ show: false, pipeline: null });
  const [deletePipelineModal, setDeletePipelineModal] = useState<{ show: boolean; pipeline: any | null }>({ show: false, pipeline: null });
  const [stageModal, setStageModal] = useState<{ show: boolean; mode: "create" | "edit"; pipelineId?: string; stage?: any | null }>({ show: false, mode: "create" });
  const [deleteStageModal, setDeleteStageModal] = useState<{ show: boolean; stage: any | null }>({ show: false, stage: null });
  const [openStageMenuId, setOpenStageMenuId] = useState<string | null>(null);

  const [createModal, setCreateModal] = useState<{ show: boolean; stageId: string | null }>({ show: false, stageId: null });
  const [editModal, setEditModal] = useState<{ show: boolean; deal: Deal | null }>({ show: false, deal: null });
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; deal: Deal | null }>({ show: false, deal: null });
  const [drawerDeal, setDrawerDeal] = useState<Deal | null>(null);

  // Filtros Kanban
  const [filterSearch, setFilterSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const activePipeline = pipelines.find(p => p.id === activePipelineId);

  const activePipelineDeals = deals.filter(deal =>
    activePipeline?.crm_stages?.some((s: any) => s.id === deal.stage_id)
  );

  // ── Drag & Drop ──
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const previousDeals = deals;
    const newDeals = deals.map(deal => {
      if (deal.id !== draggableId) return deal;
      return { ...deal, stage_id: destination.droppableId, position: destination.index };
    });
    setDeals(newDeals);

    startTransition(async () => {
      const { success } = await updateDealStage(draggableId, destination.droppableId, destination.index);
      if (!success) {
        toast.error("Erro ao mover card. Revertendo...");
        setDeals(previousDeals);
      }
    });
  };

  // ── Criar Funil ──
  const handleCreatePipeline = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    if (!name) return;
    startTransition(async () => {
      const result = await createPipeline(name, companyId);
      if (result.success) {
        setPipelines([...pipelines, result.data]);
        if (!activePipelineId) setActivePipelineId(result.data.id);
        setShowPipelineModal(false);
        toast.success("Funil criado com sucesso!");
      } else {
        console.error("Erro ao criar funil:", result.error);
        toast.error("Erro ao criar funil", {
          description: result.error?.message || "Ocorreu um erro inesperado."
        });
      }
    });

  };

  // ── Atualizar/Deletar Funil ──
  const handleUpdatePipeline = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editPipelineModal.pipeline) return;
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    if (!name) return;
    startTransition(async () => {
      const result = await updatePipeline(editPipelineModal.pipeline.id, name);
      if (result.success) {
        setPipelines(prev => prev.map(p => p.id === result.data.id ? { ...p, name: result.data.name } : p));
        setEditPipelineModal({ show: false, pipeline: null });
        toast.success("Funil atualizado!");
      } else {
        toast.error("Erro ao atualizar funil.");
      }
    });
  };

  const handleDeletePipeline = async () => {
    if (!deletePipelineModal.pipeline) return;
    startTransition(async () => {
      const result = await deletePipeline(deletePipelineModal.pipeline.id);
      if (result.success) {
        const remaining = pipelines.filter(p => p.id !== deletePipelineModal.pipeline.id);
        setPipelines(remaining);
        setActivePipelineId(remaining.length > 0 ? remaining[0].id : null);
        setDeletePipelineModal({ show: false, pipeline: null });
        toast.success("Funil excluído!");
      } else {
        toast.error(result.error?.message || "Erro ao excluir funil.");
      }
    });
  };

  // ── Etapas (Stages) ──
  const handleStageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    if (!name) return;

    startTransition(async () => {
      if (stageModal.mode === "create" && stageModal.pipelineId) {
        const position = activePipeline?.crm_stages?.length || 0;
        const res = await createStage(stageModal.pipelineId, name, position);
        if (res.success) {
          setPipelines(prev => prev.map(p => {
            if (p.id === stageModal.pipelineId) {
              return { ...p, crm_stages: [...(p.crm_stages || []), res.data] };
            }
            return p;
          }));
          toast.success("Etapa criada!");
        } else toast.error("Erro ao criar etapa.");
      } else if (stageModal.mode === "edit" && stageModal.stage) {
        const res = await updateStage(stageModal.stage.id, name);
        if (res.success) {
          setPipelines(prev => prev.map(p => {
            if (p.id === stageModal.stage.pipeline_id) {
              return {
                ...p,
                crm_stages: p.crm_stages?.map((s: any) => s.id === stageModal.stage.id ? { ...s, name: res.data.name } : s)
              };
            }
            return p;
          }));
          toast.success("Etapa atualizada!");
        } else toast.error("Erro ao atualizar etapa.");
      }
      setStageModal({ show: false, mode: "create" });
    });
  };

  const handleDeleteStage = async () => {
    if (!deleteStageModal.stage) return;
    startTransition(async () => {
      const res = await deleteStage(deleteStageModal.stage.id);
      if (res.success) {
        setPipelines(prev => prev.map(p => {
          if (p.id === deleteStageModal.stage.pipeline_id) {
            return { ...p, crm_stages: p.crm_stages?.filter((s: any) => s.id !== deleteStageModal.stage.id) };
          }
          return p;
        }));
        toast.success("Etapa excluída!");
      } else {
        toast.error(res.error?.message || "Erro ao excluir etapa.");
      }
      setDeleteStageModal({ show: false, stage: null });
    });
  };

  // ── Criar Deal ──
  const handleCreateDeal = (data: { title: string; value: number; status: string; contact_id: string | null }) => {
    if (!createModal.stageId) return;
    startTransition(async () => {
      const res = await createDeal({
        title: data.title,
        value: data.value,
        stage_id: createModal.stageId!,
        company_id: companyId,
        contact_id: data.contact_id ?? undefined,
      });
      if (res.success && res.data) {
        const contact = data.contact_id ? contacts.find(c => c.id === data.contact_id) ?? null : null;
        setDeals(prev => [...prev, { ...res.data, crm_contacts: contact }]);
        toast.success("Oportunidade criada!");
        setCreateModal({ show: false, stageId: null });
      } else {
        toast.error("Erro ao criar oportunidade.");
      }
    });
  };

  // ── Editar Deal ──
  const handleEditDeal = (data: { title: string; value: number; status: string; contact_id: string | null }) => {
    if (!editModal.deal) return;
    const dealId = editModal.deal.id;
    startTransition(async () => {
      const res = await updateDeal(dealId, data);
      if (res.success && res.data) {
        const contact = data.contact_id ? contacts.find(c => c.id === data.contact_id) ?? null : null;
        setDeals(prev => prev.map(d =>
          d.id === dealId ? { ...d, ...res.data, crm_contacts: contact } : d
        ));
        toast.success("Deal atualizado!");
        setEditModal({ show: false, deal: null });
      } else {
        toast.error("Erro ao salvar alterações.");
      }
    });
  };

  // ── Deletar Deal ──
  const handleDeleteDeal = () => {
    if (!deleteModal.deal) return;
    const dealId = deleteModal.deal.id;
    startTransition(async () => {
      const res = await deleteDeal(dealId);
      if (res.success) {
        setDeals(prev => prev.filter(d => d.id !== dealId));
        toast.success("Deal excluído.");
        setDeleteModal({ show: false, deal: null });
      } else {
        toast.error("Erro ao excluir deal.");
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d0d0d]/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {/* Tab Switcher */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("kanban")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "kanban"
                  ? "bg-white/10 text-white shadow"
                  : "text-white/30 hover:text-white/60"
                }`}
            >
              <Kanban size={15} />
              Kanban
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "contacts"
                  ? "bg-white/10 text-white shadow"
                  : "text-white/30 hover:text-white/60"
                }`}
            >
              <Users size={15} />
              Contatos
              {contacts.length > 0 && (
                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full text-white/50">
                  {contacts.length}
                </span>
              )}
            </button>
          </div>

          {/* Pipeline selector (only on kanban tab) */}
          {activeTab === "kanban" && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <select
                  value={activePipelineId || ""}
                  onChange={e => setActivePipelineId(e.target.value)}
                  className="bg-transparent pl-4 py-2 text-sm font-medium focus:ring-0 outline-none appearance-none cursor-pointer pr-10 min-w-[200px]"
                >
                  {pipelines.map(p => (
                    <option key={p.id} value={p.id} className="bg-[#1a1a1a]">{p.name}</option>
                  ))}
                </select>
                {activePipeline && (
                  <div className="flex items-center border-l border-white/10 pl-1 pr-1">
                    <button
                      onClick={() => setEditPipelineModal({ show: true, pipeline: activePipeline })}
                      className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                      title="Editar Funil"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeletePipelineModal({ show: true, pipeline: activePipeline })}
                      className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Excluir Funil"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowPipelineModal(true)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-[var(--accent)] hover:text-black border border-white/10 hover:border-[var(--accent)] transition-all text-white/60"
                title="Novo Funil"
              >
                <Plus size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Right side — only on kanban */}
        {activeTab === "kanban" && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent)] transition-colors" size={15} />
              <input
                type="text"
                value={filterSearch}
                onChange={e => setFilterSearch(e.target.value)}
                placeholder="Buscar por título ou contato..."
                className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] outline-none w-56 transition-all"
              />
              {filterSearch && (
                <button onClick={() => setFilterSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Status chips */}
            {(["open", "won", "lost"] as const).map(s => {
              const cfg = STATUS_CONFIG[s];
              const Icon = cfg.icon;
              const active = filterStatus === s;
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(active ? null : s)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${active
                      ? `${cfg.color} ${cfg.border} ${cfg.bg}`
                      : "text-white/25 border-white/5 hover:border-white/15 hover:text-white/50"
                    }`}
                >
                  <Icon size={11} />
                  {cfg.label}
                </button>
              );
            })}

            {/* Clear all filters */}
            {(filterSearch || filterStatus) && (
              <button
                onClick={() => { setFilterSearch(""); setFilterStatus(null); }}
                className="text-[11px] text-white/25 hover:text-rose-400 transition-colors px-1"
              >
                Limpar
              </button>
            )}
          </div>
        )}
      </header>

      {/* ── TAB CONTENT ── */}
      <AnimatePresence mode="wait">
        {activeTab === "contacts" ? (
          <motion.div
            key="contacts"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <ContactsPanel
              contacts={contacts}
              companyId={companyId}
              onContactsChange={setContacts}
            />
          </motion.div>
        ) : (!activePipelineId && pipelines.length === 0) ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center p-10 text-center"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <Plus className="text-[var(--accent)]" size={32} />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-white">Bem-vindo ao seu CRM</h1>
            <p className="text-white/40 mb-8 max-w-md">Gerencie seus leads e oportunidades de forma visual e intuitiva com o estilo Kanban do Nexus.</p>
            <button
              onClick={() => setShowPipelineModal(true)}
              className="px-6 py-3 rounded-xl bg-[var(--accent)] text-black font-bold hover:opacity-90 transition-all flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Criar meu primeiro Funil</span>
            </button>
          </motion.div>
        ) : (

          <motion.div
            key="kanban"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-x-auto p-6 bg-[#0a0a0a]"
          >
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-4 md:gap-6 h-full min-h-[calc(100vh-200px)] snap-x snap-mandatory pb-8">
                {activePipeline?.crm_stages?.sort((a: any, b: any) => a.position - b.position).map((stage: any) => {
                  const stageDeals = activePipelineDeals
                    .filter(deal => deal.stage_id === stage.id)
                    .filter(deal => {
                      // filtro de status
                      if (filterStatus && deal.status !== filterStatus) return false;
                      // filtro de texto — título ou nome do contato ou telefone do contato
                      if (filterSearch) {
                        const q = filterSearch.toLowerCase();
                        const matchTitle = deal.title.toLowerCase().includes(q);
                        const matchContact = deal.crm_contacts?.name?.toLowerCase().includes(q);
                        const matchPhone = deal.crm_contacts?.phone?.includes(filterSearch);
                        if (!matchTitle && !matchContact && !matchPhone) return false;
                      }
                      return true;
                    })
                    .sort((a, b) => a.position - b.position);

                  return (
                    <div key={stage.id} className="flex flex-col w-[85vw] max-w-[320px] shrink-0 snap-center md:snap-align-none bg-white/[0.02] rounded-2xl border border-white/5 p-4 group/stage">
                      {/* Stage Header */}
                      <div className="flex items-center justify-between mb-4 px-1 relative">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-sm text-white/80">{stage.name}</h3>
                          <span className="bg-white/5 text-white/30 text-[10px] px-1.5 py-0.5 rounded-full border border-white/5">
                            {stageDeals.length}
                          </span>
                        </div>
                        <div className="relative">
                          <button 
                            onClick={() => setOpenStageMenuId(openStageMenuId === stage.id ? null : stage.id)}
                            className="text-white/20 hover:text-white transition-colors p-1 rounded hover:bg-white/10 opacity-100 md:opacity-0 md:group-hover/stage:opacity-100"
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {/* Stage Options Dropdown */}
                          <AnimatePresence>
                            {openStageMenuId === stage.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                                className="absolute right-0 top-full mt-1 w-40 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                              >
                                <button 
                                  onClick={() => { setStageModal({ show: true, mode: 'edit', stage }); setOpenStageMenuId(null); }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left"
                                >
                                  <Pencil size={12} /> Renomear
                                </button>
                                <button 
                                  onClick={() => { setDeleteStageModal({ show: true, stage }); setOpenStageMenuId(null); }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400/70 hover:text-rose-400 hover:bg-rose-400/10 transition-colors text-left border-t border-white/5"
                                >
                                  <Trash2 size={12} /> Excluir
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Cards Container */}
                      <Droppable droppableId={stage.id}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`flex-1 flex flex-col gap-3 min-h-[100px] pb-10 transition-colors rounded-xl ${snapshot.isDraggingOver ? "bg-[var(--accent)]/5" : ""}`}
                          >
                            {stageDeals.map((deal, index) => {
                              const statusCfg = STATUS_CONFIG[deal.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.open;
                              const StatusIcon = statusCfg.icon;
                              const contact = deal.crm_contacts;

                              return (
                                <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={() => setDrawerDeal(deal)}
                                      className={`
                                    bg-[#141414] border border-white/5 p-4 rounded-xl shadow-xl transition-all
                                    hover:border-white/20 group/card relative cursor-pointer
                                    ${snapshot.isDragging ? "rotate-2 scale-105 border-[var(--accent)] shadow-[var(--accent)]/10 z-50" : ""}
                                  `}
                                    >
                                      {/* Title row */}
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-sm font-medium text-white group-hover/card:text-[var(--accent)] transition-colors line-clamp-2 pr-2">
                                          {deal.title}
                                        </h4>
                                        <div className="flex items-center gap-0.5 opacity-0 group-hover/card:opacity-100 shrink-0">
                                          <button
                                            onPointerDown={e => e.stopPropagation()}
                                            onClick={e => { e.stopPropagation(); setEditModal({ show: true, deal }); }}
                                            className="p-1 text-white/20 hover:text-[var(--accent)] transition-colors"
                                            title="Editar"
                                          >
                                            <Pencil size={12} />
                                          </button>
                                          <button
                                            onPointerDown={e => e.stopPropagation()}
                                            onClick={e => { e.stopPropagation(); setDeleteModal({ show: true, deal }); }}
                                            className="p-1 text-white/20 hover:text-rose-400 transition-colors"
                                            title="Excluir"
                                          >
                                            <Trash2 size={12} />
                                          </button>
                                        </div>
                                      </div>

                                      {/* Contact badge */}
                                      {contact && (
                                        <div className="flex items-center gap-1.5 mb-3">
                                          <User size={10} className="text-white/30 shrink-0" />
                                          <span className="text-[11px] text-white/40 truncate">{contact.name}</span>
                                        </div>
                                      )}

                                      {/* Value + Status */}
                                      <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center space-x-1 text-emerald-400 font-bold text-[13px]">
                                          <DollarSign size={13} strokeWidth={3} />
                                          <span>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(deal.value || 0)}</span>
                                        </div>

                                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-semibold ${statusCfg.color} ${statusCfg.border} ${statusCfg.bg}`}>
                                          <StatusIcon size={10} />
                                          {statusCfg.label}
                                        </div>
                                      </div>

                                      {/* Footer */}
                                      <div className="mt-3 pt-3 border-t border-white/[0.03] flex items-center text-[10px] text-white/20">
                                        <div className="flex items-center space-x-1">
                                          <Calendar size={10} />
                                          <span>{new Date(deal.created_at).toLocaleDateString("pt-BR")}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}

                            <button
                              className="w-full py-2 border border-dashed border-white/5 rounded-xl text-[11px] text-white/10 hover:text-[var(--accent)] hover:border-[var(--accent)]/20 hover:bg-[var(--accent)]/5 transition-all mt-2 flex items-center justify-center space-x-2"
                              onClick={() => setCreateModal({ show: true, stageId: stage.id })}
                            >
                              <Plus size={12} />
                              <span>Novo Card</span>
                            </button>

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}

                {/* Add Stage Column Placeholder */}
                {activePipeline && (
                  <div className="flex flex-col w-[85vw] max-w-[320px] shrink-0 snap-center md:snap-align-none justify-center opacity-50 hover:opacity-100 transition-opacity p-2">
                    <button
                      onClick={() => setStageModal({ show: true, mode: 'create', pipelineId: activePipeline.id })}
                      className="w-full h-full min-h-[200px] rounded-2xl border-2 border-dashed border-white/10 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 flex flex-col items-center justify-center gap-3 text-white/30 hover:text-[var(--accent)] transition-all"
                    >
                      <Plus size={24} />
                      <span className="font-medium text-sm">Nova Etapa</span>
                    </button>
                  </div>
                )}
              </div>
            </DragDropContext>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL: NOVO FUNIL ── */}
      <AnimatePresence>
        {showPipelineModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPipelineModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#111111] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
                    <Layout size={18} className="text-[var(--accent)]" />
                  </div>
                  <h2 className="font-bold text-white text-lg">Novo Funil de Vendas</h2>
                </div>
                <button onClick={() => setShowPipelineModal(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreatePipeline} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Nome do Funil</label>
                  <input name="name" required autoFocus placeholder="Ex: Captação High Ticket" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all font-medium" />
                </div>
                <button type="submit" disabled={isPending} className="w-full py-4 rounded-2xl bg-[var(--accent)] text-black font-bold hover:brightness-110 transition-all shadow-[0_10px_30px_rgba(var(--accent-rgb),0.3)] disabled:opacity-50">
                  {isPending ? "Criando..." : "Criar Funil"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: CRIAR DEAL ── */}
      <AnimatePresence>
        {createModal.show && (
          <DealModal
            mode="create"
            stageId={createModal.stageId ?? undefined}
            contacts={contacts}
            isPending={isPending}
            onClose={() => setCreateModal({ show: false, stageId: null })}
            onSubmit={handleCreateDeal}
          />
        )}
      </AnimatePresence>

      {/* ── MODAL: EDITAR DEAL ── */}
      <AnimatePresence>
        {editModal.show && editModal.deal && (
          <DealModal
            mode="edit"
            deal={editModal.deal}
            contacts={contacts}
            isPending={isPending}
            onClose={() => setEditModal({ show: false, deal: null })}
            onSubmit={handleEditDeal}
          />
        )}
      </AnimatePresence>

      {/* ── MODAL: CONFIRMAR EXCLUSÃO DE DEAL ── */}
      <AnimatePresence>
        {deleteModal.show && deleteModal.deal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteModal({ show: false, deal: null })}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-sm bg-[#111111] border border-rose-500/20 rounded-3xl p-8 shadow-2xl text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-5">
                <AlertTriangle size={24} className="text-rose-400" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Excluir deal?</h3>
              <p className="text-white/40 text-sm mb-6">
                <span className="text-white/70 font-medium">{deleteModal.deal.title}</span> será removido permanentemente do funil.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, deal: null })}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white transition-all text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteDeal}
                  disabled={isPending}
                  className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-all text-sm disabled:opacity-50"
                >
                  {isPending ? "Excluindo..." : "Sim, excluir"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODALS COMPLEMENTARES: FUNIL E ETAPA ── */}
      {/* Editar Funil */}
      <AnimatePresence>
        {editPipelineModal.show && editPipelineModal.pipeline && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditPipelineModal({ show: false, pipeline: null })} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-2xl">
              <h2 className="font-bold text-white text-lg mb-4">Renomear Funil</h2>
              <form onSubmit={handleUpdatePipeline} className="space-y-4">
                <input name="name" defaultValue={editPipelineModal.pipeline.name} required autoFocus className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all font-medium text-sm" />
                <button type="submit" disabled={isPending} className="w-full py-3 rounded-xl bg-[var(--accent)] text-black font-bold hover:brightness-110 transition-all disabled:opacity-50 text-sm">
                  {isPending ? "Salvando..." : "Salvar"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Excluir Funil */}
      <AnimatePresence>
        {deletePipelineModal.show && deletePipelineModal.pipeline && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeletePipelineModal({ show: false, pipeline: null })} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-[#111111] border border-rose-500/20 rounded-3xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mx-auto mb-4"><AlertTriangle className="text-rose-400" /></div>
              <h3 className="font-bold text-white mb-2">Excluir Funil?</h3>
              <p className="text-white/40 text-xs mb-6">Esta ação removerá o funil <strong>{deletePipelineModal.pipeline.name}</strong> e só pode ser feita se ele não tiver deals ativos.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeletePipelineModal({ show: false, pipeline: null })} className="flex-1 py-2 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5">Cancelar</button>
                <button onClick={handleDeletePipeline} disabled={isPending} className="flex-1 py-2 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 disabled:opacity-50">Excluir</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Etapa (Criar/Editar) */}
      <AnimatePresence>
        {stageModal.show && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setStageModal({ show: false, mode: 'create' })} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-2xl">
              <h2 className="font-bold text-white text-lg mb-4">{stageModal.mode === "create" ? "Nova Etapa" : "Renomear Etapa"}</h2>
              <form onSubmit={handleStageSubmit} className="space-y-4">
                <input name="name" defaultValue={stageModal.stage?.name || ""} placeholder="Ex: Contato Realizado" required autoFocus className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all font-medium text-sm" />
                <button type="submit" disabled={isPending} className="w-full py-3 rounded-xl bg-[var(--accent)] text-black font-bold hover:brightness-110 transition-all disabled:opacity-50 text-sm">
                  {isPending ? "Salvando..." : "Salvar Etapa"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Excluir Etapa */}
      <AnimatePresence>
        {deleteStageModal.show && deleteStageModal.stage && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteStageModal({ show: false, stage: null })} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-[#111111] border border-rose-500/20 rounded-3xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mx-auto mb-4"><Trash2 className="text-rose-400" /></div>
              <h3 className="font-bold text-white mb-2">Excluir Etapa?</h3>
              <p className="text-white/40 text-xs mb-6">Tem certeza que deseja remover <strong>{deleteStageModal.stage.name}</strong>? Não pode ter deals ativos.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteStageModal({ show: false, stage: null })} className="flex-1 py-2 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5">Cancelar</button>
                <button onClick={handleDeleteStage} disabled={isPending} className="flex-1 py-2 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 disabled:opacity-50">Excluir</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DEAL DRAWER ── */}
      <AnimatePresence>
        {drawerDeal && (
          <DealDrawer
            deal={drawerDeal as DrawerDeal}
            contacts={contacts}
            onClose={() => setDrawerDeal(null)}
            onDealUpdate={(updated) => {
              setDeals(prev => prev.map(d => d.id === updated.id ? { ...d, ...updated } as Deal : d));
              setDrawerDeal(prev => prev ? { ...prev, ...updated } : null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

