"use client";

import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* Logo Liso — wordmark com pingo coral animado */
export function Logo({ className = "", invert = false }: { className?: string; invert?: boolean }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <span
        className="font-display text-2xl font-semibold tracking-tight"
        style={{ color: invert ? "var(--color-cream)" : "var(--color-ink)" }}
      >
        liso
      </span>
      <motion.span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: "var(--color-coral)" }}
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* Reveal on scroll com stagger opcional */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Contador animado quando entra na viewport */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) =>
        setDisplay(v.toLocaleString("pt-BR", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })),
    });
    return controls.stop;
  }, [inView, to, mv, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* Glow de fundo orgânico */
export function GlowBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10" aria-hidden>
      <div
        className="glow-a absolute -top-40 -left-32 h-[42rem] w-[42rem] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(224,101,74,0.35), transparent 65%)" }}
      />
      <div
        className="glow-b absolute top-20 -right-40 h-[40rem] w-[40rem] rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(240,163,94,0.28), transparent 65%)" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full blur-[120px] glow-a"
        style={{ background: "radial-gradient(circle, rgba(232,196,184,0.4), transparent 65%)" }}
      />
    </div>
  );
}

/* Marquee infinito */
export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-6">
      <div className="marquee-track flex w-max gap-12">
        {doubled.map((it, i) => (
          <span
            key={i}
            className="font-display text-lg italic whitespace-nowrap"
            style={{ color: "var(--color-ink-soft)" }}
          >
            {it}
            <span style={{ color: "var(--color-coral)" }}> · </span>
          </span>
        ))}
      </div>
    </div>
  );
}
