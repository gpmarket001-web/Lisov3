import { NextResponse } from "next/server";
import { enviarMensagem, templates, whatsappAtivo } from "@/lib/whatsapp";
import { agendamentos, pacotes } from "@/lib/data";

export const dynamic = "force-dynamic";

/**
 * Worker de lembretes — chamado pelo Vercel Cron (ver vercel.json, a cada 15 min).
 * Protegido por CRON_SECRET. Em modo demo, simula o envio.
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const enviados: string[] = [];

  // confirmações 24h / lembretes 2h (em produção: filtrar por janela de tempo real)
  for (const a of agendamentos.filter((x) => x.status === "confirmado").slice(0, 3)) {
    const r = await enviarMensagem("31998000000", templates.confirmacao24h(a.clienteNome, a.horario));
    enviados.push(`confirmacao:${a.clienteNome}:${JSON.stringify(r).slice(0, 20)}`);
  }

  // renovação de pacotes em risco
  for (const p of pacotes.filter((x) => x.risco !== "ok")) {
    const r = await enviarMensagem("31998000000", templates.renovacaoPacote(p.clienteNome));
    enviados.push(`renovacao:${p.clienteNome}:${JSON.stringify(r).slice(0, 20)}`);
  }

  return NextResponse.json({
    ok: true,
    modo: whatsappAtivo ? "producao" : "simulado",
    processados: enviados.length,
    enviados,
  });
}
