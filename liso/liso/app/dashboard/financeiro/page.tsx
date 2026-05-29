import { Topbar, StatCard, Card, EmptyState } from "@/components/dash";
import { NovoServicoBtn } from "@/components/forms";
import { exigirSessao } from "@/lib/auth";
import { getKpis, getServicos, getClinica, BRL } from "@/lib/queries";
import { Check } from "lucide-react";

const PLANO_LBL: Record<string, { nome: string; preco: string; selo?: string }> = {
  trial: { nome: "Teste grátis", preco: "14 dias" },
  founding: { nome: "Founding Member", preco: "R$ 98", selo: "50% OFF VITALÍCIO" },
  full: { nome: "Liso completo", preco: "R$ 197" },
};

export default async function Financeiro() {
  const { cid } = await exigirSessao();
  const [k, servicos, clinica] = await Promise.all([getKpis(cid), getServicos(cid), getClinica(cid)]);
  const plano = PLANO_LBL[clinica?.plano ?? "trial"] ?? PLANO_LBL.trial;
  const trial = clinica?.trialTerminaEm ? new Date(clinica.trialTerminaEm) : null;

  return (
    <>
      <Topbar title="Financeiro & Assinatura" sub="Faturamento da clínica e o seu plano Liso." clinica={clinica?.nome} />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Faturamento (mês)" value={BRL(k.faturamentoMes)} hint="sessões realizadas" accent />
        <StatCard label="Ticket médio" value={BRL(k.ticketMedio)} hint="por sessão" />
        <StatCard label="Pacotes em risco" value={String(k.pacotesEmRisco)} hint="renovação pendente" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold mb-4">Seu plano</h2>
          <div className="rounded-2xl p-5 mb-4" style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}>
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl font-semibold">{plano.nome}</span>
              {plano.selo && <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "var(--color-coral)" }}>{plano.selo}</span>}
            </div>
            <p className="mt-2 text-3xl font-display font-semibold">{plano.preco}{plano.preco.startsWith("R$") && <span className="text-base font-normal">/mês</span>}</p>
            {trial && clinica?.plano === "trial" && (
              <p className="mt-2 text-sm" style={{ color: "color-mix(in srgb, var(--color-cream) 70%, transparent)" }}>
                Teste termina em {trial.toLocaleDateString("pt-BR")}
              </p>
            )}
          </div>
          <button className="w-full rounded-full px-5 py-3 text-sm font-semibold border border-[var(--color-ink)]/15 hover:bg-[var(--color-cream)] transition">
            Gerenciar assinatura
          </button>
          <p className="text-xs mt-3 text-center" style={{ color: "var(--color-ink-soft)" }}>
            Pagamento via gateway (Asaas / Mercado Pago / Pagar.me) — configurável no .env
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold">Tabela de serviços</h2>
            <NovoServicoBtn />
          </div>
          {servicos.length === 0 ? (
            <EmptyState title="Nenhum serviço" sub="Cadastre seus serviços para montar a agenda e o faturamento." />
          ) : (
            <div className="space-y-1">
              {servicos.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-3 border-t border-[var(--color-cream-deep)] first:border-0">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" style={{ color: "var(--color-jade)" }} />
                    <span className="font-medium">{s.nome}</span>
                    <span className="text-xs" style={{ color: "var(--color-ink-soft)" }}>{s.duracaoMin} min</span>
                  </div>
                  <span className="font-semibold">{BRL(s.preco)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
