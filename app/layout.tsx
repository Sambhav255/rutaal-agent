import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Ruta'al Agent Dashboard",
  description: "Microfinance field agent operations dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7243/ingest/c4acd6e7-1082-4d91-b710-9236f5bae6ec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'layout.tsx:RootLayout',message:'RootLayout render',data:{isClient:true,pathname:window.location.pathname},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
  }
  // #endregion
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
