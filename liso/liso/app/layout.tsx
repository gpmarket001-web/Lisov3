import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liso — Sua clínica de laser, no automático.",
  description:
    "O sistema vertical para clínicas de depilação a laser. Agenda, lembretes automáticos no WhatsApp, pacotes inteligentes e renovação no piloto automático.",
  keywords: ["depilação a laser", "clínica de laser", "agenda", "WhatsApp", "SaaS estética"],
  openGraph: {
    title: "Liso — Sua clínica de laser, no automático.",
    description: "Menos no-show, mais renovação. O Liso cuida da operação invisível da sua clínica.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
