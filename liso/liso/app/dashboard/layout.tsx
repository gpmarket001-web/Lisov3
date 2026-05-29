import { Sidebar } from "@/components/dash";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-cream)" }}>
      <Sidebar />
      <main className="flex-1 px-5 md:px-10 py-8 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  );
}
