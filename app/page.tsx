import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f5f3ed] px-4 py-8 sm:px-6 sm:py-10 safe-area-padding">
      <div className="w-full max-w-3xl space-y-6 sm:space-y-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Image
            src="/RUTA_AL_Logo.png"
            alt="Ruta'al"
            width={240}
            height={80}
            className="h-20 w-auto sm:h-24"
          />
          <p className="text-base text-[#323030]/90 sm:text-lg max-w-xl">
            <span className="font-semibold text-[#323030]">Banking Without Barriers.</span>{" "}
            Microfinance for feature phones—no smartphone required.
          </p>
          <p className="text-sm text-[#323030]/70 max-w-lg">
            Choose an experience below.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <Link
            href="/user-dashboard"
            className="group rounded-xl border border-rutaal-navy/20 bg-white p-4 sm:p-6 shadow-sm transition-all hover:border-rutaal-green hover:shadow-md active:scale-[0.99] min-h-[44px] flex flex-col justify-center"
          >
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-rutaal-green/80">
              User Experience
            </div>
            <h2 className="mb-2 text-lg font-semibold text-[#323030] group-hover:text-rutaal-green">
              User dashboard (USSD phone)
            </h2>
            <p className="text-sm text-[#323030]/70">
              Interactive prototype of the feature-phone USSD journey.
            </p>
          </Link>

          <Link
            href="/agent-dashboard"
            className="group rounded-xl border border-rutaal-navy/20 bg-white p-4 sm:p-6 shadow-sm transition-all hover:border-rutaal-yellow hover:shadow-md active:scale-[0.99] min-h-[44px] flex flex-col justify-center"
          >
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-rutaal-yellow/80">
              Agent Experience
            </div>
            <h2 className="mb-2 text-lg font-semibold text-[#323030] group-hover:text-rutaal-yellow">
              Agent dashboard
            </h2>
            <p className="text-sm text-[#323030]/70">
              Live React dashboard for field agents showing loan queue, repayments, and activity.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
