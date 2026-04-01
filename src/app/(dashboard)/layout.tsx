import { ReactNode } from "react";
import { Toaster } from "sonner";
import { createClient } from "@/utils/supabase/server";
import { GoogleCalendarConnect } from "@/components/dashboard/GoogleCalendarConnect";
import { FileText, Globe, LogOut } from "lucide-react";
import Image from "next/image";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Verifica se o usuário já conectou o Google Calendar
  const isCalendarConnected = user?.user_metadata?.google_calendar_connected === true;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex">
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
          <a
            href="/gestao"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-all text-sm"
          >
            <FileText size={16} className="text-[var(--accent)]" />
            <span>Boletos</span>
          </a>
          <a
            href="/"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm"
          >
            <Globe size={16} />
            <span>Voltar ao site</span>
          </a>
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
