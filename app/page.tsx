"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useLiveClock } from "@/hooks/useLiveClock";
import { WalletHeader } from "@/components/WalletHeader";
import { LoanCard } from "@/components/LoanCard";
import { RepaymentTable } from "@/components/RepaymentTable";
import { WeeklyChart } from "@/components/WeeklyChart";
import { useAgentStore } from "@/lib/store";
import { getRepaymentStatus } from "@/components/RepaymentTable";
import { Clock, Trophy } from "lucide-react";

export default function DashboardPage() {
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7243/ingest/c4acd6e7-1082-4d91-b710-9236f5bae6ec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:DashboardPage',message:'DashboardPage render start',data:{timestamp:Date.now(),pathname:window.location.pathname,hostname:window.location.hostname},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
  }, []);
  // #endregion
  const loanQueue = useAgentStore((s) => s.loanQueue);
  const injectRandomLoan = useAgentStore((s) => s.injectRandomLoan);
  const activeLoans = useAgentStore((s) => s.activeLoans);
  const [rejectingId, setRejectingId] = useState<string>("");
  const [newLoanIds, setNewLoanIds] = useState<Set<string>>(new Set());
  
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7243/ingest/c4acd6e7-1082-4d91-b710-9236f5bae6ec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:useAgentStore',message:'store values loaded',data:{loanQueueLen:loanQueue.length,activeLoansLen:activeLoans.length},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
  }, [loanQueue.length, activeLoans.length]);
  // #endregion

  // Auto-inject new loan every 20 seconds (only when queue has fewer than 3)
  useEffect(() => {
    const interval = setInterval(() => {
      const newLoan = injectRandomLoan();
      if (newLoan) setNewLoanIds((prev) => new Set(prev).add(newLoan.id));
    }, 20000);
    return () => clearInterval(interval);
  }, [injectRandomLoan]);

  // Track new loans for animation - clear after animation
  useEffect(() => {
    if (newLoanIds.size > 0) {
      const t = setTimeout(() => setNewLoanIds(new Set()), 500);
      return () => clearTimeout(t);
    }
  }, [newLoanIds]);

  const now = useLiveClock();
  const topBorrower = activeLoans.reduce(
    (best, loan) => {
      const status = getRepaymentStatus(loan.nextDue);
      return status === "on_track" && (!best || loan.amount > best.amount)
        ? loan
        : best;
    },
    null as (typeof activeLoans)[0] | null
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex min-h-screen flex-col">
        {/* Row 1: Agent Header */}
        <WalletHeader />

        {/* Row 2: Loan Queue (60%) + Quick Stats (40%) */}
        <div className="flex flex-1 flex-col gap-4 p-6 lg:flex-row">
          <div className="flex-[3] min-w-0 lg:flex-[6]">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Loan Request Queue
              </h2>
              <span className="text-sm text-zinc-500">
                {loanQueue.length} pending
              </span>
            </div>
            <div className="space-y-3">
              {loanQueue.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-900/30 py-16 text-center">
                  <p className="text-zinc-500">No pending requests</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    New USSD requests will appear here
                  </p>
                </div>
              ) : (
                loanQueue.map((loan) => (
                  <LoanCard
                    key={loan.id}
                    loan={loan}
                    isNew={newLoanIds.has(loan.id)}
                    isRejecting={rejectingId === loan.id}
                    onRejectStart={setRejectingId}
                  />
                ))
              )}
            </div>
          </div>

          <div className="flex-[2] space-y-4 lg:flex-[4]">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <WeeklyChart />
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-400">
                <Trophy className="size-4 text-rutaal-yellow" />
                Top Borrower
              </h3>
              {topBorrower ? (
                <div>
                  <div className="font-medium text-white">
                    {topBorrower.borrowerName}
                  </div>
                  <div className="mt-1 text-sm text-zinc-500">
                    Repayment score: On Track
                  </div>
                  <div className="mt-2 font-mono text-lg font-semibold text-rutaal-green">
                    ${topBorrower.amount} loan
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No data yet</p>
              )}
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-400">
                <Clock className="size-4" />
                Local Time
              </h3>
              <div className="font-mono text-2xl font-semibold tabular-nums text-white">
                {format(now, "HH:mm:ss")}
              </div>
              <div className="mt-1 text-sm text-zinc-500">
                {format(now, "EEEE, MMM d")}
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Repayment Tracker */}
        <div className="border-t border-zinc-800 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Repayment Tracker
          </h2>
          <RepaymentTable />
        </div>
      </div>
    </div>
  );
}
