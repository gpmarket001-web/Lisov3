"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/site";
import { ArrowRight, Check } from "lucide-react";

export default function Signup() {
  const router = useRouter();
  const [plano, setPlano] = useState<"founding" | "full">("founding");

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--color-cream)" }}>
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="rounded-[var(--radius-xl2)] bg-white border border-[var(--color-cream-deep)] p-8 shadow-xl">
          <h1 className="font-display text-3xl font-semibold text-center">Comece em 14 dias grátis</h1>
          <p className="mt-2 text-sm text-center" style={{ color: "var(--color-ink-soft)" }}>Sem cartão. Onboarding 1-a-1.</p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            {([
              { id: "founding", t: "Founding", p: "R$ 98", s: "50% off vitalício" },
              { id: "full", t: "Completo", p: "R$ 197", s: "plano padrão" },
            ] as const).map((o) => (
              <button
                key={o.id}
                onClick={() => setPlano(o.id)}
                className="rounded-2xl p-4 text-left border-2 transition"
                style={{
                  borderColor: plano === o.id ? "var(--color-coral)" : "var(--color-cream-deep)",
                  background: plano === o.id ? "color-mix(in srgb, var(--color-coral) 6%, white)" : "white",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{o.t}</span>
                  {plano === o.id && <Check className="h-4 w-4" style={{ color: "var(--color-coral)" }} />}
                </div>
                <p className="font-display text-xl font-semibold mt-1">{o.p}<span className="text-xs font-normal">/mês</span></p>
                <p className="text-[11px]" style={{ color: "var(--color-ink-soft)" }}>{o.s}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <input placeholder="Nome da clínica" className="w-full rounded-xl border border-[var(--color-cream-deep)] bg-[var(--color-cream)] px-4 py-3.5 text-sm" />
            <input type="email" placeholder="Seu melhor e-mail" className="w-full rounded-xl border border-[var(--color-cream-deep)] bg-[var(--color-cream)] px-4 py-3.5 text-sm" />
            <input type="password" placeholder="Crie uma senha" className="w-full rounded-xl border border-[var(--color-cream-deep)] bg-[var(--color-cream)] px-4 py-3.5 text-sm" />
            <button
              onClick={() => router.push("/dashboard")}
              className="group w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-[var(--color-cream)] shadow-lg hover:shadow-xl transition"
              style={{ background: "var(--color-coral)" }}
            >
              Criar conta e começar <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="mt-5 text-xs text-center" style={{ color: "var(--color-ink-soft)" }}>
            Já tem conta? <Link href="/login" className="font-semibold" style={{ color: "var(--color-coral)" }}>Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
