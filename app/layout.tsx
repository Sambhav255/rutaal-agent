import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Ruta'al – Banking Without Barriers | Demo",
  description: "Microfinance for feature phones. Try the USSD user experience and agent dashboard demo.",
  icons: {
    icon: "/RUTA_AL_Logo.png",
    apple: "/RUTA_AL_Logo.png",
  },
  openGraph: {
    title: "Ruta'al – Banking Without Barriers | Demo",
    description: "Microfinance for feature phones. Try the USSD user experience and agent dashboard demo.",
    images: ["/RUTA_AL_Logo.png"],
  },
  twitter: {
    card: "summary",
    title: "Ruta'al – Banking Without Barriers | Demo",
    description: "Microfinance for feature phones. Try the USSD user experience and agent dashboard demo.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f5f3ed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} font-sans antialiased min-h-screen overscroll-behavior-none`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-rutaal-green focus:text-white focus:rounded-md focus:outline-none"
        >
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster position="bottom-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
