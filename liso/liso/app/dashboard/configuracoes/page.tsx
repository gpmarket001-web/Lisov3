import { Topbar, Card } from "@/components/dash";
import { exigirSessao } from "@/lib/auth";
import { getClinica } from "@/lib/queries";
import { salvarClinica } from "@/app/actions/data";

async function salvarClinicaForm(fd: FormData) {
  "use server";
  await salvarClinica(fd);
}

export default async function Config() {
  const { cid } = await exigirSessao();
  const clinica = await getClinica(cid);

  const env = [
    { k: "WhatsApp (Z-API)", v: "ZAPI_INSTANCE_ID, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN", on: !!clinica?.zapiInstanceId },
    { k: "Gateway de pagamento", v: "PAYMENT_PROVIDER, PAYMENT_API_KEY, PAYMENT_WEBHOOK_SECRET", on: false },
    { k: "Banco de dados", v: "DATABASE_URL (Neon / Supabase)", on: true },
    { k: "WhatsApp — confirmação pela cliente", v: "Webhook Z-API → /api/whatsapp/webhook", on: !!clinica?.zapiInstanceId },
  ];

  return (
    <>
      <Topbar title="Configurações" sub="Identidade da clínica e integrações." clinica={clinica?.nome} />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold mb-4">Clínica</h2>
          <form action={salvarClinicaForm} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-ink-soft)" }}>Nome</label>
              <input name="nome" defaultValue={clinica?.nome ?? ""} className="mt-1 w-full rounded-xl border border-[var(--color-cream-deep)] bg-[var(--color-cream)] px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-ink-soft)" }}>Cor da marca</label>
              <div className="mt-1 flex items-center gap-3">
                <span className="h-10 w-10 rounded-xl" style={{ background: clinica?.cor ?? "var(--color-coral)" }} />
                <input name="cor" defaultValue={clinica?.cor ?? "#E0654A"} className="flex-1 rounded-xl border border-[var(--color-cream-deep)] bg-[var(--color-cream)] px-4 py-3 text-sm" />
              </div>
            </div>
            <button type="submit" className="rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--color-cream)]" style={{ background: "var(--color-ink)" }}>Salvar</button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold mb-1">Integrações</h2>
          <p className="text-sm mb-4" style={{ color: "var(--color-ink-soft)" }}>Chaves de terceiro — preencha no <code>.env</code> e o Liso liga sozinho.</p>
          <div className="space-y-3">
            {env.map((e) => (
              <div key={e.k} className="rounded-2xl bg-[var(--color-cream)] p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{e.k}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: e.on ? "rgba(46,125,107,0.16)" : "rgba(240,163,94,0.18)", color: e.on ? "var(--color-jade)" : "var(--color-coral-deep)" }}>
                    {e.on ? "ativo" : "pendente"}
                  </span>
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
