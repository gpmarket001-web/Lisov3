/**
 * Liso — camada de leitura (real, do Postgres). Tudo escopado por clínica.
 * Retorna objetos simples já no formato que as páginas renderizam.
 */
import { db } from "./db";
import {
  clinicas, clientes, servicos, agendamentos, pacotes, pacotesCliente, lembretes,
} from "./schema";
import { eq, desc } from "drizzle-orm";

const TZ = "America/Sao_Paulo";

function ymd(d: Date) {
  return d.toLocaleDateString("en-CA", { timeZone: TZ }); // YYYY-MM-DD
}
function hm(d: Date) {
  return d.toLocaleTimeString("pt-BR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
}
function diasAte(d: Date | null) {
  if (!d) return Infinity;
  return Math.ceil((d.getTime() - Date.now()) / 86400000);
}

export async function getClinica(cid: string) {
  const d = db();
  if (!d) return null;
  const [c] = await d.select().from(clinicas).where(eq(clinicas.id, cid)).limit(1);
  return c ?? null;
}

export async function getServicos(cid: string) {
  const d = db();
  if (!d) return [];
  const rows = await d.select().from(servicos).where(eq(servicos.clinicaId, cid)).orderBy(servicos.nome);
  return rows.map((s) => ({ id: s.id, nome: s.nome, duracaoMin: s.duracaoMin, preco: Number(s.preco) }));
}

export async function getClientes(cid: string) {
  const d = db();
  if (!d) return [];
  const cls = await d.select().from(clientes)
    .where(eq(clientes.clinicaId, cid)).orderBy(desc(clientes.criadoEm));
  const ags = await d.select().from(agendamentos).where(eq(agendamentos.clinicaId, cid));
  return cls
    .filter((c) => !c.deletadoEm)
    .map((c) => {
      const realizados = ags.filter((a) => a.clienteId === c.id && a.status === "realizado");
      const ultima = realizados.map((a) => a.inicio).sort((x, y) => y.getTime() - x.getTime())[0] ?? null;
      return {
        id: c.id,
        nome: c.nome,
        telefone: c.telefone,
        totalSessoes: realizados.length,
        ultimaSessao: ultima ? ymd(ultima) : null,
        consentimentoLgpd: c.consentimentoLgpd,
      };
    });
}

export async function getAgendamentos(cid: string) {
  const d = db();
  if (!d) return [];
  const rows = await d.select({
    id: agendamentos.id, inicio: agendamentos.inicio, profissional: agendamentos.profissional,
    status: agendamentos.status, clienteNome: clientes.nome, servico: servicos.nome,
  })
    .from(agendamentos)
    .leftJoin(clientes, eq(agendamentos.clienteId, clientes.id))
    .leftJoin(servicos, eq(agendamentos.servicoId, servicos.id))
    .where(eq(agendamentos.clinicaId, cid))
    .orderBy(agendamentos.inicio);
  return rows.map((r) => ({
    id: r.id,
    clienteNome: r.clienteNome ?? "—",
    servico: r.servico ?? "—",
    profissional: r.profissional,
    data: ymd(r.inicio),
    horario: hm(r.inicio),
    status: r.status,
  }));
}

export async function getPacotesCliente(cid: string) {
  const d = db();
  if (!d) return [];
  const rows = await d.select({
    id: pacotesCliente.id, sessoesUsadas: pacotesCliente.sessoesUsadas, venceEm: pacotesCliente.venceEm,
    clienteNome: clientes.nome, pacoteNome: pacotes.nome, sessoesTotais: pacotes.sessoesTotais,
  })
    .from(pacotesCliente)
    .leftJoin(clientes, eq(pacotesCliente.clienteId, clientes.id))
    .leftJoin(pacotes, eq(pacotesCliente.pacoteId, pacotes.id))
    .where(eq(pacotesCliente.clinicaId, cid));
  return rows.map((r) => {
    const total = r.sessoesTotais ?? 0;
    const restantes = total - r.sessoesUsadas;
    const dias = diasAte(r.venceEm);
    let risco: "ok" | "vencendo" | "esgotando" = "ok";
    if (total > 0 && restantes <= 1) risco = "esgotando";
    else if (dias <= 14) risco = "vencendo";
    return {
      id: r.id,
      clienteNome: r.clienteNome ?? "—",
      pacote: r.pacoteNome ?? "—",
      sessoesTotais: total,
      sessoesUsadas: r.sessoesUsadas,
      venceEm: r.venceEm ? ymd(r.venceEm) : "",
      risco,
    };
  });
}

const TIPO_LBL: Record<string, string> = {
  confirmacao_24h: "Confirmação 24h antes",
  lembrete_2h: "Lembrete 2h antes",
  renovacao_pacote: "Renovação de pacote",
};

export async function getLembretes(cid: string) {
  const d = db();
  if (!d) return [];
  const rows = await d.select({
    id: lembretes.id, tipo: lembretes.tipo, status: lembretes.status,
    dispararEm: lembretes.dispararEm, clienteNome: clientes.nome,
  })
    .from(lembretes)
    .leftJoin(clientes, eq(lembretes.clienteId, clientes.id))
    .where(eq(lembretes.clinicaId, cid))
    .orderBy(desc(lembretes.dispararEm))
    .limit(50);
  return rows.map((r) => ({
    id: r.id,
    clienteNome: r.clienteNome ?? "—",
    tipo: r.tipo,
    tipoLabel: TIPO_LBL[r.tipo] ?? r.tipo,
    status: r.status,
    quando: r.dispararEm.toLocaleString("pt-BR", { timeZone: TZ, day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
  }));
}

export async function getKpis(cid: string) {
  const [ags, pcs, lbs, servs] = await Promise.all([
    getAgendamentos(cid), getPacotesCliente(cid), getLembretes(cid), getServicos(cid),
  ]);
  const hoje = ymd(new Date());
  const mesAtual = hoje.slice(0, 7);
  const precoDe = (nome: string) => servs.find((s) => s.nome === nome)?.preco ?? 0;
  const realizadosMes = ags.filter((a) => a.status === "realizado" && a.data.slice(0, 7) === mesAtual);
  const faturamentoMes = realizadosMes.reduce((acc, a) => acc + precoDe(a.servico), 0);
  const doMes = ags.filter((a) => a.data.slice(0, 7) === mesAtual);
  const noShows = doMes.filter((a) => a.status === "no_show").length;
  const taxaNoShow = doMes.length ? Math.round((noShows / doMes.length) * 100) : 0;
  const ticket = realizadosMes.length ? Math.round(faturamentoMes / realizadosMes.length) : 0;
  return {
    faturamentoMes,
    agendamentosHoje: ags.filter((a) => a.data === hoje).length,
    taxaNoShow,
    pacotesEmRisco: pcs.filter((p) => p.risco !== "ok").length,
    lembretesEnviados: lbs.filter((l) => l.status === "enviado" || l.status === "respondido").length,
    receitaRecuperada: 0,
    ticketMedio: ticket,
  };
}

export const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const hojeLabel = () =>
  new Date().toLocaleDateString("pt-BR", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" });
