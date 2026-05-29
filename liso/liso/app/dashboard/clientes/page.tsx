import { Topbar, Card } from "@/components/dash";
import { clientes } from "@/lib/data";
import { Plus, ShieldCheck, ShieldX } from "lucide-react";

export default function Clientes() {
  return (
    <>
      <Topbar title="Clientes" sub={`${clientes.length} clientes ativos.`} />
      <div className="flex justify-end mb-5">
        <button className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--color-cream)]" style={{ background: "var(--color-coral)" }}>
          <Plus className="h-4 w-4" /> Nova cliente
        </button>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left" style={{ color: "var(--color-ink-soft)" }}>
              <th className="font-semibold px-6 py-4">Nome</th>
              <th className="font-semibold px-6 py-4">Telefone</th>
              <th className="font-semibold px-6 py-4">Sessões</th>
              <th className="font-semibold px-6 py-4">Última</th>
              <th className="font-semibold px-6 py-4">LGPD</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id} className="border-t border-[var(--color-cream-deep)] hover:bg-[var(--color-cream)] transition">
                <td className="px-6 py-4 font-medium">{c.nome}</td>
                <td className="px-6 py-4" style={{ color: "var(--color-ink-soft)" }}>{c.telefone}</td>
                <td className="px-6 py-4">{c.totalSessoes}</td>
                <td className="px-6 py-4" style={{ color: "var(--color-ink-soft)" }}>{c.ultimaSessao ? new Date(c.ultimaSessao).toLocaleDateString("pt-BR") : "—"}</td>
                <td className="px-6 py-4">
                  {c.consentimentoLgpd
                    ? <ShieldCheck className="h-5 w-5" style={{ color: "var(--color-jade)" }} />
                    : <ShieldX className="h-5 w-5" style={{ color: "var(--color-coral-deep)" }} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
