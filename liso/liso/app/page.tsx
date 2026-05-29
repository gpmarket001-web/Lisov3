"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarCheck, MessageCircleHeart, PackageCheck, RefreshCw,
  ArrowRight, Check, Sparkles, ShieldCheck, Star, Clock, TrendingUp, X,
} from "lucide-react";
import { Logo, Reveal, Counter, GlowBackground, Marquee } from "@/components/site";

/* ---------- NAV ---------- */
function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-5 mt-4">
        <div className="card-glass flex items-center justify-between rounded-full px-5 py-3 shadow-sm">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: "var(--color-ink-soft)" }}>
            <a href="#recursos" className="hover:text-[var(--color-coral)] transition">Recursos</a>
            <a href="#como" className="hover:text-[var(--color-coral)] transition">Como funciona</a>
            <a href="#planos" className="hover:text-[var(--color-coral)] transition">Planos</a>
            <a href="#faq" className="hover:text-[var(--color-coral)] transition">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:inline text-sm font-semibold px-4 py-2 rounded-full hover:bg-[var(--color-cream-deep)] transition">
              Entrar
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold px-4 py-2 rounded-full text-[var(--color-cream)] shadow-md hover:shadow-lg transition"
              style={{ background: "var(--color-ink)" }}
            >
              Testar grátis
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } },
  };

  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28">
      <GlowBackground />
      <div className="mx-auto max-w-6xl px-5">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sand)] bg-white/50 px-4 py-1.5 text-xs font-semibold mb-7" style={{ color: "var(--color-coral-deep)" }}>
            <Sparkles className="h-3.5 w-3.5" />
            Feito COM clínicas de laser — não para "estética em geral"
          </motion.div>

          <motion.h1 variants={item} className="font-display text-[clamp(2.6rem,6.5vw,5rem)] leading-[0.98] font-semibold tracking-[-0.02em] text-balance">
            Sua clínica de laser,
            <br />
            <span className="italic" style={{ color: "var(--color-coral)" }}>no automático.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-7 text-lg md:text-xl leading-relaxed max-w-xl" style={{ color: "var(--color-ink-soft)" }}>
            Agenda, lembretes no WhatsApp e pacotes inteligentes trabalhando sozinhos.
            Menos no-show, mais renovação — a operação invisível que segura sua receita.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-semibold text-[var(--color-cream)] shadow-lg hover:shadow-xl transition"
              style={{ background: "var(--color-coral)" }}
            >
              Começar teste de 14 dias
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#planos"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-semibold border border-[var(--color-ink)]/15 hover:bg-white/60 transition"
            >
              Ver planos founding
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-7 flex items-center gap-5 text-sm" style={{ color: "var(--color-ink-soft)" }}>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" style={{ color: "var(--color-jade)" }} /> Sem cartão no teste</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" style={{ color: "var(--color-jade)" }} /> Onboarding 1-a-1</span>
          </motion.div>
        </motion.div>

        <HeroMockup />
      </div>
    </section>
  );
}

