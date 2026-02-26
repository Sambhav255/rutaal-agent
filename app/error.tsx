"use client";

import Image from "next/image";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";
  const message = isDev ? error.message : "An unexpected error occurred. Please try again.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f3ed] text-[#323030] safe-area-padding px-6">
      <Link href="/" className="mb-8 transition-opacity hover:opacity-80">
        <Image
          src="/RUTA_AL_Logo.png"
          alt="Ruta'al"
          width={180}
          height={65}
          className="h-12 w-auto"
        />
      </Link>
      <div id="main" className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-[#323030]">Something went wrong</h2>
        <p className="text-[#323030]/70 mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 min-h-[44px] bg-rutaal-green text-white rounded-md hover:bg-rutaal-green/90 font-medium"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 min-h-[44px] bg-white border border-rutaal-navy/20 text-[#323030] rounded-md hover:bg-[#f5f3ed] font-medium inline-flex items-center justify-center"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
