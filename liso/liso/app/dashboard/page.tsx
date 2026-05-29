import { Topbar, StatCard, Card, Badge } from "@/components/dash";
import { kpis, agendamentos, pacotes, BRL } from "@/lib/data";
import { ArrowUpRight, TriangleAlert } from "lucide-react";

export default function Overview() {
  const k = kpis();
  const hoje = agendamentos.filter((a) => a.data === "2026-05-28");
  const risco = pacotes.filter((p) => p.risco !== "ok");

  return (
    <>
      <Topbar title="Bom dia, Studio Glow 👋" sub="Quarta, 28 de maio · aqui está o pulso da sua clínica hoje." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Faturamento (mês)" value={BRL(k.faturamentoMes)} hint="+24% vs. mês anterior" accent />
        <StatCard label="Agendamentos hoje" value={String(k.agendamentosHoje)} hint={`no-show em ${k.taxaNoShow}%`} />
        <StatCard label="Receita recuperada" value={BRL(k.receitaRecuperada)} hint="via lembretes automáticos" />
        <StatCard label="Pacotes em risco" value={String(k.pacotesEmRisco)} hint="precisam de renovação" />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-semibold">Agenda de hoje</h2>
            <a href="/dashboard/agenda" className="text-sm font-semibold inline-flex items-center gap-1" style={{ color: "var(--color-coral)" }}>
              Ver tudo <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="space-y-1">
            {hoje.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-4 py-3 border-t border-[var(--color-cream-deep)] first:border-0">
                <div className="flex items-center gap-4">
                  <span className="font-display text-lg font-semibold w-14" style={{ color: "var(--color-coral)" }}>{a.horario}</span>
                  <div>
                    <p className="font-medium">{a.clienteNome}</p>
                    <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>{a.servico} · {a.profissional}</p>
                  </div>
                </div>
                <Badge status={a.status} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center gap-2 mb-5">
            <TriangleAlert className="h-5 w-5" style={{ color: "var(--color-coral-deep)" }} />
            <h2 className="font-display text-xl font-semibold">Pacotes a renovar</h2>
          </div>
          <div className="space-y-4">
            {risco.map((p) => (
              <div key={p.id} className="rounded-2xl bg-[var(--color-cream)] p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{p.clienteNome}</p>
                  <Badge status={p.risco} />
                </div>
                <p className="text-xs mb-2" style={{ color: "var(--color-ink-soft)" }}>{p.pacote}</p>
                <div className="h-1.5 rounded-full bg-white overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(p.sessoesUsadas / p.sessoesTotais) * 100}%`, background: "var(--color-coral)" }} />
                </div>
                <p className="text-[11px] mt-1.5" style={{ color: "var(--color-ink-soft)" }}>{p.sessoesUsadas}/{p.sessoesTotais} sessões · vence {new Date(p.venceEm).toLocaleDateString("pt-BR")}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
