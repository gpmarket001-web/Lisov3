"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { criarCliente, criarAgendamento, criarServico } from "@/app/actions/data";

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" style={{ background: "rgba(26,20,17,0.45)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-[var(--radius-xl2)] bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-full hover:bg-[var(--color-cream)]"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-[var(--color-cream-deep)] bg-[var(--color-cream)] px-4 py-3 text-sm";
const btnCls = "w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-[var(--color-cream)] transition disabled:opacity-60";

function Erro({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-sm rounded-lg px-3 py-2" style={{ background: "rgba(194,74,48,0.1)", color: "var(--color-coral-deep)" }}>{msg}</p>;
}

export function NovaClienteBtn() {
  const [open, setOpen] = useState(false);
  const [erro, setErro] = useState<string>();
  const [pending, start] = useTransition();
  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--color-cream)]" style={{ background: "var(--color-coral)" }}>
        <Plus className="h-4 w-4" /> Nova cliente
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Nova cliente">
        <form action={(fd) => start(async () => {
          const r = await criarCliente(fd);
          if (r && "error" in r) setErro(r.error); else { setErro(undefined); setOpen(false); }
        })} className="space-y-3">
          <input name="nome" required placeholder="Nome completo" className={inputCls} />
          <input name="telefone" required placeholder="(31) 99999-9999" className={inputCls} />
          <label className="flex items-center gap-2 text-sm" style={{ color: "var(--color-ink-soft)" }}>
            <input type="checkbox" name="lgpd" /> Cliente consentiu com a LGPD
          </label>
          <Erro msg={erro} />
          <button type="submit" disabled={pending} className={btnCls} style={{ background: "var(--color-coral)" }}>
            {pending ? "Salvando…" : "Salvar cliente"}
          </button>
        </form>
      </Modal>
    </>
  );
}

type Opt = { id: string; nome: string };

export function NovoAgendamentoBtn({ clientes, servicos }: { clientes: Opt[]; servicos: Opt[] }) {
  const [open, setOpen] = useState(false);
  const [erro, setErro] = useState<string>();
  const [pending, start] = useTransition();
  const semBase = clientes.length === 0 || servicos.length === 0;
  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--color-cream)]" style={{ background: "var(--color-coral)" }}>
        <Plus className="h-4 w-4" /> Novo agendamento
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Novo agendamento">
        {semBase ? (
          <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
            Cadastre ao menos uma cliente e um serviço antes de agendar.
          </p>
        ) : (
          <form action={(fd) => start(async () => {
            const r = await criarAgendamento(fd);
            if (r && "error" in r) setErro(r.error); else { setErro(undefined); setOpen(false); }
          })} className="space-y-3">
            <select name="clienteId" required className={inputCls} defaultValue="">
              <option value="" disabled>Cliente…</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
            <select name="servicoId" required className={inputCls} defaultValue="">
              <option value="" disabled>Serviço…</option>
              {servicos.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>
            <input name="profissional" required placeholder="Profissional" className={inputCls} />
            <input name="inicio" type="datetime-local" required className={inputCls} />
            <Erro msg={erro} />
            <button type="submit" disabled={pending} className={btnCls} style={{ background: "var(--color-coral)" }}>
              {pending ? "Agendando…" : "Agendar"}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}

export function NovoServicoBtn() {
  const [open, setOpen] = useState(false);
  const [erro, setErro] = useState<string>();
  const [pending, start] = useTransition();
  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border border-[var(--color-cream-deep)] hover:bg-[var(--color-cream)] transition">
        <Plus className="h-4 w-4" /> Novo serviço
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Novo serviço">
        <form action={(fd) => start(async () => {
          const r = await criarServico(fd);
          if (r && "error" in r) setErro(r.error); else { setErro(undefined); setOpen(false); }
        })} className="space-y-3">
          <input name="nome" required placeholder="Nome do serviço (ex: Axila)" className={inputCls} />
          <input name="duracao" type="number" required placeholder="Duração (min)" className={inputCls} />
          <input name="preco" required placeholder="Preço (ex: 180)" className={inputCls} />
          <Erro msg={erro} />
          <button type="submit" disabled={pending} className={btnCls} style={{ background: "var(--color-coral)" }}>
            {pending ? "Salvando…" : "Salvar serviço"}
          </button>
        </form>
      </Modal>
    </>
  );
}
