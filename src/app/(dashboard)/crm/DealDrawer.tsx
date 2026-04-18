"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Pencil, DollarSign, User, Mail, Phone,
  CheckCircle2, XCircle, Circle,
  StickyNote, Info, Send, Trash2,
  Calendar, Clock, FileText,
} from "lucide-react";
import { updateDeal, getNotesByDeal, addDealNote, deleteDealNote } from "./actions";
import { type Contact } from "./ContactsPanel";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────

export interface DealNote {
  id: string;
  content: string;
  created_at: string;
}

export interface DrawerDeal {
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

interface DealDrawerProps {
  deal: DrawerDeal;
  contacts: Contact[];
  onClose: () => void;
  onDealUpdate: (updated: DrawerDeal) => void;
}

// ── Status config ──────────────────────────────────

const STATUS_CONFIG = {
  open:  { label: "Aberto",  Icon: Circle,       color: "text-white/40",    border: "border-white/10",        bg: "bg-white/5" },
  won:   { label: "Ganho",   Icon: CheckCircle2, color: "text-emerald-400", border: "border-emerald-500/20",  bg: "bg-emerald-500/5" },
  lost:  { label: "Perdido", Icon: XCircle,      color: "text-rose-400",    border: "border-rose-500/20",     bg: "bg-rose-500/5" },
};

// ── Drawer ─────────────────────────────────────────

export default function DealDrawer({ deal, contacts, onClose, onDealUpdate }: DealDrawerProps) {
  const [activeTab, setActiveTab] = useState<"details" | "notes">("details");

  // Details state
  const [isPending, startTransition] = useTransition();
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [title, setTitle]         = useState(deal.title);
  const [value, setValue]         = useState(deal.value.toString());
  const [status, setStatus]       = useState(deal.status);
  const [contactId, setContactId] = useState(deal.contact_id ?? "");

  // Notes state
  const [notes, setNotes]             = useState<DealNote[]>([]);
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [noteText, setNoteText]       = useState("");
  const [isAddingNote, startNoteTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load notes when Notes tab first opens
  useEffect(() => {
    if (activeTab === "notes" && !notesLoaded) {
      startTransition(async () => {
        const data = await getNotesByDeal(deal.id);
        setNotes(data as DealNote[]);
        setNotesLoaded(true);
      });
    }
  }, [activeTab, notesLoaded, deal.id]);

  // ── Save details ──
  const handleSaveDetails = () => {
    const parsedValue = parseFloat(value);
    if (!title.trim() || isNaN(parsedValue)) return;

    startTransition(async () => {
      const res = await updateDeal(deal.id, {
        title: title.trim(),
        value: parsedValue,
        status,
        contact_id: contactId || null,
      });
      if (res.success && res.data) {
        const contact = contactId ? contacts.find(c => c.id === contactId) ?? null : null;
        onDealUpdate({ ...deal, title: title.trim(), value: parsedValue, status, contact_id: contactId || null, crm_contacts: contact });
        toast.success("Deal atualizado!");
        setIsEditingDetails(false);
      } else {
        toast.error("Erro ao salvar.");
      }
    });
  };

  // ── Add note ──
  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const content = noteText.trim();
    setNoteText("");

    startNoteTransition(async () => {
      const res = await addDealNote(deal.id, content);
      if (res.success && res.data) {
        setNotes(prev => [res.data as DealNote, ...prev]);
        toast.success("Nota adicionada!");
      } else {
        toast.error("Erro ao adicionar nota.");
        setNoteText(content); // restore text if failed
      }
    });
  };

  // ── Delete note ──
  const handleDeleteNote = (noteId: string) => {
    startNoteTransition(async () => {
      const res = await deleteDealNote(noteId);
      if (res.success) {
        setNotes(prev => prev.filter(n => n.id !== noteId));
      } else {
        toast.error("Erro ao excluir nota.");
      }
    });
  };

  const contact = contacts.find(c => c.id === (contactId || deal.contact_id));
  const statusCfg = STATUS_CONFIG[deal.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.open;
  const { Icon: StatusIcon } = statusCfg;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-lg z-50 flex flex-col bg-[#0f0f0f] border-l border-white/10 shadow-2xl overflow-hidden"
      >
        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              {isEditingDetails ? (
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
                />
              ) : (
                <h2 className="text-white font-bold text-lg leading-tight truncate">{deal.title}</h2>
              )}

              <div className="flex items-center gap-3 mt-2">
                {/* Status badge */}
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${statusCfg.color} ${statusCfg.border} ${statusCfg.bg}`}>
                  <StatusIcon size={11} />
                  {statusCfg.label}
                </div>
                {/* Value */}
                <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm">
                  <DollarSign size={12} strokeWidth={3} />
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(deal.value)}
                </div>
                {/* Date */}
                <div className="flex items-center gap-1 text-white/20 text-[11px]">
                  <Calendar size={10} />
                  {formatDate(deal.created_at)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {!isEditingDetails && (
                <button
                  onClick={() => setIsEditingDetails(true)}
                  className="p-2 rounded-xl text-white/30 hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all"
                  title="Editar"
                >
                  <Pencil size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ── Tab switcher ── */}
          <div className="flex gap-1 bg-white/5 border border-white/5 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex items-center gap-2 flex-1 justify-center py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "details"
                  ? "bg-white/10 text-white"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              <Info size={13} />
              Detalhes
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex items-center gap-2 flex-1 justify-center py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "notes"
                  ? "bg-white/10 text-white"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              <StickyNote size={13} />
              Notas
              {notes.length > 0 && (
                <span className="bg-[var(--accent)]/20 text-[var(--accent)] text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {notes.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait" initial={false}>

            {/* ── TAB: DETALHES ── */}
            {activeTab === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 overflow-y-auto p-6 space-y-6"
              >
                {/* Valor */}
                <section>
                  <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-2">Valor do Deal</p>
                  {isEditingDetails ? (
                    <div className="relative">
                      <DollarSign size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                      <input
                        type="number" step="0.01" min="0"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
                      />
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-emerald-400">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(deal.value)}
                    </p>
                  )}
                </section>

                {/* Status */}
                <section>
                  <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-2">Status</p>
                  {isEditingDetails ? (
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.entries(STATUS_CONFIG) as [string, typeof STATUS_CONFIG["open"]][]).map(([key, cfg]) => {
                        const { Icon } = cfg;
                        const active = status === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setStatus(key)}
                            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                              active ? `${cfg.color} ${cfg.border} ${cfg.bg}` : "text-white/20 border-white/5 hover:border-white/10 hover:text-white/40"
                            }`}
                          >
                            <Icon size={13} />
                            {cfg.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold ${statusCfg.color} ${statusCfg.border} ${statusCfg.bg}`}>
                      <StatusIcon size={14} />
                      {statusCfg.label}
                    </div>
                  )}
                </section>

                {/* Contato */}
                <section>
                  <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-2">Contato Vinculado</p>
                  {isEditingDetails ? (
                    <select
                      value={contactId}
                      onChange={e => setContactId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 appearance-none text-sm"
                    >
                      <option value="" className="bg-[#1a1a1a] text-white/40">— Sem contato —</option>
                      {contacts.map(c => (
                        <option key={c.id} value={c.id} className="bg-[#1a1a1a]">
                          {c.name}{c.email ? ` · ${c.email}` : ""}
                        </option>
                      ))}
                    </select>
                  ) : contact ? (
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        {/* Contact avatar */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-pink-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {contact.name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{contact.name}</p>
                          <p className="text-white/30 text-xs">Contato vinculado</p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1 border-t border-white/5">
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="flex items-center gap-3 text-sm text-white/50 hover:text-[var(--accent)] transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                              <Mail size={13} className="text-white/30 group-hover:text-[var(--accent)] transition-colors" />
                            </div>
                            <span className="truncate">{contact.email}</span>
                          </a>
                        )}
                        {contact.phone && (
                          <a
                            href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-sm text-white/50 hover:text-emerald-400 transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                              <Phone size={13} className="text-white/30 group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <span>{contact.phone}</span>
                            <span className="text-[10px] text-white/20 group-hover:text-emerald-400/50">→ WhatsApp</span>
                          </a>
                        )}
                        {/* Custom fields */}
                        {contact.custom_fields && Object.entries(contact.custom_fields).map(([k, v]) => (
                          <div key={k} className="flex items-center gap-3 text-sm">
                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                              <FileText size={11} className="text-white/20" />
                            </div>
                            <span className="text-white/30 font-medium">{k}:</span>
                            <span className="text-white/60">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/[0.02] border border-dashed border-white/5 rounded-2xl p-4 text-center">
                      <User size={20} className="text-white/10 mx-auto mb-1" />
                      <p className="text-white/20 text-xs">Nenhum contato vinculado</p>
                    </div>
                  )}
                </section>

                {/* Save / Cancel */}
                {isEditingDetails && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setTitle(deal.title);
                        setValue(deal.value.toString());
                        setStatus(deal.status);
                        setContactId(deal.contact_id ?? "");
                        setIsEditingDetails(false);
                      }}
                      className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveDetails}
                      disabled={isPending}
                      className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-black font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {isPending ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── TAB: NOTAS ── */}
            {activeTab === "notes" && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 flex flex-col"
              >
                {/* Input area */}
                <div className="p-4 border-b border-white/5 bg-[#0f0f0f] flex-shrink-0">
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault();
                          handleAddNote();
                        }
                      }}
                      placeholder="Escreva uma nota sobre o andamento deste lead... (Ctrl+Enter para enviar)"
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all pr-12"
                    />
                    <button
                      onClick={handleAddNote}
                      disabled={!noteText.trim() || isAddingNote}
                      className="absolute right-3 bottom-3 p-2 rounded-xl bg-[var(--accent)] text-black disabled:opacity-30 disabled:bg-white/10 disabled:text-white/30 hover:brightness-110 transition-all"
                      title="Enviar (Ctrl+Enter)"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>

                {/* Notes list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {!notesLoaded ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-3" />
                      <p className="text-white/20 text-xs">Carregando notas...</p>
                    </div>
                  ) : notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-4">
                        <StickyNote size={20} className="text-white/10" />
                      </div>
                      <p className="text-white/25 text-sm font-medium">Nenhuma nota ainda</p>
                      <p className="text-white/15 text-xs mt-1">Registre o andamento deste lead acima</p>
                    </div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {notes.map((note) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          className="group relative bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all"
                        >
                          <p className="text-sm text-white/75 leading-relaxed whitespace-pre-wrap">
                            {note.content}
                          </p>

                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.04]">
                            <div className="flex items-center gap-3 text-[10px] text-white/20">
                              <span className="flex items-center gap-1">
                                <Calendar size={9} />
                                {formatDate(note.created_at)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={9} />
                                {formatTime(note.created_at)}
                              </span>
                            </div>

                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              disabled={isAddingNote}
                              className="p-1.5 rounded-lg text-white/10 hover:text-rose-400 hover:bg-rose-500/5 transition-all opacity-0 group-hover:opacity-100"
                              title="Excluir nota"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
}
