/**
 * Adapter de pagamento AGNÓSTICO de gateway.
 * Trocar de provedor = trocar env + a função `criarCheckout`.
 * Suporta Asaas / Mercado Pago / Pagar.me / Iugu (você escolhe via PAYMENT_PROVIDER).
 *
 * >>> TERCEIRO: preencha as variáveis no .env e implemente a chamada real
 *     do provedor escolhido onde está marcado // TODO.
 */
export type Provider = "asaas" | "mercadopago" | "pagarme" | "iugu" | "demo";

const provider = (process.env.PAYMENT_PROVIDER as Provider) || "demo";

export interface CheckoutInput {
  plano: "founding" | "full";
  clinicaId: string;
  email: string;
}

const PRECOS = { founding: 9800, full: 19700 }; // centavos

export async function criarCheckout(input: CheckoutInput): Promise<{ url: string }> {
  if (provider === "demo") {
    return { url: `/dashboard?checkout=demo&plano=${input.plano}` };
  }

  const valor = PRECOS[input.plano];

  // TODO(terceiro): implementar a criação de assinatura no provedor real.
  // Exemplo de forma (ajuste endpoint/payload conforme o provedor):
  //
  // const res = await fetch(`${process.env.PAYMENT_BASE_URL}/subscriptions`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${process.env.PAYMENT_API_KEY}`,
  //   },
  //   body: JSON.stringify({
  //     customer: input.email,
  //     value: valor / 100,
  //     cycle: "MONTHLY",
  //     externalReference: input.clinicaId,
  //   }),
  // });
  // const data = await res.json();
  // return { url: data.invoiceUrl ?? data.checkoutUrl };

  throw new Error(
    `PAYMENT_PROVIDER="${provider}" sem implementação. Preencha o adapter em lib/payments.ts. (valor=${valor})`
  );
}

export function validarWebhook(_signature: string | null, _body: string): boolean {
  // TODO(terceiro): validar assinatura do webhook do provedor.
  if (provider === "demo") return true;
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  return Boolean(secret);
}
