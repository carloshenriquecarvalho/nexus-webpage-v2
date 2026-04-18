"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, User, Mail, Phone, Pencil, Trash2,
  Search, UserPlus, AlertTriangle, Tag, ChevronRight,
} from "lucide-react";
import { createContact, updateContact, deleteContact } from "./actions";
import { toast } from "sonner";

export interface Contact {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  custom_fields?: Record<string, string> | null;
  created_at?: string;
}

interface ContactsPanelProps {
  contacts: Contact[];
  companyId: string;
  onContactsChange: (contacts: Contact[]) => void;
}

/* ────────────────────────────────────────
   Avatar com iniciais
──────────────────────────────────────── */
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? "")
    .join("");

  const colors = [
    "from-violet-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-teal-600",
    "from-sky-500 to-blue-600",
    "from-[var(--accent)] to-pink-600",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];

  return (
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg`}>
      {initials}
    </div>
  );
}

/* ────────────────────────────────────────
   Modal de Criação / Edição de Contato
──────────────────────────────────────── */
interface ContactModalProps {
  mode: "create" | "edit";
  contact?: Contact | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Contact, "id" | "created_at">) => void;
}

function ContactModal({ mode, contact, isPending, onClose, onSubmit }: ContactModalProps) {
  const [name, setName]   = useState(contact?.name ?? "");
  const [email, setEmail] = useState(contact?.email ?? "");
  const [phone, setPhone] = useState(contact?.phone ?? "");

  // custom_fields dinâmicos
  const initFields = contact?.custom_fields
    ? Object.entries(contact.custom_fields).map(([k, v]) => ({ key: k, value: v }))
    : [];
  const [fields, setFields] = useState<{ key: string; value: string }[]>(initFields);

  const addField = () => setFields(f => [...f, { key: "", value: "" }]);
  const removeField = (i: number) => setFields(f => f.filter((_, idx) => idx !== i));
  const updateField = (i: number, part: "key" | "value", val: string) =>
    setFields(f => f.map((x, idx) => idx === i ? { ...x, [part]: val } : x));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const custom_fields = fields
      .filter(f => f.key.trim() && f.value.trim())
      .reduce<Record<string, string>>((acc, f) => ({ ...acc, [f.key.trim()]: f.value.trim() }), {});

    onSubmit({
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
      custom_fields: Object.keys(custom_fields).length > 0 ? custom_fields : null,
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
        className="relative w-full max-w-lg bg-[#111111] border border-white/10 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isEdit ? "bg-[var(--accent)]/10 border-[var(--accent)]/20" : "bg-emerald-500/10 border-emerald-500/20"}`}>
              {isEdit
                ? <Pencil size={16} className="text-[var(--accent)]" />
                : <UserPlus size={18} className="text-emerald-400" />
              }
            </div>
            <div>
              <h2 className="font-bold text-white text-lg leading-tight">
                {isEdit ? "Editar Contato" : "Novo Contato"}
              </h2>
              <p className="text-white/30 text-xs mt-0.5">
                {isEdit ? "Atualize as informações" : "Cadastre um lead ou cliente"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Nome *</label>
            <div className="relative">
              <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required autoFocus
                placeholder="Nome completo ou empresa"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-5 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">E-mail</label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="contato@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-5 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all text-sm"
              />
            </div>
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
            <div className="relative">
              <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+55 (11) 99999-9999"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-5 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all text-sm"
              />
            </div>
          </div>

          {/* Campos Customizados */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">
                Campos Extras (custom_fields)
              </label>
              <button
                type="button"
                onClick={addField}
                className="flex items-center gap-1.5 text-[10px] text-[var(--accent)] hover:text-white transition-colors font-semibold"
              >
                <Plus size={12} />
                Adicionar
              </button>
            </div>

            <AnimatePresence initial={false}>
              {fields.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2"
                >
                  <div className="relative flex-1">
                    <Tag size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                      value={f.key}
                      onChange={e => updateField(i, "key", e.target.value)}
                      placeholder="Campo"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-white/80 placeholder-white/15 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/40 text-xs"
                    />
                  </div>
                  <input
                    value={f.value}
                    onChange={e => updateField(i, "value", e.target.value)}
                    placeholder="Valor"
                    className="flex-[2] bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/80 placeholder-white/15 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/40 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeField(i)}
                    className="p-2 text-white/20 hover:text-rose-400 transition-colors rounded-xl hover:bg-rose-400/5"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {fields.length === 0 && (
              <button
                type="button"
                onClick={addField}
                className="w-full py-2.5 border border-dashed border-white/5 rounded-xl text-[11px] text-white/15 hover:text-white/40 hover:border-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={11} /> Adicionar campo personalizado (ex: Nicho, Cargo, Origem)
              </button>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-4 rounded-2xl font-bold transition-all disabled:opacity-50 text-sm mt-2 ${
              isEdit
                ? "bg-[var(--accent)] text-black hover:brightness-110"
                : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110"
            }`}
          >
            {isPending
              ? (isEdit ? "Salvando..." : "Criando...")
              : (isEdit ? "Salvar Alterações" : "Cadastrar Contato")
            }
          </button>
        </form>
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────
   Modal de Confirmação de Exclusão
──────────────────────────────────────── */
function DeleteConfirmModal({
  contact, isPending, onClose, onConfirm
}: { contact: Contact; isPending: boolean; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
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
        <h3 className="font-bold text-white text-lg mb-2">Excluir contato?</h3>
        <p className="text-white/40 text-sm mb-6">
          <span className="text-white/70 font-medium">{contact.name}</span> será removido permanentemente.
          Os deals vinculados a ele perderão o contato.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white transition-all text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-all text-sm disabled:opacity-50"
          >
            {isPending ? "Excluindo..." : "Sim, excluir"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────
   Painel Principal de Contatos
──────────────────────────────────────── */
export default function ContactsPanel({ contacts: initialContacts, companyId, onContactsChange }: ContactsPanelProps) {
  const [contacts, setContacts]     = useState<Contact[]>(initialContacts);
  const [search, setSearch]         = useState("");
  const [isPending, startTransition] = useTransition();

  // Modais
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal]     = useState<{ show: boolean; contact: Contact | null }>({ show: false, contact: null });
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; contact: Contact | null }>({ show: false, contact: null });

  // Linha expandida para ver custom_fields
  const [expanded, setExpanded]   = useState<string | null>(null);

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const syncUp = (updated: Contact[]) => {
    setContacts(updated);
    onContactsChange(updated);
  };

  /* ── Criar ── */
  const handleCreate = (data: Omit<Contact, "id" | "created_at">) => {
    startTransition(async () => {
      const res = await createContact({ ...data, company_id: companyId });
      if (res.success && res.data) {
        const next = [...contacts, res.data as Contact].sort((a, b) => a.name.localeCompare(b.name));
        syncUp(next);
        toast.success("Contato criado!");
        setCreateModal(false);
      } else {
        toast.error("Erro ao criar contato.");
      }
    });
  };

  /* ── Atualizar ── */
  const handleUpdate = (data: Omit<Contact, "id" | "created_at">) => {
    if (!editModal.contact) return;
    const contactId = editModal.contact.id;
    startTransition(async () => {
      const res = await updateContact(contactId, data);
      if (res.success && res.data) {
        const next = contacts.map(c => c.id === contactId ? { ...c, ...(res.data as Contact) } : c);
        syncUp(next);
        toast.success("Contato atualizado!");
        setEditModal({ show: false, contact: null });
      } else {
        toast.error("Erro ao atualizar contato.");
      }
    });
  };

  /* ── Deletar ── */
  const handleDelete = () => {
    if (!deleteModal.contact) return;
    const contactId = deleteModal.contact.id;
    startTransition(async () => {
      const res = await deleteContact(contactId);
      if (res.success) {
        const next = contacts.filter(c => c.id !== contactId);
        syncUp(next);
        toast.success("Contato excluído.");
        setDeleteModal({ show: false, contact: null });
      } else {
        toast.error("Erro ao excluir contato.");
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0a]">
      {/* Sub-header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between gap-4 flex-wrap">
        <div className="relative group">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent)] transition-colors" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone..."
            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] outline-none w-72 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-white/20 text-xs">{filtered.length} contato{filtered.length !== 1 ? "s" : ""}</span>
          <button
            onClick={() => setCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-black text-sm font-bold hover:brightness-110 transition-all"
          >
            <UserPlus size={15} />
            Novo Contato
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-4">
              <User size={24} className="text-white/10" />
            </div>
            <p className="text-white/30 text-sm">
              {search ? "Nenhum contato encontrado" : "Nenhum contato ainda"}
            </p>
            {!search && (
              <button
                onClick={() => setCreateModal(true)}
                className="mt-4 text-[var(--accent)] text-sm font-medium hover:underline"
              >
                + Cadastrar primeiro contato
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-2">
            {/* Header da tabela */}
            <div className="grid grid-cols-[2fr_2fr_1.5fr_auto] gap-4 px-4 py-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
              <span>Nome</span>
              <span>E-mail</span>
              <span>Telefone</span>
              <span className="text-right">Ações</span>
            </div>

            <AnimatePresence initial={false}>
              {filtered.map(contact => {
                const hasExtras = contact.custom_fields && Object.keys(contact.custom_fields).length > 0;
                const isExpanded = expanded === contact.id;

                return (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all group"
                  >
                    {/* Linha principal */}
                    <div className="grid grid-cols-[2fr_2fr_1.5fr_auto] gap-4 items-center px-4 py-3.5">
                      {/* Nome + avatar */}
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={contact.name} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate group-hover:text-[var(--accent)] transition-colors">
                            {contact.name}
                          </p>
                          {hasExtras && (
                            <button
                              onClick={() => setExpanded(isExpanded ? null : contact.id)}
                              className="flex items-center gap-1 text-[10px] text-white/25 hover:text-white/50 transition-colors mt-0.5"
                            >
                              <ChevronRight size={10} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                              {Object.keys(contact.custom_fields!).length} campo{Object.keys(contact.custom_fields!).length !== 1 ? "s" : ""} extra{Object.keys(contact.custom_fields!).length !== 1 ? "s" : ""}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div className="min-w-0">
                        {contact.email ? (
                          <a
                            href={`mailto:${contact.email}`}
                            className="flex items-center gap-2 text-sm text-white/50 hover:text-[var(--accent)] transition-colors truncate"
                            onClick={e => e.stopPropagation()}
                          >
                            <Mail size={13} className="shrink-0 text-white/20" />
                            <span className="truncate">{contact.email}</span>
                          </a>
                        ) : (
                          <span className="text-white/15 text-sm">—</span>
                        )}
                      </div>

                      {/* Telefone */}
                      <div className="min-w-0">
                        {contact.phone ? (
                          <a
                            href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-2 text-sm text-white/50 hover:text-emerald-400 transition-colors"
                          >
                            <Phone size={13} className="shrink-0 text-white/20" />
                            <span>{contact.phone}</span>
                          </a>
                        ) : (
                          <span className="text-white/15 text-sm">—</span>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditModal({ show: true, contact })}
                          className="p-2 rounded-xl text-white/30 hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, contact })}
                          className="p-2 rounded-xl text-white/30 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Campos extras expandidos */}
                    <AnimatePresence>
                      {isExpanded && hasExtras && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/5 px-4 py-3 bg-white/[0.01]"
                        >
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(contact.custom_fields!).map(([k, v]) => (
                              <div key={k} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                <Tag size={10} className="text-[var(--accent)]" />
                                <span className="text-[11px] text-white/40 font-medium">{k}:</span>
                                <span className="text-[11px] text-white/70">{v}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── MODAL: CRIAR ── */}
      <AnimatePresence>
        {createModal && (
          <ContactModal
            mode="create"
            isPending={isPending}
            onClose={() => setCreateModal(false)}
            onSubmit={handleCreate}
          />
        )}
      </AnimatePresence>

      {/* ── MODAL: EDITAR ── */}
      <AnimatePresence>
        {editModal.show && editModal.contact && (
          <ContactModal
            mode="edit"
            contact={editModal.contact}
            isPending={isPending}
            onClose={() => setEditModal({ show: false, contact: null })}
            onSubmit={handleUpdate}
          />
        )}
      </AnimatePresence>

      {/* ── MODAL: CONFIRMAR EXCLUSÃO ── */}
      <AnimatePresence>
        {deleteModal.show && deleteModal.contact && (
          <DeleteConfirmModal
            contact={deleteModal.contact}
            isPending={isPending}
            onClose={() => setDeleteModal({ show: false, contact: null })}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
