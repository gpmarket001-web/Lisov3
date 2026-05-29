/**
 * Liso — camada de domínio + dados de demonstração.
 *
 * O app inteiro lê daqui. Em modo demo (sem DATABASE_URL) ele usa estes
 * dados seedados, então sobe na Vercel e funciona na hora. Quando você
 * pluga o Postgres (lib/db.ts + lib/schema.ts), troca a origem aqui.
 */

export type Plano = "trial" | "founding" | "full";
export type StatusAgendamento = "confirmado" | "pendente" | "realizado" | "no_show" | "cancelado";

export interface Clinica {
  id: string;
  nome: string;
  plano: Plano;
  trialTerminaEm: string | null;
  founding: boolean;
  cor: string;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  ultimaSessao: string | null;
  totalSessoes: number;
  consentimentoLgpd: boolean;
}

export interface Servico {
  id: string;
  nome: string;
  duracaoMin: number;
  preco: number;
}

export interface Agendamento {
  id: string;
  clienteNome: string;
  servico: string;
  profissional: string;
  data: string; // ISO
  horario: string;
  status: StatusAgendamento;
}

export interface PacoteCliente {
  id: string;
  clienteNome: string;
  pacote: string;
  sessoesTotais: number;
  sessoesUsadas: number;
  venceEm: string;
  risco: "ok" | "vencendo" | "esgotando";
}

export interface Lembrete {
  id: string;
  clienteNome: string;
  canal: "whatsapp";
  tipo: "confirmacao_24h" | "lembrete_2h" | "renovacao_pacote";
  status: "agendado" | "enviado" | "respondido" | "falhou";
  quando: string;
}

/* ---------------- Dados demo ---------------- */

export const CLINICA_DEMO: Clinica = {
  id: "cln_demo",
  nome: "Studio Glow — Depilação a Laser",
  plano: "founding",
  trialTerminaEm: null,
  founding: true,
  cor: "#E0654A",
};

export const clientes: Cliente[] = [
  { id: "c1", nome: "Marina Alves", telefone: "(31) 99812-4471", ultimaSessao: "2026-05-14", totalSessoes: 6, consentimentoLgpd: true },
  { id: "c2", nome: "Juliana Prado", telefone: "(31) 99744-1180", ultimaSessao: "2026-05-22", totalSessoes: 3, consentimentoLgpd: true },
  { id: "c3", nome: "Bianca Rocha", telefone: "(31) 99655-7723", ultimaSessao: "2026-04-30", totalSessoes: 9, consentimentoLgpd: true },
  { id: "c4", nome: "Camila Souza", telefone: "(31) 99500-9921", ultimaSessao: "2026-05-25", totalSessoes: 1, consentimentoLgpd: false },
  { id: "c5", nome: "Fernanda Lima", telefone: "(31) 99431-2098", ultimaSessao: "2026-05-09", totalSessoes: 8, consentimentoLgpd: true },
  { id: "c6", nome: "Patrícia Nunes", telefone: "(31) 99388-6655", ultimaSessao: "2026-05-27", totalSessoes: 4, consentimentoLgpd: true },
];

export const servicos: Servico[] = [
  { id: "s1", nome: "Axila", duracaoMin: 15, preco: 80 },
  { id: "s2", nome: "Virilha completa", duracaoMin: 30, preco: 180 },
  { id: "s3", nome: "Pernas completas", duracaoMin: 50, preco: 320 },
  { id: "s4", nome: "Buço", duracaoMin: 10, preco: 60 },
  { id: "s5", nome: "Corpo inteiro", duracaoMin: 90, preco: 690 },
];

export const agendamentos: Agendamento[] = [
  { id: "a1", clienteNome: "Marina Alves", servico: "Pernas completas", profissional: "Aline", data: "2026-05-28", horario: "09:00", status: "confirmado" },
  { id: "a2", clienteNome: "Juliana Prado", servico: "Axila", profissional: "Aline", data: "2026-05-28", horario: "10:30", status: "confirmado" },
  { id: "a3", clienteNome: "Camila Souza", servico: "Virilha completa", profissional: "Rafa", data: "2026-05-28", horario: "11:00", status: "pendente" },
  { id: "a4", clienteNome: "Bianca Rocha", servico: "Corpo inteiro", profissional: "Aline", data: "2026-05-28", horario: "14:00", status: "confirmado" },
  { id: "a5", clienteNome: "Fernanda Lima", servico: "Buço", profissional: "Rafa", data: "2026-05-28", horario: "16:30", status: "pendente" },
  { id: "a6", clienteNome: "Patrícia Nunes", servico: "Axila", profissional: "Aline", data: "2026-05-29", horario: "09:30", status: "confirmado" },
];

export const pacotes: PacoteCliente[] = [
  { id: "p1", clienteNome: "Bianca Rocha", pacote: "Corpo inteiro — 10 sessões", sessoesTotais: 10, sessoesUsadas: 9, venceEm: "2026-06-04", risco: "esgotando" },
  { id: "p2", clienteNome: "Fernanda Lima", pacote: "Pernas — 8 sessões", sessoesTotais: 8, sessoesUsadas: 8, venceEm: "2026-06-10", risco: "esgotando" },
  { id: "p3", clienteNome: "Marina Alves", pacote: "Virilha — 6 sessões", sessoesTotais: 6, sessoesUsadas: 4, venceEm: "2026-06-02", risco: "vencendo" },
  { id: "p4", clienteNome: "Juliana Prado", pacote: "Axila — 6 sessões", sessoesTotais: 6, sessoesUsadas: 2, venceEm: "2026-08-15", risco: "ok" },
];

export const lembretes: Lembrete[] = [
  { id: "l1", clienteNome: "Marina Alves", canal: "whatsapp", tipo: "confirmacao_24h", status: "respondido", quando: "Ontem 09:00" },
  { id: "l2", clienteNome: "Juliana Prado", canal: "whatsapp", tipo: "lembrete_2h", status: "enviado", quando: "Hoje 08:30" },
  { id: "l3", clienteNome: "Camila Souza", canal: "whatsapp", tipo: "confirmacao_24h", status: "agendado", quando: "Hoje 11:00" },
  { id: "l4", clienteNome: "Bianca Rocha", canal: "whatsapp", tipo: "renovacao_pacote", status: "agendado", quando: "Amanhã 10:00" },
  { id: "l5", clienteNome: "Fernanda Lima", canal: "whatsapp", tipo: "renovacao_pacote", status: "enviado", quando: "Hoje 07:45" },
];

/* ---------------- KPIs derivados ---------------- */

export function kpis() {
  const faturamentoMes = 18740;
  const agendamentosHoje = agendamentos.filter((a) => a.data === "2026-05-28").length;
  const taxaNoShow = 6; // %
  const pacotesEmRisco = pacotes.filter((p) => p.risco !== "ok").length;
  return {
    faturamentoMes,
    agendamentosHoje,
    taxaNoShow,
    pacotesEmRisco,
    lembretesEnviados: 342,
    receitaRecuperada: 4980,
  };
}

export const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
