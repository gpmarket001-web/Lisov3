import { Topbar, StatCard, Card } from "@/components/dash";
import { CLINICA_DEMO, BRL, servicos } from "@/lib/data";
import { Check } from "lucide-react";

export default function Financeiro() {
  return (
    <>
      <Topbar title="Financeiro & Assinatura" sub="Faturamento da clínica e o seu plano Liso." />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Faturamento (mês)" value={BRL(18740)} hint="+24% vs. anterior" accent />
        <StatCard label="Ticket médio" value={BRL(214)} hint="por sessão" />
        <StatCard label="Receita recuperada" value={BRL(4980)} hint="via lembretes" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold mb-4">Seu plano</h2>
          <div className="rounded-2xl p-5 mb-4" style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}>
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl font-semibold">Founding Member</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "var(--color-coral)" }}>50% OFF VITALÍCIO</span>
            </div>
            <p className="mt-2 text-3xl font-display font-semibold">R$ 98<span className="text-base font-normal">/mês</span></p>
          </div>
          <button className="w-full rounded-full px-5 py-3 text-sm font-semibold border border-[var(--color-ink)]/15 hover:bg-[var(--color-cream)] transition">
            Gerenciar assinatura
          </button>
          <p className="text-xs mt-3 text-center" style={{ color: "var(--color-ink-soft)" }}>
            Pagamento via gateway (Asaas/Mercado Pago/Pagar.me) — configurável no .env
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold mb-4">Tabela de serviços</h2>
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
        </Card>
      </div>
    </>
  );
}
