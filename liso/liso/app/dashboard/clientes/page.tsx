import { Topbar, Card, EmptyState } from "@/components/dash";
import { NovaClienteBtn } from "@/components/forms";
import { exigirSessao } from "@/lib/auth";
import { getClientes, getClinica } from "@/lib/queries";
import { ShieldCheck, ShieldX } from "lucide-react";

export default async function Clientes() {
  const { cid } = await exigirSessao();
  const [clientes, clinica] = await Promise.all([getClientes(cid), getClinica(cid)]);
  return (
    <>
      <Topbar title="Clientes" sub={`${clientes.length} cliente(s) cadastrada(s).`} clinica={clinica?.nome} />
      <div className="flex justify-end mb-5"><NovaClienteBtn /></div>
      {clientes.length === 0 ? (
        <EmptyState title="Nenhuma cliente ainda" sub="Clique em 'Nova cliente' para cadastrar a primeira." />
      ) : (
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
      )}
    </>
  );
}
