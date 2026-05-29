import { Topbar, Card, Badge, EmptyState } from "@/components/dash";
import { NovoAgendamentoBtn } from "@/components/forms";
import { exigirSessao } from "@/lib/auth";
import { getAgendamentos, getClientes, getServicos, getClinica } from "@/lib/queries";

export default async function Agenda() {
  const { cid } = await exigirSessao();
  const [agendamentos, clientes, servicos, clinica] = await Promise.all([
    getAgendamentos(cid), getClientes(cid), getServicos(cid), getClinica(cid),
  ]);
  const dias = [...new Set(agendamentos.map((a) => a.data))];
  const opt = (arr: { id: string; nome: string }[]) => arr.map((x) => ({ id: x.id, nome: x.nome }));

  return (
    <>
      <Topbar title="Agenda" sub="Agendamentos por dia e profissional." clinica={clinica?.nome} />
      <div className="flex justify-end mb-5">
        <NovoAgendamentoBtn clientes={opt(clientes)} servicos={opt(servicos)} />
      </div>
      {dias.length === 0 ? (
        <EmptyState title="Agenda vazia" sub="Crie um agendamento para começar. Cada agendamento já programa o lembrete de confirmação 24h antes." />
      ) : (
        <div className="space-y-6">
          {dias.map((dia) => (
            <Card key={dia} className="p-6">
              <h2 className="font-display text-lg font-semibold mb-4">
                {new Date(dia + "T00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </h2>
              <div className="space-y-1">
                {agendamentos.filter((a) => a.data === dia).map((a) => (
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
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