/* Janela do app flutuando */
function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative mt-16 mx-auto max-w-4xl"
      style={{ perspective: 1200 }}
    >
      <div className="rounded-[var(--radius-xl2)] border border-[var(--color-sand)]/60 bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[var(--color-cream-deep)]">
          <span className="h-3 w-3 rounded-full bg-[#E0654A]" />
          <span className="h-3 w-3 rounded-full bg-[#F0A35E]" />
          <span className="h-3 w-3 rounded-full bg-[#D9C7B4]" />
          <span className="ml-3 text-xs font-medium" style={{ color: "var(--color-ink-soft)" }}>app.liso.com.br/dashboard</span>
        </div>
        <div className="grid grid-cols-3 gap-3 p-5 bg-[var(--color-cream)]">
          {[
            { l: "Faturamento (mês)", v: "R$ 18.740", up: "+24%" },
            { l: "Agendamentos hoje", v: "5", up: "no-show 6%" },
            { l: "Receita recuperada", v: "R$ 4.980", up: "via lembretes" },
          ].map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.12 }}
              className="rounded-2xl bg-white p-4 border border-[var(--color-cream-deep)]"
            >
              <div className="text-[11px] font-medium" style={{ color: "var(--color-ink-soft)" }}>{c.l}</div>
              <div className="font-display text-2xl font-semibold mt-1">{c.v}</div>
              <div className="text-[11px] font-semibold mt-1" style={{ color: "var(--color-jade)" }}>{c.up}</div>
            </motion.div>
          ))}
          <div className="col-span-3 rounded-2xl bg-white p-4 border border-[var(--color-cream-deep)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Lembretes automáticos no WhatsApp</span>
              <span className="text-[11px] font-semibold px-2 py-1 rounded-full" style={{ background: "color-mix(in srgb, var(--color-jade) 14%, white)", color: "var(--color-jade)" }}>ativo</span>
            </div>
            {[
              { n: "Marina — confirmação 24h", s: "respondido ✓" },
              { n: "Bianca — renovação de pacote", s: "agendado" },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-t border-[var(--color-cream-deep)] text-sm">
                <span style={{ color: "var(--color-ink-soft)" }}>{r.n}</span>
                <span className="font-medium">{r.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- PROBLEMA ---------- */
function Problema() {
  const dores = [
    { t: "No-show silencioso", d: "Cada falta é uma cadeira vazia que não volta. Sem confirmação ativa, você só descobre quando o horário já passou." },
    { t: "Pacote esquecido", d: "Cliente some no meio do pacote. A renovação que era certa vira receita perdida no caderninho." },
    { t: "Agenda no WhatsApp", d: "Marcar, remarcar e lembrar tudo na mão consome o seu dia e ainda deixa furo." },
  ];
  return (
    <section className="py-20 md:py-28 border-t border-[var(--color-cream-deep)]">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--color-coral)" }}>O que trava a receita</p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-tight max-w-2xl text-balance">
            A operação que você faz na mão é exatamente onde o dinheiro vaza.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {dores.map((d, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="h-full rounded-[var(--radius-xl2)] bg-white p-7 border border-[var(--color-cream-deep)]">
                <X className="h-6 w-6 mb-4" style={{ color: "var(--color-coral-deep)" }} />
                <h3 className="font-display text-xl font-semibold mb-2">{d.t}</h3>
                <p style={{ color: "var(--color-ink-soft)" }} className="leading-relaxed">{d.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- RECURSOS ---------- */
function Recursos() {
  const feats = [
    { icon: CalendarCheck, t: "Agenda inteligente", d: "Booking pela página da clínica, agenda por profissional e separação real entre o que foi agendado e o que foi realizado." },
    { icon: MessageCircleHeart, t: "Lembretes no WhatsApp", d: "Confirmação 24h e 2h antes, automáticas. O coração do 'no automático' e o maior corte de no-show.", destaque: true },
    { icon: PackageCheck, t: "Pacotes inteligentes", d: "O Liso rastreia cada pacote a vencer e esgotando, e avisa na hora certa de renovar." },
    { icon: RefreshCw, t: "Renovação automática", d: "Gatilho de renovação dispara sozinho — a alavanca de receita que ninguém lembra de puxar." },
  ];
  return (
    <section id="recursos" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--color-coral)" }}>Recursos</p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-tight max-w-2xl text-balance">
            Tudo que a sua clínica precisa, rodando sozinho.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-5 mt-12">
          {feats.map((f, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-full rounded-[var(--radius-xl2)] p-8 border"
                style={{
                  background: f.destaque ? "var(--color-ink)" : "white",
                  borderColor: f.destaque ? "transparent" : "var(--color-cream-deep)",
                  color: f.destaque ? "var(--color-cream)" : "inherit",
                }}
              >
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl mb-5"
                  style={{ background: f.destaque ? "var(--color-coral)" : "var(--color-cream)" }}
                >
                  <f.icon className="h-6 w-6" style={{ color: f.destaque ? "var(--color-cream)" : "var(--color-coral)" }} />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-3">{f.t}</h3>
                <p className="leading-relaxed" style={{ color: f.destaque ? "color-mix(in srgb, var(--color-cream) 80%, transparent)" : "var(--color-ink-soft)" }}>
                  {f.d}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- MÉTRICAS ---------- */
function Metricas() {
  const stats = [
    { v: 38, suffix: "%", l: "menos no-show com confirmação ativa" },
    { v: 35, suffix: "%", l: "mais renovação de pacote" },
    { v: 14, suffix: " dias", l: "de teste, sem cartão" },
    { v: 90, suffix: "%", l: "margem-alvo do modelo SaaS" },
  ];
  return (
    <section className="py-20" style={{ background: "var(--color-ink)" }}>
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.1} className="text-center">
              <div className="font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold" style={{ color: "var(--color-amber)" }}>
                <Counter to={s.v} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-sm" style={{ color: "color-mix(in srgb, var(--color-cream) 70%, transparent)" }}>{s.l}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- COMO FUNCIONA ---------- */
function Como() {
  const steps = [
    { n: "01", t: "Configure uma vez", d: "Serviços, pacotes, profissionais e horários. Onboarding 1-a-1 — a gente entra junto." },
    { n: "02", t: "Conecte o WhatsApp", d: "Ligamos a Z-API e os lembretes começam a sair sozinhos, com a cara da sua clínica." },
    { n: "03", t: "Deixe rodar", d: "Confirmações, renovações e agenda no piloto automático. Você só olha o resultado." },
  ];
  return (
    <section id="como" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--color-coral)" }}>Como funciona</p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-tight max-w-2xl text-balance">
            Três passos. Depois disso, é no automático.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div className="h-full rounded-[var(--radius-xl2)] bg-white p-8 border border-[var(--color-cream-deep)]">
                <span className="font-display text-5xl font-semibold" style={{ color: "var(--color-rose)" }}>{s.n}</span>
                <h3 className="font-display text-2xl font-semibold mt-4 mb-2">{s.t}</h3>
                <p style={{ color: "var(--color-ink-soft)" }} className="leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- COMPARATIVO ---------- */
function Comparativo() {
  const linhas = [
    ["Construído para depilação a laser", true, false],
    ["Pacotes a vencer com alerta de renovação", true, false],
    ["Lembretes WhatsApp prontos pro fluxo de laser", true, "parcial"],
    ["Separação agendamento × sessão realizada", true, false],
    ["Onboarding 1-a-1 com fundador", true, false],
  ] as const;
  return (
    <section className="py-20 md:py-28" style={{ background: "var(--color-cream-deep)" }}>
      <div className="mx-auto max-w-4xl px-5">
        <Reveal className="text-center">
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-tight text-balance">
            Genérico resolve "estética". <br />O Liso resolve <span className="italic" style={{ color: "var(--color-coral)" }}>laser</span>.
          </h2>
          <p className="mt-4" style={{ color: "var(--color-ink-soft)" }}>Trinks, AgendaPro e cia. atendem todo mundo. Esse é exatamente o ponto.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-[var(--radius-xl2)] bg-white border border-[var(--color-sand)]/50">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-4 border-b border-[var(--color-cream-deep)] text-sm font-semibold">
              <span></span>
              <span className="w-16 text-center" style={{ color: "var(--color-coral)" }}>Liso</span>
              <span className="w-20 text-center" style={{ color: "var(--color-ink-soft)" }}>Genéricos</span>
            </div>
            {linhas.map(([label, liso, outro], i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-4 border-b last:border-0 border-[var(--color-cream-deep)] text-sm">
                <span className="font-medium">{label}</span>
                <span className="w-16 flex justify-center">
                  {liso ? <Check className="h-5 w-5" style={{ color: "var(--color-jade)" }} /> : <X className="h-5 w-5 text-[var(--color-sand)]" />}
                </span>
                <span className="w-20 flex justify-center text-xs font-semibold" style={{ color: "var(--color-ink-soft)" }}>
                  {outro === "parcial" ? "parcial" : <X className="h-5 w-5 text-[var(--color-sand)]" />}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- PLANOS ---------- */
function Planos() {
  return (
    <section id="planos" className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--color-coral)" }}>Planos</p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-tight text-balance">
            Vire founding member antes das 20 vagas fecharem.
          </h2>
          <p className="mt-4" style={{ color: "var(--color-ink-soft)" }}>50% off vitalício. Para sempre, enquanto você for cliente.</p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 mt-12 items-stretch">
          {/* Founding */}
          <Reveal>
            <div className="relative h-full rounded-[var(--radius-xl2)] p-8 border-2 overflow-hidden" style={{ borderColor: "var(--color-coral)", background: "white" }}>
              <div className="absolute top-0 right-0 px-4 py-1.5 text-xs font-bold rounded-bl-2xl text-[var(--color-cream)]" style={{ background: "var(--color-coral)" }}>
                20 VAGAS · 50% OFF VITALÍCIO
              </div>
              <h3 className="font-display text-2xl font-semibold">Founding Member</h3>
              <p className="text-sm mt-1" style={{ color: "var(--color-ink-soft)" }}>Para quem entra agora e ajuda a moldar o produto.</p>
              <div className="mt-6 flex items-end gap-2">
                <span className="font-display text-5xl font-semibold">R$ 98</span>
                <span className="mb-1.5 text-sm line-through" style={{ color: "var(--color-sand)" }}>R$ 197</span>
                <span className="mb-1.5 text-sm" style={{ color: "var(--color-ink-soft)" }}>/mês</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {["Todos os recursos, sem limite", "Preço travado pra sempre", "Onboarding 1-a-1 com o fundador", "Linha direta no roadmap", "14 dias grátis, sem cartão"].map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <Check className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "var(--color-jade)" }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?plano=founding" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-semibold text-[var(--color-cream)] shadow-lg hover:shadow-xl transition" style={{ background: "var(--color-coral)" }}>
                Garantir minha vaga <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          {/* Full */}
          <Reveal delay={0.1}>
            <div className="h-full rounded-[var(--radius-xl2)] p-8 border border-[var(--color-cream-deep)] bg-white">
              <h3 className="font-display text-2xl font-semibold">Liso completo</h3>
              <p className="text-sm mt-1" style={{ color: "var(--color-ink-soft)" }}>O plano padrão depois das vagas founding.</p>
              <div className="mt-6 flex items-end gap-2">
                <span className="font-display text-5xl font-semibold">R$ 197</span>
                <span className="mb-1.5 text-sm" style={{ color: "var(--color-ink-soft)" }}>/mês</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {["Agenda + booking público", "Lembretes automáticos no WhatsApp", "Pacotes inteligentes + renovação", "Relatórios de no-show e faturamento", "LGPD: consentimento e exportação"].map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <Check className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "var(--color-jade)" }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?plano=full" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-semibold border border-[var(--color-ink)]/15 hover:bg-[var(--color-cream)] transition">
                Começar teste de 14 dias
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function Faq() {
  const qs = [
    { q: "Preciso instalar alguma coisa?", a: "Não. O Liso roda no navegador. A gente configura junto no onboarding e os lembretes começam a sair sozinhos." },
    { q: "Funciona com o meu WhatsApp atual?", a: "Sim. Conectamos via Z-API ao número da clínica, então as mensagens saem com a identidade de vocês." },
    { q: "E a LGPD?", a: "Tratamos consentimento, exportação e exclusão de dados das clientes, com log de auditoria das ações." },
    { q: "O preço founding sobe depois?", a: "Não para você. Os 50% off são vitalícios enquanto você for cliente. São só 20 vagas." },
  ];
  return (
    <section id="faq" className="py-20 md:py-28" style={{ background: "var(--color-cream-deep)" }}>
      <div className="mx-auto max-w-3xl px-5">
        <Reveal className="text-center mb-10">
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-semibold">Perguntas frequentes</h2>
        </Reveal>
        <div className="space-y-3">
          {qs.map((item, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <details className="group rounded-2xl bg-white p-6 border border-[var(--color-sand)]/40 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between font-display text-lg font-semibold list-none">
                  {item.q}
                  <span className="ml-4 transition-transform group-open:rotate-45 text-[var(--color-coral)] text-2xl leading-none">+</span>
                </summary>
                <p className="mt-3 leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA FINAL ---------- */
function CtaFinal() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "var(--color-ink)" }}>
      <div className="absolute inset-0 -z-0 opacity-40">
        <div className="glow-a absolute top-0 left-1/4 h-96 w-96 rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, rgba(224,101,74,0.6), transparent 65%)" }} />
        <div className="glow-b absolute bottom-0 right-1/4 h-96 w-96 rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, rgba(240,163,94,0.45), transparent 65%)" }} />
      </div>
      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.02] text-balance" style={{ color: "var(--color-cream)" }}>
            Coloque a sua clínica <span className="italic" style={{ color: "var(--color-amber)" }}>no automático</span> hoje.
          </h2>
          <p className="mt-5 text-lg" style={{ color: "color-mix(in srgb, var(--color-cream) 75%, transparent)" }}>
            14 dias grátis. Sem cartão. Onboarding com a gente do lado.
          </p>
          <Link href="/signup" className="mt-9 inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold shadow-xl hover:scale-[1.02] transition-transform" style={{ background: "var(--color-coral)", color: "var(--color-cream)" }}>
            Começar agora <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="py-12 border-t border-[var(--color-cream-deep)]">
      <div className="mx-auto max-w-6xl px-5 flex flex-col md:flex-row items-center justify-between gap-6">
        <Logo />
        <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
          © {new Date().getFullYear()} Liso · Sua clínica de laser, no automático.
        </p>
        <div className="flex gap-6 text-sm" style={{ color: "var(--color-ink-soft)" }}>
          <Link href="/login" className="hover:text-[var(--color-coral)] transition">Entrar</Link>
          <a href="#planos" className="hover:text-[var(--color-coral)] transition">Planos</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Marquee items={["depilação a laser", "menos no-show", "pacotes que renovam", "WhatsApp no automático", "agenda sem furo", "receita previsível"]} />
      <Problema />
      <Recursos />
      <Metricas />
      <Como />
      <Comparativo />
      <Planos />
      <Faq />
      <CtaFinal />
      <Footer />
    </main>
  );
}
