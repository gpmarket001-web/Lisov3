/**
 * Liso — schema PostgreSQL (Drizzle).
 * Só é usado quando DATABASE_URL existe. Em modo demo é ignorado.
 * Rode `npm run db:push` depois de setar DATABASE_URL pra criar as tabelas.
 */
import { pgTable, uuid, text, integer, boolean, timestamp, numeric, pgEnum } from "drizzle-orm/pg-core";

export const planoEnum = pgEnum("plano", ["trial", "founding", "full"]);
export const statusAgEnum = pgEnum("status_agendamento", [
  "confirmado", "pendente", "realizado", "no_show", "cancelado",
]);

export const clinicas = pgTable("clinicas", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: text("nome").notNull(),
  plano: planoEnum("plano").notNull().default("trial"),
  founding: boolean("founding").notNull().default(false),
  trialTerminaEm: timestamp("trial_termina_em"),
  cor: text("cor").notNull().default("#E0654A"),
  // assinatura (gateway agnóstico)
  gatewayCustomerId: text("gateway_customer_id"),
  gatewaySubscriptionId: text("gateway_subscription_id"),
  subscriptionStatus: text("subscription_status"),
  // whatsapp
  zapiInstanceId: text("zapi_instance_id"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
  deletadoEm: timestamp("deletado_em"),
});

export const usuarios = pgTable("usuarios", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicaId: uuid("clinica_id").notNull().references(() => clinicas.id),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash").notNull(),
  role: text("role").notNull().default("owner"), // owner | admin | profissional | recepcao
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const clientes = pgTable("clientes", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicaId: uuid("clinica_id").notNull().references(() => clinicas.id),
  nome: text("nome").notNull(),
  telefone: text("telefone").notNull(),
  consentimentoLgpd: boolean("consentimento_lgpd").notNull().default(false),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
  deletadoEm: timestamp("deletado_em"),
});

export const servicos = pgTable("servicos", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicaId: uuid("clinica_id").notNull().references(() => clinicas.id),
  nome: text("nome").notNull(),
  duracaoMin: integer("duracao_min").notNull(),
  preco: numeric("preco", { precision: 10, scale: 2 }).notNull(),
});

export const agendamentos = pgTable("agendamentos", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicaId: uuid("clinica_id").notNull().references(() => clinicas.id),
  clienteId: uuid("cliente_id").notNull().references(() => clientes.id),
  servicoId: uuid("servico_id").notNull().references(() => servicos.id),
  profissional: text("profissional").notNull(),
  inicio: timestamp("inicio").notNull(),
  status: statusAgEnum("status").notNull().default("pendente"),
});

// sessão realizada (passado) — separada do agendamento (futuro)
export const sessoes = pgTable("sessoes", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicaId: uuid("clinica_id").notNull().references(() => clinicas.id),
  clienteId: uuid("cliente_id").notNull().references(() => clientes.id),
  realizadaEm: timestamp("realizada_em").notNull().defaultNow(),
});

export const pacotes = pgTable("pacotes", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicaId: uuid("clinica_id").notNull().references(() => clinicas.id),
  nome: text("nome").notNull(),
  sessoesTotais: integer("sessoes_totais").notNull(),
  preco: numeric("preco", { precision: 10, scale: 2 }).notNull(),
});

export const pacotesCliente = pgTable("pacotes_cliente", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicaId: uuid("clinica_id").notNull().references(() => clinicas.id),
  clienteId: uuid("cliente_id").notNull().references(() => clientes.id),
  pacoteId: uuid("pacote_id").notNull().references(() => pacotes.id),
  sessoesUsadas: integer("sessoes_usadas").notNull().default(0),
  venceEm: timestamp("vence_em"),
});

export const lembretes = pgTable("lembretes", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicaId: uuid("clinica_id").notNull().references(() => clinicas.id),
  clienteId: uuid("cliente_id").notNull().references(() => clientes.id),
  tipo: text("tipo").notNull(),
  status: text("status").notNull().default("agendado"),
  dispararEm: timestamp("disparar_em").notNull(),
  enviadoEm: timestamp("enviado_em"),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicaId: uuid("clinica_id").notNull(),
  usuarioId: uuid("usuario_id"),
  acao: text("acao").notNull(),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});
