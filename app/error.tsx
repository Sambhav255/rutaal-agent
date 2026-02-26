"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f3ed] text-[#323030]">
      <div className="text-center max-w-md px-6">
        <h2 className="text-2xl font-bold mb-4 text-[#323030]">Something went wrong</h2>
        <p className="text-[#323030]/70 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-rutaal-green text-white rounded-md hover:bg-rutaal-green/90 font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
