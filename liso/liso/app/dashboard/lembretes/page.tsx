import { Topbar, Card, Badge } from "@/components/dash";
import { lembretes } from "@/lib/data";
import { MessageCircleHeart } from "lucide-react";

const TIPO: Record<string, string> = {
  confirmacao_24h: "Confirmação 24h antes",
  lembrete_2h: "Lembrete 2h antes",
  renovacao_pacote: "Renovação de pacote",
};

export default function Lembretes() {
  return (
    <>
      <Topbar title="Lembretes automáticos" sub="O coração do 'no automático'. Tudo isso saiu sozinho." />
      <Card className="p-6 mb-6 flex items-center gap-4" >
        <div className="h-12 w-12 rounded-2xl grid place-items-center" style={{ background: "color-mix(in srgb, var(--color-jade) 14%, white)" }}>
          <MessageCircleHeart className="h-6 w-6" style={{ color: "var(--color-jade)" }} />
        </div>
        <div>
          <p className="font-semibold">WhatsApp conectado · automação ativa</p>
          <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>342 mensagens enviadas este mês · R$ 4.980 em receita recuperada</p>
        </div>
      </Card>
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
                <td className="px-6 py-4" style={{ color: "var(--color-ink-soft)" }}>{TIPO[l.tipo]}</td>
                <td className="px-6 py-4" style={{ color: "var(--color-ink-soft)" }}>{l.quando}</td>
                <td className="px-6 py-4"><Badge status={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
