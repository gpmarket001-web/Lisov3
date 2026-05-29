/**
 * Adapter WhatsApp via Z-API — o "no automático" do Liso.
 *
 * >>> TERCEIRO: preencha ZAPI_* no .env (conectados ao número da clínica).
 *     Sem isso, roda em modo simulação (loga no servidor em vez de enviar).
 *
 * Decisão de produto: o Liso NÃO usa e-mail. Toda notificação é por WhatsApp.
 */
const base = process.env.ZAPI_BASE_URL || "https://api.z-api.io";
const instance = process.env.ZAPI_INSTANCE_ID;
const token = process.env.ZAPI_TOKEN;
const clientToken = process.env.ZAPI_CLIENT_TOKEN;

export const whatsappAtivo = Boolean(instance && token);

/** Normaliza pra E.164 BR: tira não-dígitos e garante DDI 55. */
export function normalizarTelefone(tel: string): string {
  let d = tel.replace(/\D/g, "");
  if (d.length <= 11) d = "55" + d; // sem DDI -> assume Brasil
  return d;
}

export async function enviarMensagem(telefone: string, mensagem: string): Promise<{ ok: boolean; simulado?: boolean; erro?: string; raw?: unknown }> {
  const phone = normalizarTelefone(telefone);
  if (!whatsappAtivo) {
    console.log(`[Liso·WhatsApp·SIMULADO] -> ${phone}: ${mensagem}`);
    return { ok: true, simulado: true };
  }
  try {
    const url = `${base}/instances/${instance}/token/${token}/send-text`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(clientToken ? { "Client-Token": clientToken } : {}),
      },
      body: JSON.stringify({ phone, message: mensagem }),
    });
    const raw = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, erro: `Z-API ${res.status}`, raw };
    return { ok: true, raw };
  } catch (e) {
    return { ok: false, erro: e instanceof Error ? e.message : "falha de rede" };
  }
}

/**
 * Templates — recebem o nome da CLÍNICA pra mensagem sair com a identidade dela.
 * É a primeira camada de branding: a cliente sente que é a clínica falando.
 */
export const templates = {
  confirmacao24h: (clinica: string, cliente: string, hora: string) =>
    `Oi ${cliente}! Aqui é da ${clinica} 💛 Passando pra confirmar sua sessão amanhã às ${hora}. Responda *SIM* pra confirmar sua presença.`,
  lembrete2h: (clinica: string, cliente: string, hora: string) =>
    `${cliente}, sua sessão na ${clinica} é hoje às ${hora}. Te esperamos! Qualquer coisa, é só chamar por aqui.`,
  renovacaoPacote: (clinica: string, cliente: string) =>
    `${cliente}, seu pacote na ${clinica} está na reta final 🎉 Quer garantir a renovação com condição especial? Responda *RENOVAR* que a gente já reserva.`,
};

/** Interpreta a resposta da cliente. */
export function interpretarResposta(texto: string): "confirmar" | "renovar" | "cancelar" | null {
  const t = texto.trim().toLowerCase();
  if (/^(sim|s|1|confirmo|confirmar|confirmado|pode confirmar|👍|✅)/.test(t)) return "confirmar";
  if (/(renovar|renova|quero renovar|2)/.test(t)) return "renovar";
  if (/(cancelar|cancela|não vou|nao vou|desmarcar|3)/.test(t)) return "cancelar";
  return null;
}
