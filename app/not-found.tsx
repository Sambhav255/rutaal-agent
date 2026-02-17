"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">404 - Page Not Found</h2>
        <p className="text-zinc-400 mb-4">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="px-4 py-2 bg-rutaal-green text-white rounded hover:bg-rutaal-green/90 inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
