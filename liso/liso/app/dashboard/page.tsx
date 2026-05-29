import { Topbar, StatCard, Card, Badge, EmptyState } from "@/components/dash";
import { exigirSessao } from "@/lib/auth";
import { getClinica, getKpis, getAgendamentos, getPacotesCliente, BRL, hojeLabel } from "@/lib/queries";
import { ArrowUpRight, TriangleAlert } from "lucide-react";

export default async function Overview() {
  const { cid } = await exigirSessao();
  const [clinica, k, ags, pcs] = await Promise.all([
    getClinica(cid), getKpis(cid), getAgendamentos(cid), getPacotesCliente(cid),
  ]);
  const hoje = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
  const agHoje = ags.filter((a) => a.data === hoje);
  const risco = pcs.filter((p) => p.risco !== "ok");
  const primeiroNome = (clinica?.nome ?? "").split(" ")[0] || "tudo certo";

  return (
    <>
      <Topbar title={`Olá, ${primeiroNome} 👋`} sub={`${hojeLabel()} · o pulso da sua clínica hoje.`} clinica={clinica?.nome} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Faturamento (mês)" value={BRL(k.faturamentoMes)} hint="sessões realizadas" accent />
        <StatCard label="Agendamentos hoje" value={String(k.agendamentosHoje)} hint={`no-show em ${k.taxaNoShow}%`} />
        <StatCard label="Lembretes enviados" value={String(k.lembretesEnviados)} hint="via WhatsApp" />
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
          {agHoje.length === 0 ? (
            <EmptyState title="Nenhum agendamento hoje" sub="Quando você criar agendamentos, eles aparecem aqui." />
          ) : (
            <div className="space-y-1">
              {agHoje.map((a) => (
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
          )}
        </Card>

        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center gap-2 mb-5">
            <TriangleAlert className="h-5 w-5" style={{ color: "var(--color-coral-deep)" }} />
            <h2 className="font-display text-xl font-semibold">Pacotes a renovar</h2>
          </div>
          {risco.length === 0 ? (
            <EmptyState title="Tudo em dia" sub="Nenhum pacote em risco agora." />
          ) : (
            <div className="space-y-4">
              {risco.map((p) => (
                <div key={p.id} className="rounded-2xl bg-[var(--color-cream)] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{p.clienteNome}</p>
                    <Badge status={p.risco} />
                  </div>
                  <p className="text-xs mb-2" style={{ color: "var(--color-ink-soft)" }}>{p.pacote}</p>
                  <div className="h-1.5 rounded-full bg-white overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p.sessoesTotais ? (p.sessoesUsadas / p.sessoesTotais) * 100 : 0}%`, background: "var(--color-coral)" }} />
                  </div>
                  <p className="text-[11px] mt-1.5" style={{ color: "var(--color-ink-soft)" }}>{p.sessoesUsadas}/{p.sessoesTotais} sessões{p.venceEm ? ` · vence ${new Date(p.venceEm).toLocaleDateString("pt-BR")}` : ""}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
