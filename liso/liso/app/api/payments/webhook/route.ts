import { NextResponse } from "next/server";
import { validarWebhook } from "@/lib/payments";

export const dynamic = "force-dynamic";

/**
 * Webhook do gateway de pagamento (agnóstico).
 * Registre esta URL no painel do provedor: https://SEU_DOMINIO/api/payments/webhook
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-signature") || req.headers.get("asaas-signature");

  if (!validarWebhook(signature, body)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  let evento: unknown;
  try {
    evento = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // TODO(terceiro): tratar eventos do provedor — pagamento confirmado, assinatura
  // cancelada, etc. e atualizar clinicas.subscriptionStatus no banco.
  console.log("[Liso·payments·webhook]", evento);

  return NextResponse.json({ received: true });
}
