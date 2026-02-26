"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f3ed] text-[#323030]">
      <div className="text-center max-w-md px-6">
        <h2 className="text-2xl font-bold mb-4">404 – Page Not Found</h2>
        <p className="text-[#323030]/70 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="px-4 py-2 bg-rutaal-green text-white rounded-md hover:bg-rutaal-green/90 inline-block font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
