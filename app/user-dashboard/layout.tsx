import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Experience | Ruta'al Demo",
  description: "USSD-style user experience for Ruta'al microfinance. Banking without barriers on feature phones.",
};

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
