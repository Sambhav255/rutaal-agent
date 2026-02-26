import Link from "next/link";
import Image from "next/image";
import { UssdPhone } from "@/components/UssdPhone";

export default function UserDashboardPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden overflow-y-auto bg-[#f5f3ed] px-3 py-6 sm:px-6 safe-area-padding"
    >
      <Link
        href="/"
        className="fixed top-3 left-3 sm:top-4 sm:left-6 z-10 flex items-center transition-opacity hover:opacity-80 min-h-[44px] min-w-[44px]"
        title="Back to landing page"
      >
        <Image
          src="/RUTA_AL_Logo.png"
          alt="Ruta'al - Back to landing page"
          width={160}
          height={58}
          className="h-10 w-auto sm:h-12"
        />
      </Link>
      <div className="relative flex flex-col items-center pt-14 sm:pt-16 w-full max-w-full">
        <h1 className="mb-2 text-center text-base font-semibold uppercase tracking-wider text-[#323030]/80 sm:text-xl px-2">
          USSD User Experience
        </h1>
        <p className="mb-4 sm:mb-6 text-center text-xs sm:text-sm text-[#323030]/60 max-w-sm px-2">
          Tap the screen to start, then press the green Call button. Follow the prompts—*777# is pre-filled.
        </p>
        <UssdPhone />
      </div>
    </main>
  );
}

