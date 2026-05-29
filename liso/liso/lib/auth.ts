/**
 * Liso — autenticação real.
 * - Senha: scrypt (crypto nativo do Node, sem dependência extra).
 * - Sessão: token assinado com HMAC-SHA256 (SESSION_SECRET) em cookie httpOnly.
 * Roda só no servidor (server actions / server components).
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "crypto";

const COOKIE = "liso_sess";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

function secret() {
  return process.env.SESSION_SECRET || "dev-inseguro-troque-em-producao";
}

/* ---------- senha ---------- */
export function hashSenha(senha: string): string {
  const salt = randomBytes(16).toString("hex");
  const dk = scryptSync(senha, salt, 64).toString("hex");
  return `${salt}:${dk}`;
}

export function verificarSenha(senha: string, armazenado: string): boolean {
  const [salt, dk] = armazenado.split(":");
  if (!salt || !dk) return false;
  const alvo = Buffer.from(dk, "hex");
  const tentativa = scryptSync(senha, salt, 64);
  return alvo.length === tentativa.length && timingSafeEqual(alvo, tentativa);
}

/* ---------- token de sessão ---------- */
type Payload = { uid: string; cid: string; exp: number };

function b64url(b: Buffer | string) {
  return Buffer.from(b).toString("base64url");
}

function assinar(payload: Payload): string {
  const corpo = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", secret()).update(corpo).digest("base64url");
  return `${corpo}.${sig}`;
}

function ler(token: string | undefined): Payload | null {
  if (!token) return null;
  const [corpo, sig] = token.split(".");
  if (!corpo || !sig) return null;
  const esperado = createHmac("sha256", secret()).update(corpo).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(esperado);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(corpo, "base64url").toString()) as Payload;
    if (!p.exp || p.exp < Date.now()) return null;
    return p;
  } catch {
    return null;
  }
}

/* ---------- API ---------- */
export async function criarSessao(uid: string, cid: string) {
  const token = assinar({ uid, cid, exp: Date.now() + MAX_AGE * 1000 });
  const c = await cookies();
  c.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destruirSessao() {
  const c = await cookies();
  c.delete(COOKIE);
}

export async function getSessao(): Promise<{ uid: string; cid: string } | null> {
  const c = await cookies();
  const p = ler(c.get(COOKIE)?.value);
  return p ? { uid: p.uid, cid: p.cid } : null;
}

/** Usar no topo das páginas do dashboard. Redireciona pro login se não houver sessão válida. */
export async function exigirSessao(): Promise<{ uid: string; cid: string }> {
  const s = await getSessao();
  if (!s) redirect("/login");
  return s;
}
