import { NextResponse } from "next/server";
import { and, eq, gte, inArray, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { clientes, agendamentos } from "@/lib/schema";
import { interpretarResposta, enviarMensagem, normalizarTelefone } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

/**
 * Webhook de mensagens recebidas (Z-API "on-message-received").
 * A cliente responde SIM/RENOVAR/CANCELAR e o Liso atualiza o agendamento sozinho.
 *
 * Configurar na Z-API: apontar o webhook "Ao receber" para:
 *   https://SEU_DOMINIO/api/whatsapp/webhook?secret=SEU_CRON_SECRET
 */
export async function POST(req: Request) {
  // proteção simples por querystring (Z-API não manda header custom)
  const url = new URL(req.url);
  const secret = process.env.CRON_SECRET;
  if (secret && url.searchParams.get("secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({} as Record<string, unknown>));

  // Ignora mensagens enviadas por nós mesmos (eco)
  if (body.fromMe === true) return NextResponse.json({ ok: true, ignored: "fromMe" });

  // Z-API manda o telefone em "phone" e o texto em text.message
  const telefone = String(body.phone ?? body.from ?? "");
  const texto = String(
    (body as any)?.text?.message ?? (body as any)?.message ?? (body as any)?.body ?? ""
  );
  if (!telefone || !texto) return NextResponse.json({ ok: true, ignored: "sem telefone/texto" });

  const intencao = interpretarResposta(texto);
  if (!intencao) return NextResponse.json({ ok: true, intencao: null });

  const d = db();
  if (!d) return NextResponse.json({ ok: true, modo: "demo" });

  // acha a cliente pelo telefone (compara só dígitos, com e sem DDI)
  const alvo = normalizarTelefone(telefone);
  const alvoSemDDI = alvo.replace(/^55/, "");
  const todas = await d.select().from(clientes);
  const cliente = todas.find((c) => {
    const t = normalizarTelefone(c.telefone);
    return t === alvo || t.replace(/^55/, "") === alvoSemDDI;
  });
  if (!cliente) return NextResponse.json({ ok: true, ignored: "cliente não encontrada" });

  if (intencao === "confirmar" || intencao === "cancelar") {
    // próximo agendamento futuro ainda não resolvido
    const [ag] = await d.select().from(agendamentos)
      .where(and(
        eq(agendamentos.clienteId, cliente.id),
        gte(agendamentos.inicio, new Date()),
        inArray(agendamentos.status, ["pendente", "confirmado"]),
      ))
      .orderBy(agendamentos.inicio)
      .limit(1);

    if (!ag) return NextResponse.json({ ok: true, nota: "sem agendamento futuro" });

    const novo = intencao === "confirmar" ? "confirmado" : "cancelado";
    await d.update(agendamentos).set({ status: novo }).where(eq(agendamentos.id, ag.id));

    const resposta = intencao === "confirmar"
      ? "Presença confirmada! Até lá 💛"
      : "Tudo bem, sua sessão foi cancelada. Quando quiser remarcar, é só chamar.";
    await enviarMensagem(cliente.telefone, resposta);
    return NextResponse.json({ ok: true, agendamento: ag.id, status: novo });
  }

  if (intencao === "renovar") {
    await enviarMensagem(cliente.telefone, "Que ótimo! Já vou separar a renovação do seu pacote e te confirmo os detalhes. 🎉");
    // (a renovação efetiva entra no fluxo de pacotes — Fase de pacotes/billing)
    return NextResponse.json({ ok: true, intencao: "renovar", cliente: cliente.id });
  }

  return NextResponse.json({ ok: true });
}
