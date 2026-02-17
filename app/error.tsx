"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8f84f473-30d1-46b4-8242-a409effc4f47',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'error.tsx:Error',message:'Error boundary caught',data:{message:error.message,digest:error.digest,stack:error.stack?.substring(0,500)},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-zinc-400 mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-rutaal-green text-white rounded hover:bg-rutaal-green/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
