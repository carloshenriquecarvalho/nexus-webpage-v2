"use client";

import React, { useState, useTransition } from "react";
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from "@hello-pangea/dnd";
import { Plus, MoreVertical, DollarSign, Calendar, User, Search, Filter, X, Layout, Briefcase } from "lucide-react";
import { updateDealStage, createPipeline, createDeal } from "./actions";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface CRMClientProps {
  initialPipelines: any[];
  initialDeals: any[];
  companyId: string;
}

export default function CRMClient({ initialPipelines, initialDeals, companyId }: CRMClientProps) {
  const [pipelines, setPipelines] = useState(initialPipelines);
  const [deals, setDeals] = useState(initialDeals);
  const [activePipelineId, setActivePipelineId] = useState(
    initialPipelines.length > 0 ? initialPipelines[0].id : null
  );
  const [isPending, startTransition] = useTransition();
  
  // Estados para Modais
  const [showPipelineModal, setShowPipelineModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState<{ show: boolean, stageId: string | null }>({ show: false, stageId: null });

  const activePipeline = pipelines.find(p => p.id === activePipelineId);

  // Filtrar deals por pipeline ativo (através dos stages do pipeline)
  const activePipelineDeals = deals.filter(deal => 
    activePipeline?.crm_stages?.some((s: any) => s.id === deal.stage_id)
  );

  const onDragEnd = async (result: DropResult) => {
    // ... mesma lógica de onDragEnd ...
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const dealIndex = deals.findIndex(d => d.id === draggableId);
    if (dealIndex === -1) return;

    const newDeals = [...deals];
    const [movedDeal] = newDeals.splice(dealIndex, 1);
    movedDeal.stage_id = destination.droppableId;
    movedDeal.position = destination.index;
    
    setDeals(newDeals);
    
    startTransition(async () => {
      const { success } = await updateDealStage(draggableId, destination.droppableId, destination.index);
      if (!success) {
        toast.error("Erro ao mover card");
        setDeals(deals);
      }
    });
  };

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
      }
    });
  };

  const handleCreateDeal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const value = parseFloat(formData.get("value") as string);
    const stageId = showDealModal.stageId;

    if (!title || isNaN(value) || !stageId) return;

    startTransition(async () => {
      const res = await createDeal({
        title,
        value,
        stage_id: stageId,
        company_id: companyId
      });
      if (res.success) {
        toast.success("Oportunidade criada!");
        setShowDealModal({ show: false, stageId: null });
        window.location.reload(); 
      }
    });
  };

  if (!activePipelineId && pipelines.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
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
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header CRM */}
      <header className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d0d0d]/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <select 
            value={activePipelineId} 
            onChange={(e) => setActivePipelineId(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[var(--accent)] outline-none appearance-none cursor-pointer pr-10 min-w-[200px]"
          >
            {pipelines.map(p => (
              <option key={p.id} value={p.id} className="bg-[#1a1a1a]">{p.name}</option>
            ))}
          </select>
          <button 
            onClick={() => setShowPipelineModal(true)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/60 hover:text-white"
            title="Novo Funil"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent)] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Buscar oportunidades..." 
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] outline-none min-w-[250px] transition-all"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm text-white/60">
            <Filter size={16} />
            <span>Filtros</span>
          </button>
        </div>
      </header>

      {/* Kanban Board area */}
      <div className="flex-1 overflow-x-auto p-6 bg-[#0a0a0a]">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full min-h-[calc(100vh-200px)]">
            {activePipeline?.crm_stages?.map((stage: any) => (
              <div 
                key={stage.id} 
                className="flex flex-col w-80 shrink-0 bg-white/[0.02] rounded-2xl border border-white/5 p-4 group/stage"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-sm text-white/80">{stage.name}</h3>
                    <span className="bg-white/5 text-white/30 text-[10px] px-1.5 py-0.5 rounded-full border border-white/5">0</span>
                  </div>
                  <button className="text-white/20 hover:text-white transition-colors opacity-0 group-hover/stage:opacity-100">
                    <MoreVertical size={14} />
                  </button>
                </div>

                {/* Cards Container */}
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableId}
                      ref={provided.innerRef}
                      className={`flex-1 flex flex-col gap-3 min-h-[100px] pb-10 transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-[var(--accent)]/5' : ''}`}
                    >
                      {activePipelineDeals
                        .filter(deal => deal.stage_id === stage.id)
                        .sort((a, b) => a.position - b.position)
                        .map((deal, index) => (
                          <Draggable key={deal.id} draggableId={deal.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`
                                  bg-[#141414] border border-white/5 p-4 rounded-xl shadow-xl transition-all
                                  hover:border-white/20 group/card relative
                                  ${snapshot.isDragging ? 'rotate-3 scale-105 border-[var(--accent)] shadow-[var(--accent)]/10 z-50' : ''}
                                `}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="text-sm font-medium text-white group-hover/card:text-[var(--accent)] transition-colors line-clamp-2">
                                    {deal.title}
                                  </h4>
                                  <button className="text-white/10 hover:text-white transition-colors opacity-0 group-hover/card:opacity-100">
                                    <MoreVertical size={14} />
                                  </button>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                  <div className="flex items-center space-x-1 text-emerald-400 font-bold text-[13px]">
                                    <DollarSign size={13} strokeWidth={3} />
                                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deal.value || 0)}</span>
                                  </div>
                                  
                                  <div className="flex -space-x-2">
                                    {deal.assigned_to ? (
                                      <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px]" title="Assigned">
                                        <User size={12} className="text-white/40" />
                                      </div>
                                    ) : (
                                      <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px]" title="Unassigned">
                                        <Plus size={10} className="text-white/20" />
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-white/[0.03] flex items-center justify-between text-[10px] text-white/20">
                                  <div className="flex items-center space-x-1">
                                    <Calendar size={10} />
                                    <span>{new Date(deal.created_at).toLocaleDateString('pt-BR')}</span>
                                  </div>
                                  <div className={`px-1.5 py-0.5 rounded-md border ${
                                    deal.status === 'won' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' :
                                    deal.status === 'lost' ? 'text-rose-400 border-rose-400/20 bg-rose-400/5' :
                                    'text-white/30 border-white/5 bg-white/5'
                                  }`}>
                                    {deal.status === 'won' ? 'Ganho' : deal.status === 'lost' ? 'Perdido' : 'Aberto'}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      
                      <button 
                        className="w-full py-2 border border-dashed border-white/5 rounded-xl text-[11px] text-white/10 hover:text-[var(--accent)] hover:border-[var(--accent)]/20 hover:bg-[var(--accent)]/5 transition-all mt-2 flex items-center justify-center space-x-2"
                        onClick={() => setShowDealModal({ show: true, stageId: stage.id })}
                      >
                        <Plus size={12} />
                        <span>Novo Card</span>
                      </button>

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* MODAL: NOVO FUNIL */}
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

      {/* MODAL: NOVO CARD */}
      <AnimatePresence>
        {showDealModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDealModal({ show: false, stageId: null })}
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
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Briefcase size={18} className="text-emerald-400" />
                  </div>
                  <h2 className="font-bold text-white text-lg">Nova Oportunidade</h2>
                </div>
                <button onClick={() => setShowDealModal({ show: false, stageId: null })} className="text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateDeal} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Título do Card</label>
                  <input name="title" required autoFocus placeholder="Nome do Cliente ou Projeto" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Valor Estimado (R$)</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400" />
                    <input name="value" type="number" step="0.01" required placeholder="0,00" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all font-bold text-lg" />
                  </div>
                </div>
                <button type="submit" disabled={isPending} className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:brightness-110 transition-all shadow-lg disabled:opacity-50 mt-2">
                  {isPending ? "Salvando..." : "Adicionar à Coluna"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
