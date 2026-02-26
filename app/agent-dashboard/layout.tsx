import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Dashboard | Ruta'al Demo",
  description: "Field agent dashboard for Ruta'al microfinance. Loan queue, repayments, and weekly earnings.",
};

export default function AgentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
