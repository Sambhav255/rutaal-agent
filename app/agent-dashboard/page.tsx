"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useLiveClock } from "@/hooks/useLiveClock";
import { WalletHeader } from "@/components/WalletHeader";
import { LoanCard } from "@/components/LoanCard";
import { RepaymentTable } from "@/components/RepaymentTable";
import { WeeklyChart } from "@/components/WeeklyChart";
import { useAgentStore } from "@/lib/store";
import { getRepaymentStatus } from "@/components/RepaymentTable";
import { Headphones, Trophy, UserPlus, UserRound } from "lucide-react";
import { UserOnboardingModal } from "@/components/UserOnboardingModal";
import { RutaalManagementContact } from "@/components/RutaalManagementContact";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DashboardPage() {
  const loanQueue = useAgentStore((s) => s.loanQueue);
  const activeLoans = useAgentStore((s) => s.activeLoans);
  const addLoanRequest = useAgentStore((s) => s.addLoanRequest);
  const [rejectingId, setRejectingId] = useState<string>("");
  const [newLoanIds, setNewLoanIds] = useState<Set<string>>(new Set());
  const [collectionPopup, setCollectionPopup] = useState<{
    borrowerName: string;
    amount: number;
  } | null>(null);
  const [userOnboardingOpen, setUserOnboardingOpen] = useState(false);
  const [rutaalManagementOpen, setRutaalManagementOpen] = useState(false);

  // No auto-inject: loan queue shows only Sambhav Lamichhane $250

  // Track new loans for animation - clear after animation
  useEffect(() => {
    if (newLoanIds.size > 0) {
      const t = setTimeout(() => setNewLoanIds(new Set()), 500);
      return () => clearTimeout(t);
    }
  }, [newLoanIds]);

  // Listen for user-side actions via BroadcastChannel and surface as popups
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("rutaal-demo");
    } catch {
      channel = null;
    }

    if (!channel) return;

    channel.onmessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.source !== "rutaal-user") return;

      if (data.type === "loan_approved") {
        const amount = Number(data.payload?.amount ?? 0) || 250;
        const phone = String(data.payload?.phone ?? "").trim() || "+977 *** *** 5543";
        const borrowerName = String(data.payload?.borrowerName ?? "").trim() || "Sambhav Lamichhane";

        const now = new Date();
        const expiresAt = new Date(now.getTime() + 20 * 60 * 1000);

        addLoanRequest({
          id: `ussd-${now.getTime()}`,
          borrowerName,
          phone,
          amount,
          creditScore: 72,
          requestedAt: now,
          expiresAt,
        });

        setCollectionPopup({ borrowerName, amount });

        toast.success("New loan request", {
          description: `${borrowerName} requested a $${amount} loan via *777#.`,
        });
      } else if (data.type === "send_money_success") {
        const amount = Number(data.payload?.amount ?? 0) || 50;
        toast.info("Customer sent money", {
          description: `USSD customer sent $${amount}.`,
        });
      }
    };

    return () => {
      channel?.close();
    };
  }, [addLoanRequest]);

  const now = useLiveClock();
  const topBorrower = activeLoans.reduce(
    (best, loan) => {
      const status = getRepaymentStatus(loan.nextDue);
      return status === "on_track" && (!best || loan.amount > best.amount)
        ? loan
        : best;
    },
    null as (typeof activeLoans)[0] | null,
  );

  return (
    <div className="min-h-screen bg-[#f5f3ed] text-[#323030] safe-area-padding">
      <div className="flex min-h-screen flex-col">
        {/* Row 1: Agent Header */}
        <WalletHeader />

        {/* Row 2: Loan Queue + Repayment Tracker (left) | Sidebar (right) */}
        <div className="flex flex-1 flex-col gap-4 p-3 sm:p-4 lg:flex-row">
          <div className="flex-[3] min-w-0 space-y-4 lg:flex-[6]">
            <section>
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="text-lg font-semibold text-[#323030]">
                  Loan Request Queue
                </h2>
                <span className="text-sm text-[#323030]/60">
                  {loanQueue.length} pending
                </span>
              </div>
              <div className="space-y-2">
                {loanQueue.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-rutaal-navy/20 bg-white py-12 text-center px-4">
                    <p className="text-[#323030]/70">No pending requests</p>
                    <p className="mt-1 text-sm text-[#323030]/50">
                      Open the User Experience in another tab, complete a loan flow, and it will appear here.
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
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-[#323030]">
                Repayment Tracker
              </h2>
              <RepaymentTable />
            </section>
          </div>

          <div className="flex-[2] space-y-3 lg:flex-[4]">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUserOnboardingOpen(true)}
                className="flex-1 gap-1 sm:gap-1.5 border-rutaal-navy/20 bg-white text-[11px] sm:text-xs hover:bg-[#f5f3ed] min-h-[44px]"
              >
                <UserPlus className="size-3 sm:size-3.5 shrink-0" />
                <span className="truncate">User Onboarding</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRutaalManagementOpen(true)}
                className="flex-1 gap-1 sm:gap-1.5 border-rutaal-navy/20 bg-white text-[11px] sm:text-xs hover:bg-[#f5f3ed] min-h-[44px]"
              >
                <Headphones className="size-3 sm:size-3.5 shrink-0" />
                <span className="truncate">Rutaal Mgmt</span>
              </Button>
            </div>
            <div className="rounded-lg border border-rutaal-navy/10 bg-white p-4">
              <WeeklyChart />
            </div>
            <div className="rounded-lg border border-rutaal-navy/10 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[#323030]/70">
                    <Trophy className="size-4 text-rutaal-yellow" />
                    Top Borrower
                  </h3>
                  {topBorrower ? (
                    <>
                      <div className="text-base font-semibold text-[#323030]">{topBorrower.borrowerName}</div>
                      <div className="mt-0.5 text-sm text-[#323030]/60">On Track</div>
                      <div className="mt-1 font-mono text-lg font-semibold text-rutaal-green">
                        ${topBorrower.amount}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-[#323030]/50">No data yet</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-mono text-xl font-semibold tabular-nums text-[#323030]">
                    {format(now, "HH:mm")}
                  </div>
                  <div className="text-xs text-[#323030]/60">
                    {format(now, "EEE, MMM d")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserOnboardingModal open={userOnboardingOpen} onOpenChange={setUserOnboardingOpen} />
      <RutaalManagementContact open={rutaalManagementOpen} onOpenChange={setRutaalManagementOpen} />

      <Dialog open={!!collectionPopup} onOpenChange={(open) => !open && setCollectionPopup(null)}>
        <DialogContent className="border-rutaal-navy/20 bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rutaal-green">
              <UserRound className="size-5" />
              Customer Arriving
            </DialogTitle>
            <DialogDescription className="text-[#323030]/80 pt-2">
              {collectionPopup ? (
                <>
                  <span className="text-[#323030] font-semibold">
                    {collectionPopup.borrowerName}
                  </span>{" "}
                  is coming to collect the loan amount.
                  <span className="block mt-2 text-rutaal-green font-mono font-semibold">
                    ${collectionPopup.amount} loan
                  </span>
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

