"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { clientes, servicos, agendamentos, clinicas, lembretes } from "@/lib/schema";
import { exigirSessao } from "@/lib/auth";

type Res = { ok: true } | { error: string };

export async function criarCliente(fd: FormData): Promise<Res> {
  const { cid } = await exigirSessao();
  const d = db();
  if (!d) return { error: "Banco não configurado." };
  const nome = String(fd.get("nome") || "").trim();
  const telefone = String(fd.get("telefone") || "").trim();
  if (!nome || !telefone) return { error: "Nome e telefone são obrigatórios." };
  await d.insert(clientes).values({
    clinicaId: cid,
    nome,
    telefone,
    consentimentoLgpd: fd.get("lgpd") === "on",
  });
  revalidatePath("/dashboard/clientes");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function criarServico(fd: FormData): Promise<Res> {
  const { cid } = await exigirSessao();
  const d = db();
  if (!d) return { error: "Banco não configurado." };
  const nome = String(fd.get("nome") || "").trim();
  const duracao = parseInt(String(fd.get("duracao") || "0"), 10);
  const preco = parseFloat(String(fd.get("preco") || "0").replace(",", "."));
  if (!nome || !duracao || !preco) return { error: "Preencha nome, duração e preço." };
  await d.insert(servicos).values({
    clinicaId: cid,
    nome,
    duracaoMin: duracao,
    preco: preco.toFixed(2),
  });
  revalidatePath("/dashboard/financeiro");
  return { ok: true };
}

export async function criarAgendamento(fd: FormData): Promise<Res> {
  const { cid } = await exigirSessao();
  const d = db();
  if (!d) return { error: "Banco não configurado." };
  const clienteId = String(fd.get("clienteId") || "");
  const servicoId = String(fd.get("servicoId") || "");
  const profissional = String(fd.get("profissional") || "").trim();
  const dataHora = String(fd.get("inicio") || ""); // datetime-local
  if (!clienteId || !servicoId || !profissional || !dataHora) {
    return { error: "Preencha cliente, serviço, profissional e horário." };
  }
  const inicio = new Date(dataHora);
  if (isNaN(inicio.getTime())) return { error: "Data/hora inválida." };

  // valida que cliente e serviço são desta clínica
  const [cli] = await d.select({ id: clientes.id }).from(clientes)
    .where(and(eq(clientes.id, clienteId), eq(clientes.clinicaId, cid))).limit(1);
  const [srv] = await d.select({ id: servicos.id }).from(servicos)
    .where(and(eq(servicos.id, servicoId), eq(servicos.clinicaId, cid))).limit(1);
  if (!cli || !srv) return { error: "Cliente ou serviço inválido." };

  const [ag] = await d.insert(agendamentos).values({
    clinicaId: cid, clienteId, servicoId, profissional, inicio, status: "pendente",
  }).returning({ id: agendamentos.id });

  // agenda lembrete de confirmação 24h antes (o cron dispara depois)
  const dispararEm = new Date(inicio.getTime() - 24 * 3600 * 1000);
  await d.insert(lembretes).values({
    clinicaId: cid, clienteId, tipo: "confirmacao_24h", status: "agendado", dispararEm,
  });

  void ag;
  revalidatePath("/dashboard/agenda");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function salvarClinica(fd: FormData): Promise<Res> {
  const { cid } = await exigirSessao();
  const d = db();
  if (!d) return { error: "Banco não configurado." };
  const nome = String(fd.get("nome") || "").trim();
  const cor = String(fd.get("cor") || "#E0654A").trim();
  if (!nome) return { error: "O nome da clínica é obrigatório." };
  await d.update(clinicas).set({ nome, cor }).where(eq(clinicas.id, cid));
  revalidatePath("/dashboard/configuracoes");
  revalidatePath("/dashboard");
  return { ok: true };
}
