/**
 * Adapter WhatsApp via Z-API — o "no automático" do Liso.
 *
 * >>> TERCEIRO: preencha ZAPI_* no .env. Sem isso, roda em modo simulação
 *     (loga no servidor em vez de enviar de verdade).
 */
const base = process.env.ZAPI_BASE_URL || "https://api.z-api.io";
const instance = process.env.ZAPI_INSTANCE_ID;
const token = process.env.ZAPI_TOKEN;
const clientToken = process.env.ZAPI_CLIENT_TOKEN;

export const whatsappAtivo = Boolean(instance && token);

export async function enviarMensagem(telefone: string, mensagem: string) {
  if (!whatsappAtivo) {
    console.log(`[Liso·WhatsApp·SIMULADO] -> ${telefone}: ${mensagem}`);
    return { simulado: true };
  }
  const url = `${base}/instances/${instance}/token/${token}/send-text`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(clientToken ? { "Client-Token": clientToken } : {}),
    },
    body: JSON.stringify({ phone: telefone.replace(/\D/g, ""), message: mensagem }),
  });
  return res.json();
}

export const templates = {
  confirmacao24h: (nome: string, hora: string) =>
    `Oi ${nome}! Passando pra confirmar sua sessão amanhã às ${hora}. Responda SIM pra confirmar 💛`,
  lembrete2h: (nome: string, hora: string) =>
    `${nome}, sua sessão é hoje às ${hora}. Te esperamos! Qualquer coisa, é só chamar aqui.`,
  renovacaoPacote: (nome: string) =>
    `${nome}, seu pacote está na reta final 🎉 Quer já garantir a renovação com condição especial? Me chama aqui que eu reservo.`,
};
