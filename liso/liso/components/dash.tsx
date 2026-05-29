"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CalendarDays, Users, Package, MessageSquare,
  Wallet, Settings, LogOut, Bell, Search,
} from "lucide-react";
import { Logo } from "@/components/site";

const NAV = [
  { href: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { href: "/dashboard/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/pacotes", label: "Pacotes", icon: Package },
  { href: "/dashboard/lembretes", label: "Lembretes", icon: MessageSquare },
  { href: "/dashboard/financeiro", label: "Financeiro", icon: Wallet },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-[var(--color-cream-deep)] bg-white/60 backdrop-blur px-4 py-6 sticky top-0 h-screen">
      <div className="px-2 mb-8"><Logo /></div>
      <nav className="flex-1 space-y-1">
        {NAV.map((n) => {
          const active = path === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition"
              style={{
                background: active ? "var(--color-ink)" : "transparent",
                color: active ? "var(--color-cream)" : "var(--color-ink-soft)",
              }}
            >
              <n.icon className="h-[18px] w-[18px]" />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-[var(--color-cream)]" style={{ color: "var(--color-ink-soft)" }}>
        <LogOut className="h-[18px] w-[18px]" /> Sair
      </Link>
    </aside>
  );
}

export function Topbar({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="flex items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="text-sm mt-1" style={{ color: "var(--color-ink-soft)" }}>{sub}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 rounded-full bg-white border border-[var(--color-cream-deep)] px-4 py-2 text-sm" style={{ color: "var(--color-ink-soft)" }}>
          <Search className="h-4 w-4" /> Buscar…
        </div>
        <button className="relative h-10 w-10 rounded-full bg-white border border-[var(--color-cream-deep)] grid place-items-center">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full" style={{ background: "var(--color-coral)" }} />
        </button>
        <div className="h-10 w-10 rounded-full grid place-items-center font-semibold text-[var(--color-cream)]" style={{ background: "var(--color-coral)" }}>
          SG
        </div>
      </div>
    </header>
  );
}

export function StatCard({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div
      className="rounded-[var(--radius-xl2)] p-6 border"
      style={{
        background: accent ? "var(--color-ink)" : "white",
        borderColor: accent ? "transparent" : "var(--color-cream-deep)",
        color: accent ? "var(--color-cream)" : "inherit",
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent ? "var(--color-amber)" : "var(--color-ink-soft)" }}>{label}</p>
      <p className="font-display text-3xl font-semibold mt-2">{value}</p>
      {hint && <p className="text-xs mt-2" style={{ color: accent ? "color-mix(in srgb, var(--color-cream) 70%, transparent)" : "var(--color-jade)" }}>{hint}</p>}
    </div>
  );
}

const BADGE: Record<string, { bg: string; fg: string; label: string }> = {
  confirmado: { bg: "rgba(46,125,107,0.12)", fg: "var(--color-jade)", label: "Confirmado" },
  pendente: { bg: "rgba(240,163,94,0.16)", fg: "var(--color-coral-deep)", label: "Pendente" },
  realizado: { bg: "rgba(26,20,17,0.08)", fg: "var(--color-ink)", label: "Realizado" },
  no_show: { bg: "rgba(194,74,48,0.12)", fg: "var(--color-coral-deep)", label: "No-show" },
  cancelado: { bg: "rgba(26,20,17,0.06)", fg: "var(--color-ink-soft)", label: "Cancelado" },
  enviado: { bg: "rgba(46,125,107,0.12)", fg: "var(--color-jade)", label: "Enviado" },
  respondido: { bg: "rgba(46,125,107,0.18)", fg: "var(--color-jade)", label: "Respondido ✓" },
  agendado: { bg: "rgba(240,163,94,0.16)", fg: "var(--color-coral-deep)", label: "Agendado" },
  falhou: { bg: "rgba(194,74,48,0.14)", fg: "var(--color-coral-deep)", label: "Falhou" },
  ok: { bg: "rgba(46,125,107,0.12)", fg: "var(--color-jade)", label: "Em dia" },
  vencendo: { bg: "rgba(240,163,94,0.16)", fg: "var(--color-coral-deep)", label: "Vencendo" },
  esgotando: { bg: "rgba(194,74,48,0.14)", fg: "var(--color-coral-deep)", label: "Esgotando" },
};

export function Badge({ status }: { status: string }) {
  const s = BADGE[status] || BADGE.cancelado;
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[var(--radius-xl2)] bg-white border border-[var(--color-cream-deep)] ${className}`}>{children}</div>;
}
