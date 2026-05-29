CREATE TYPE "public"."plano" AS ENUM('trial', 'founding', 'full');--> statement-breakpoint
CREATE TYPE "public"."status_agendamento" AS ENUM('confirmado', 'pendente', 'realizado', 'no_show', 'cancelado');--> statement-breakpoint
CREATE TABLE "agendamentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"cliente_id" uuid NOT NULL,
	"servico_id" uuid NOT NULL,
	"profissional" text NOT NULL,
	"inicio" timestamp NOT NULL,
	"status" "status_agendamento" DEFAULT 'pendente' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"usuario_id" uuid,
	"acao" text NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clientes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"telefone" text NOT NULL,
	"consentimento_lgpd" boolean DEFAULT false NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"deletado_em" timestamp
);
--> statement-breakpoint
CREATE TABLE "clinicas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"plano" "plano" DEFAULT 'trial' NOT NULL,
	"founding" boolean DEFAULT false NOT NULL,
	"trial_termina_em" timestamp,
	"cor" text DEFAULT '#E0654A' NOT NULL,
	"gateway_customer_id" text,
	"gateway_subscription_id" text,
	"subscription_status" text,
	"zapi_instance_id" text,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"deletado_em" timestamp
);
--> statement-breakpoint
CREATE TABLE "lembretes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"cliente_id" uuid NOT NULL,
	"tipo" text NOT NULL,
	"status" text DEFAULT 'agendado' NOT NULL,
	"disparar_em" timestamp NOT NULL,
	"enviado_em" timestamp
);
--> statement-breakpoint
CREATE TABLE "pacotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"sessoes_totais" integer NOT NULL,
	"preco" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pacotes_cliente" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"cliente_id" uuid NOT NULL,
	"pacote_id" uuid NOT NULL,
	"sessoes_usadas" integer DEFAULT 0 NOT NULL,
	"vence_em" timestamp
);
--> statement-breakpoint
CREATE TABLE "servicos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"duracao_min" integer NOT NULL,
	"preco" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"cliente_id" uuid NOT NULL,
	"realizada_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"senha_hash" text NOT NULL,
	"role" text DEFAULT 'owner' NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_servico_id_servicos_id_fk" FOREIGN KEY ("servico_id") REFERENCES "public"."servicos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lembretes" ADD CONSTRAINT "lembretes_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lembretes" ADD CONSTRAINT "lembretes_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pacotes" ADD CONSTRAINT "pacotes_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pacotes_cliente" ADD CONSTRAINT "pacotes_cliente_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pacotes_cliente" ADD CONSTRAINT "pacotes_cliente_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pacotes_cliente" ADD CONSTRAINT "pacotes_cliente_pacote_id_pacotes_id_fk" FOREIGN KEY ("pacote_id") REFERENCES "public"."pacotes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE no action ON UPDATE no action;