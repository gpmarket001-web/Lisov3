"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/site";
import { ArrowRight } from "lucide-react";

export default function Login() {
  const router = useRouter();
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* lado visual */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden" style={{ background: "var(--color-ink)" }}>
        <div className="absolute inset-0 opacity-50">
          <div className="glow-a absolute -top-20 -left-10 h-96 w-96 rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, rgba(224,101,74,0.6), transparent 65%)" }} />
          <div className="glow-b absolute bottom-10 right-0 h-96 w-96 rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, rgba(240,163,94,0.4), transparent 65%)" }} />
        </div>
        <div className="relative"><Logo invert /></div>
        <div className="relative">
          <p className="font-display text-4xl font-semibold leading-tight" style={{ color: "var(--color-cream)" }}>
            Sua clínica de laser,<br /><span className="italic" style={{ color: "var(--color-amber)" }}>no automático.</span>
          </p>
          <p className="mt-4 max-w-sm" style={{ color: "color-mix(in srgb, var(--color-cream) 70%, transparent)" }}>
            Menos no-show, mais renovação. A operação invisível que segura a sua receita.
          </p>
        </div>
        <div className="relative text-sm" style={{ color: "color-mix(in srgb, var(--color-cream) 55%, transparent)" }}>© Liso</div>
      </div>

      {/* form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8"><Logo /></div>
          <h1 className="font-display text-3xl font-semibold">Bem-vinda de volta</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--color-ink-soft)" }}>Entre na conta da sua clínica.</p>

          <div className="mt-8 space-y-4">
            <input type="email" placeholder="email@suaclinica.com.br" className="w-full rounded-xl border border-[var(--color-cream-deep)] bg-white px-4 py-3.5 text-sm" />
            <input type="password" placeholder="Senha" className="w-full rounded-xl border border-[var(--color-cream-deep)] bg-white px-4 py-3.5 text-sm" />
            <button
              onClick={() => router.push("/dashboard")}
              className="group w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-[var(--color-cream)] shadow-lg hover:shadow-xl transition"
              style={{ background: "var(--color-coral)" }}
            >
              Entrar <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="mt-6 text-sm text-center" style={{ color: "var(--color-ink-soft)" }}>
            Não tem conta? <Link href="/signup" className="font-semibold" style={{ color: "var(--color-coral)" }}>Testar grátis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
