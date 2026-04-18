import { ReactNode } from "react";
import { Toaster } from "sonner";
import { createClient } from "@/utils/supabase/server";
import { GoogleCalendarConnect } from "@/components/dashboard/GoogleCalendarConnect";
import { FileText, Globe, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Verifica se o usuário já conectou o Google Calendar
  const isCalendarConnected = user?.user_metadata?.google_calendar_connected === true;

  return (
    <div className="h-screen bg-[var(--background)] text-[var(--foreground)] flex overflow-hidden">
      <aside className="w-64 border-r border-white/10 hidden md:flex flex-col p-6 gap-6 bg-[#0d0d0d]">

        {/* Brand */}
        <div className="flex items-center space-x-3 pb-2 border-b border-white/10">
          <Image src="/logo-branca.png" alt="Nexus" width={40} height={27} className="object-contain" />
          <div>
            <p className="text-sm font-bold leading-tight">Nexus</p>
            <p className="text-xs text-white/40 leading-tight">Gestão Interna</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          <Link
            href="/gestao"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-all text-sm"
          >
            <FileText size={16} className="text-[var(--accent)]" />
            <span>Contas a Pagar</span>
          </Link>
          <Link
            href="/crm"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-all text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50 hover:text-[var(--accent)]"><path d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M8 7v6"/><path d="M16 7v10"/></svg>
            <span>CRM</span>
          </Link>
          <Link
            href="/martech-lab"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-all text-sm"
          >
            <Globe size={16} className="text-white/50" />
            <span>Martech Lab</span>
          </Link>
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl mt-auto text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm"
          >
            <Globe size={16} />
            <span>Voltar ao site</span>
          </Link>
        </nav>

        {/* Bottom section */}
        <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
          {/* Google Calendar Connection */}
          <GoogleCalendarConnect isConnected={isCalendarConnected} />

          {/* User info */}
          {user && (
            <div className="px-3 py-2 rounded-xl bg-white/5 text-xs text-white/50 truncate">
              {user.email}
            </div>
          )}

          {/* Logout */}
          <form action={async () => {
            "use server";
            const { logout } = await import("@/app/login/actions");
            await logout();
          }}>
            <button
              type="submit"
              className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-white/50 hover:text-[var(--accent)] hover:bg-white/5 transition-all text-sm w-full"
            >
              <LogOut size={15} />
              <span>Sair do Painel</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto">
        {children}
      </main>

      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}
