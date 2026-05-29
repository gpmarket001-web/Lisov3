import { Topbar, Card, Badge, EmptyState } from "@/components/dash";
import { exigirSessao } from "@/lib/auth";
import { getPacotesCliente, getClinica } from "@/lib/queries";
import { MessageSquare } from "lucide-react";

export default async function Pacotes() {
  const { cid } = await exigirSessao();
  const [pacotes, clinica] = await Promise.all([getPacotesCliente(cid), getClinica(cid)]);
  return (
    <>
      <Topbar title="Pacotes inteligentes" sub="O Liso vigia cada pacote e avisa na hora certa de renovar." clinica={clinica?.nome} />
      {pacotes.length === 0 ? (
        <EmptyState title="Nenhum pacote ativo" sub="Pacotes de clientes aparecem aqui com alerta de renovação automático." />
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {pacotes.map((p) => {
            const pct = p.sessoesTotais ? (p.sessoesUsadas / p.sessoesTotais) * 100 : 0;
            return (
              <Card key={p.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-display text-lg font-semibold">{p.clienteNome}</p>
                    <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>{p.pacote}</p>
                  </div>
                  <Badge status={p.risco} />
                </div>
                <div className="h-2 rounded-full bg-[var(--color-cream-deep)] overflow-hidden mb-2">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: p.risco === "ok" ? "var(--color-jade)" : "var(--color-coral)" }} />
                </div>
                <div className="flex items-center justify-between text-xs mb-4" style={{ color: "var(--color-ink-soft)" }}>
                  <span>{p.sessoesUsadas}/{p.sessoesTotais} sessões usadas</span>
                  {p.venceEm && <span>vence {new Date(p.venceEm).toLocaleDateString("pt-BR")}</span>}
                </div>
                {p.risco !== "ok" && (
                  <button className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold w-full justify-center" style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}>
                    <MessageSquare className="h-4 w-4" /> Disparar renovação no WhatsApp
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
