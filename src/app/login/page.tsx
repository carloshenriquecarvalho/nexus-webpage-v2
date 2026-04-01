"use client";

import React, { useTransition } from "react";
import { login } from "./actions";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();

  const actionHandler = async (formData: FormData) => {
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        toast.error("Falha no Login", { description: result.error });
      }
    });
  };

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 selection:bg-[var(--accent)] selection:text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bento-card relative z-10 border border-white/10 p-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="/logo-branca.png"
            alt="Nexus Logo"
            width={80}
            height={53}
            className="mb-2"
          />
          <h1 className="text-2xl font-bold tracking-tight">Área Restrita</h1>
          <p className="text-white/60 text-sm text-center">Informe suas credenciais para acessar a Gestão de Boletos.</p>
        </div>

        <form action={actionHandler} className="space-y-6">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-white/80">E-mail Corporativo</span>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input 
                name="email"
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" 
                placeholder="CEO@seusite.com.br" 
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-white/80">Senha de Acesso</span>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input 
                name="password"
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" 
                placeholder="••••••••••" 
              />
            </div>
          </label>

          <button 
            type="submit"
            disabled={isPending}
            className="w-full py-4 mt-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-secondary)] transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isPending ? (
              <span className="animate-pulse">Validando credenciais...</span>
            ) : (
              <>
                <span>Acessar Painel</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
