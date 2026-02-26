import Link from "next/link";
import Image from "next/image";
import { UssdPhone } from "@/components/UssdPhone";

export default function UserDashboardPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f5f3ed]"
    >
      <Link
        href="/"
        className="fixed top-4 left-6 z-10 flex items-center transition-opacity hover:opacity-80"
        title="Back to landing page"
      >
        <Image
          src="/RUTA_AL_Logo.png"
          alt="Ruta'al - Back to landing page"
          width={160}
          height={58}
          className="h-11 w-auto sm:h-12"
        />
      </Link>
      <div className="relative flex flex-col items-center pt-16">
        <h1 className="mb-2 text-center text-lg font-semibold uppercase tracking-wider text-[#323030]/80 sm:text-xl">
          USSD User Experience
        </h1>
        <p className="mb-6 text-center text-sm text-[#323030]/60 max-w-sm">
          Tap the screen to start, then press the green Call button. Follow the prompts—*777# is pre-filled.
        </p>
        <UssdPhone />
      </div>
    </main>
  );
}

