"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
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
        <h2 className="text-2xl font-bold mb-4">404 – Page Not Found</h2>
        <p className="text-[#323030]/70 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="px-6 py-3 min-h-[44px] bg-rutaal-green text-white rounded-md hover:bg-rutaal-green/90 inline-flex items-center justify-center font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
