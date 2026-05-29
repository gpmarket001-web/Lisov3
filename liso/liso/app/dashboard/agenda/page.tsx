import { Topbar, Card, Badge } from "@/components/dash";
import { agendamentos } from "@/lib/data";
import { Plus } from "lucide-react";

export default function Agenda() {
  const dias = [...new Set(agendamentos.map((a) => a.data))];
  return (
    <>
      <Topbar title="Agenda" sub="Agendamentos por dia e profissional." />
      <div className="flex justify-end mb-5">
        <button className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--color-cream)]" style={{ background: "var(--color-coral)" }}>
          <Plus className="h-4 w-4" /> Novo agendamento
        </button>
      </div>
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
    </>
  );
}
