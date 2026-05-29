# Liso — Sua clínica de laser, no automático.

SaaS vertical para clínicas de depilação a laser. Agenda, lembretes automáticos no
WhatsApp, pacotes inteligentes e renovação no piloto automático.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Framer Motion · Drizzle ORM · PostgreSQL.

---

## ⚡ TL;DR — sobe na Vercel sem configurar nada

O projeto roda em **modo demo** quando não há `DATABASE_URL`: usa dados seedados,
o app funciona inteiro e o WhatsApp entra em modo simulação (loga em vez de enviar).
Isso quer dizer que você consegue subir e ver no ar HOJE, e plugar os terceiros depois.

```bash
npm install
npm run dev      # http://localhost:3000
```

---

## 🚀 Deploy: GitHub → Vercel

1. **GitHub**
   ```bash
   git init && git add . && git commit -m "Liso v3"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/liso.git
   git push -u origin main
   ```
2. **Vercel** → New Project → importe o repo. Framework: **Next.js** (detecta sozinho).
3. Clique em **Deploy**. Pronto — já está no ar em modo demo.
4. (Opcional agora, obrigatório pra produção real) adicione as variáveis abaixo em
   *Settings → Environment Variables* e faça redeploy.

O `vercel.json` já configura o **Cron** dos lembretes (`/api/cron/reminders`, a cada 15 min).

---

## 🔌 O que precisa de terceiro (plugue quando quiser virar produção)

Tudo isolado em `lib/` com `// TODO(terceiro)` marcando onde entra a chave.

| Terceiro | Onde | Variáveis | Sem isso… |
|---|---|---|---|
| **Banco** (Neon/Supabase/Vercel Postgres) | `lib/db.ts` + `lib/schema.ts` | `DATABASE_URL` | roda em modo demo |
| **Gateway de pagamento** (Asaas/Mercado Pago/Pagar.me/Iugu) | `lib/payments.ts` | `PAYMENT_PROVIDER`, `PAYMENT_API_KEY`, `PAYMENT_WEBHOOK_SECRET`, `PAYMENT_BASE_URL` | checkout em modo demo |
| **WhatsApp** (Z-API) | `lib/whatsapp.ts` | `ZAPI_INSTANCE_ID`, `ZAPI_TOKEN`, `ZAPI_CLIENT_TOKEN` | lembrete simulado (log) |
| **E-mail** (Resend) | — | `RESEND_API_KEY`, `EMAIL_FROM` | sem e-mail |
| **Cron** | `vercel.json` | `CRON_SECRET` | endpoint aberto |

Copie `.env.example` → `.env.local` e preencha o que tiver.

### Ligar o banco de verdade
```bash
# 1. cole a DATABASE_URL no .env.local / Vercel
# 2. crie as tabelas:
npm run db:push
```
A partir daí o app deixa o modo demo automaticamente (ver `isDemo` em `lib/db.ts`).

### Webhooks pra registrar nos painéis
- Pagamento: `https://SEU_DOMINIO/api/payments/webhook`
- (Cron já é interno da Vercel)

---

## 🗂 Estrutura

```
liso/
├── app/
│   ├── page.tsx              # landing redesenhada (animada)
│   ├── login / signup        # auth
│   ├── dashboard/            # visão geral, agenda, clientes,
│   │                         #   pacotes, lembretes, financeiro, config
│   └── api/
│       ├── cron/reminders    # worker de lembretes (Vercel Cron)
│       └── payments/webhook  # webhook do gateway
├── components/  site.tsx (landing) · dash.tsx (app)
├── lib/         data.ts (demo) · db.ts · schema.ts · payments.ts · whatsapp.ts
├── vercel.json  cron a cada 15 min
└── .env.example
```

---

## ✅ Verificado
Build de produção passa (`npm run build`, 12 rotas), home e dashboard respondem 200,
e o cron processa os lembretes em modo simulado. Login/signup demo levam ao dashboard.

## Próximos passos sugeridos
1. Subir na Vercel em demo (ver no ar).
2. Provisionar Neon Postgres + `db:push`.
3. Conectar Z-API ao número da clínica da sua esposa (alpha tester #0).
4. Plumbar o gateway escolhido em `lib/payments.ts`.
5. Trocar a auth demo por auth real (JWT + cookie httpOnly).
