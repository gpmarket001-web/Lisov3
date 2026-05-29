import { Topbar, Card, Badge, EmptyState } from "@/components/dash";
import { exigirSessao } from "@/lib/auth";
import { getLembretes, getClinica } from "@/lib/queries";
import { MessageCircleHeart } from "lucide-react";

export default async function Lembretes() {
  const { cid } = await exigirSessao();
  const [lembretes, clinica] = await Promise.all([getLembretes(cid), getClinica(cid)]);
  const enviados = lembretes.filter((l) => l.status === "enviado" || l.status === "respondido").length;
  const ativo = !!clinica?.zapiInstanceId;

  return (
    <>
      <Topbar title="Lembretes automáticos" sub="O coração do 'no automático'." clinica={clinica?.nome} />
      <Card className="p-6 mb-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl grid place-items-center" style={{ background: ativo ? "color-mix(in srgb, var(--color-jade) 14%, white)" : "color-mix(in srgb, var(--color-amber) 18%, white)" }}>
          <MessageCircleHeart className="h-6 w-6" style={{ color: ativo ? "var(--color-jade)" : "var(--color-coral-deep)" }} />
        </div>
        <div>
          <p className="font-semibold">{ativo ? "WhatsApp conectado · automação ativa" : "WhatsApp ainda não conectado"}</p>
          <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
            {ativo
              ? `${enviados} mensagem(ns) enviada(s)`
              : "Conecte a Z-API nas Configurações para os lembretes saírem sozinhos."}
          </p>
        </div>
      </Card>
      {lembretes.length === 0 ? (
        <EmptyState title="Nenhum lembrete ainda" sub="Ao criar agendamentos, o lembrete de confirmação 24h é programado automaticamente." />
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ color: "var(--color-ink-soft)" }}>
                <th className="font-semibold px-6 py-4">Cliente</th>
                <th className="font-semibold px-6 py-4">Tipo</th>
                <th className="font-semibold px-6 py-4">Quando</th>
                <th className="font-semibold px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {lembretes.map((l) => (
                <tr key={l.id} className="border-t border-[var(--color-cream-deep)] hover:bg-[var(--color-cream)] transition">
                  <td className="px-6 py-4 font-medium">{l.clienteNome}</td>
                  <td className="px-6 py-4" style={{ color: "var(--color-ink-soft)" }}>{l.tipoLabel}</td>
                  <td className="px-6 py-4" style={{ color: "var(--color-ink-soft)" }}>{l.quando}</td>
                  <td className="px-6 py-4"><Badge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
