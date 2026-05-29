import { NextResponse } from "next/server";
import { and, eq, lte, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { lembretes, clientes, clinicas, agendamentos } from "@/lib/schema";
import { enviarMensagem, templates, whatsappAtivo } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

/**
 * Worker de lembretes — Vercel Cron (vercel.json, a cada 15 min).
 * Lê lembretes do banco que já venceram (disparar_em <= agora) e ainda não foram
 * enviados, manda pelo WhatsApp com a identidade da clínica, e marca como enviado.
 * Protegido por CRON_SECRET.
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const d = db();
  if (!d) {
    return NextResponse.json({ ok: true, modo: "demo", processados: 0, nota: "Sem DATABASE_URL — nada a processar." });
  }

  const agora = new Date();

  // lembretes vencidos e ainda não enviados (limite por execução pra não estourar)
  const pendentes = await d.select({
    id: lembretes.id,
    tipo: lembretes.tipo,
    clienteId: lembretes.clienteId,
    clinicaId: lembretes.clinicaId,
    telefone: clientes.telefone,
    clienteNome: clientes.nome,
    clinicaNome: clinicas.nome,
  })
    .from(lembretes)
    .leftJoin(clientes, eq(lembretes.clienteId, clientes.id))
    .leftJoin(clinicas, eq(lembretes.clinicaId, clinicas.id))
    .where(and(
      eq(lembretes.status, "agendado"),
      lte(lembretes.dispararEm, agora),
      isNull(lembretes.enviadoEm),
    ))
    .limit(50);

  const resultados: { id: string; ok: boolean; erro?: string }[] = [];

  for (const l of pendentes) {
    if (!l.telefone || !l.clienteNome) {
      await d.update(lembretes).set({ status: "falhou" }).where(eq(lembretes.id, l.id));
      resultados.push({ id: l.id, ok: false, erro: "cliente sem telefone" });
      continue;
    }
    const clinica = l.clinicaNome ?? "sua clínica";
    const primeiro = l.clienteNome.split(" ")[0];

    // busca o próximo agendamento da cliente pra montar a hora na mensagem
    const [prox] = await d.select({ inicio: agendamentos.inicio })
      .from(agendamentos)
      .where(and(eq(agendamentos.clienteId, l.clienteId), eq(agendamentos.clinicaId, l.clinicaId)))
      .orderBy(agendamentos.inicio)
      .limit(1);
    const hora = prox?.inicio
      ? prox.inicio.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" })
      : "";

    let msg: string;
    if (l.tipo === "lembrete_2h") msg = templates.lembrete2h(clinica, primeiro, hora);
    else if (l.tipo === "renovacao_pacote") msg = templates.renovacaoPacote(clinica, primeiro);
    else msg = templates.confirmacao24h(clinica, primeiro, hora);

    const r = await enviarMensagem(l.telefone, msg);
    if (r.ok) {
      await d.update(lembretes).set({ status: "enviado", enviadoEm: new Date() }).where(eq(lembretes.id, l.id));
      resultados.push({ id: l.id, ok: true });
    } else {
      await d.update(lembretes).set({ status: "falhou" }).where(eq(lembretes.id, l.id));
      resultados.push({ id: l.id, ok: false, erro: r.erro });
    }
  }

  return NextResponse.json({
    ok: true,
    modo: whatsappAtivo ? "producao" : "simulado",
    processados: resultados.length,
    enviados: resultados.filter((r) => r.ok).length,
    falhas: resultados.filter((r) => !r.ok).length,
    resultados,
  });
}
