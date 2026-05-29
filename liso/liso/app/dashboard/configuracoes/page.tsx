import { Topbar, Card } from "@/components/dash";

export default function Config() {
  const env = [
    { k: "WhatsApp (Z-API)", v: "ZAPI_INSTANCE_ID, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN", terceiro: true },
    { k: "Gateway de pagamento", v: "PAYMENT_PROVIDER, PAYMENT_API_KEY, PAYMENT_WEBHOOK_SECRET", terceiro: true },
    { k: "Banco de dados", v: "DATABASE_URL (Neon / Supabase / Vercel Postgres)", terceiro: true },
    { k: "E-mail", v: "RESEND_API_KEY, EMAIL_FROM", terceiro: true },
  ];
  return (
    <>
      <Topbar title="Configurações" sub="Identidade da clínica e integrações." />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold mb-4">Clínica</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-ink-soft)" }}>Nome</label>
              <input defaultValue="Studio Glow — Depilação a Laser" className="mt-1 w-full rounded-xl border border-[var(--color-cream-deep)] bg-[var(--color-cream)] px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-ink-soft)" }}>Cor da marca</label>
              <div className="mt-1 flex items-center gap-3">
                <span className="h-10 w-10 rounded-xl" style={{ background: "var(--color-coral)" }} />
                <input defaultValue="#E0654A" className="flex-1 rounded-xl border border-[var(--color-cream-deep)] bg-[var(--color-cream)] px-4 py-3 text-sm" />
              </div>
            </div>
            <button className="rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--color-cream)]" style={{ background: "var(--color-ink)" }}>Salvar</button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold mb-1">Integrações</h2>
          <p className="text-sm mb-4" style={{ color: "var(--color-ink-soft)" }}>Chaves de terceiro — preencha no <code>.env</code> e o Liso liga sozinho.</p>
          <div className="space-y-3">
            {env.map((e) => (
              <div key={e.k} className="rounded-2xl bg-[var(--color-cream)] p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{e.k}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(240,163,94,0.18)", color: "var(--color-coral-deep)" }}>terceiro</span>
                </div>
                <code className="text-[11px] block mt-1" style={{ color: "var(--color-ink-soft)" }}>{e.v}</code>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
