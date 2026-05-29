"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { clinicas, usuarios } from "@/lib/schema";
import { hashSenha, verificarSenha, criarSessao, destruirSessao } from "@/lib/auth";

type Estado = { error?: string } | null;

export async function signupAction(_prev: Estado, fd: FormData): Promise<Estado> {
  const d = db();
  if (!d) return { error: "Banco não configurado. Defina DATABASE_URL." };

  const nomeClinica = String(fd.get("clinica") || "").trim();
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const senha = String(fd.get("senha") || "");
  const plano = String(fd.get("plano") || "founding");

  if (!nomeClinica || !email || senha.length < 6) {
    return { error: "Preencha tudo. A senha precisa de no mínimo 6 caracteres." };
  }

  const [existe] = await d.select({ id: usuarios.id }).from(usuarios).where(eq(usuarios.email, email)).limit(1);
  if (existe) return { error: "Já existe uma conta com esse e-mail." };

  const trialTerminaEm = new Date(Date.now() + 14 * 86400000);
  const [clinica] = await d.insert(clinicas).values({
    nome: nomeClinica,
    plano: "trial",
    founding: plano === "founding",
    trialTerminaEm,
  }).returning({ id: clinicas.id });

  const [user] = await d.insert(usuarios).values({
    clinicaId: clinica.id,
    nome: nomeClinica,
    email,
    senhaHash: hashSenha(senha),
    role: "owner",
  }).returning({ id: usuarios.id });

  await criarSessao(user.id, clinica.id);
  redirect("/dashboard");
}

export async function loginAction(_prev: Estado, fd: FormData): Promise<Estado> {
  const d = db();
  if (!d) return { error: "Banco não configurado. Defina DATABASE_URL." };

  const email = String(fd.get("email") || "").trim().toLowerCase();
  const senha = String(fd.get("senha") || "");
  if (!email || !senha) return { error: "Informe e-mail e senha." };

  const [user] = await d.select().from(usuarios).where(eq(usuarios.email, email)).limit(1);
  if (!user || !verificarSenha(senha, user.senhaHash)) {
    return { error: "E-mail ou senha incorretos." };
  }

  await criarSessao(user.id, user.clinicaId);
  redirect("/dashboard");
}

export async function logoutAction() {
  await destruirSessao();
  redirect("/login");
}
