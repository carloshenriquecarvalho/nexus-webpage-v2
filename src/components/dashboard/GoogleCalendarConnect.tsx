"use client";

import React, { useTransition } from "react";
import { CalendarCheck, CalendarX2, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface GoogleCalendarConnectProps {
  isConnected: boolean;
}

export function GoogleCalendarConnect({ isConnected }: GoogleCalendarConnectProps) {
  const [isPending, startTransition] = useTransition();

  const handleConnect = () => {
    startTransition(async () => {
      const supabase = createClient();
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
      const { error } = await supabase.auth.linkIdentity({
        provider: "google",
        options: {
          redirectTo: `${appUrl}/auth/callback`,
          scopes: "https://www.googleapis.com/auth/calendar.events",
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        toast.error("Erro ao conectar", { description: error.message });
      }
      // Se não houver erro, o Supabase redireciona para o Google automaticamente
    });
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
        <CalendarCheck size={14} />
        <span>Calendar conectado</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isPending}
      className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-xs text-white/60 hover:text-white disabled:opacity-50 w-full"
    >
      {isPending ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <CalendarX2 size={14} className="text-[var(--accent)]" />
      )}
      <span>{isPending ? "Redirecionando..." : "Conectar Google Calendar"}</span>
    </button>
  );
}
