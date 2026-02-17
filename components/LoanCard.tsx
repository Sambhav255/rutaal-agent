"use client";

import { useState, useEffect, useRef } from "react";
import type { LoanRequest } from "@/lib/seed-data";
import { Button } from "@/components/ui/button";
import { DisbursementModal } from "./DisbursementModal";
import { useAgentStore } from "@/lib/store";
import { toast } from "sonner";
import { Banknote, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoanCardProps {
  loan: LoanRequest;
  isNew?: boolean;
  isRejecting?: boolean;
  onRejectStart?: (id: string) => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function getCreditScoreColor(score: number): string {
  if (score >= 70) return "bg-rutaal-green";
  if (score >= 55) return "bg-rutaal-yellow";
  return "bg-rutaal-red";
}

export function LoanCard({
  loan,
  isNew,
  isRejecting,
  onRejectStart,
}: LoanCardProps) {
  const [timeLeft, setTimeLeft] = useState(
    loan.expiresAt.getTime() - Date.now()
  );
  const [modalOpen, setModalOpen] = useState(false);
  const reject = useAgentStore((s) => s.reject);
  const expireRequest = useAgentStore((s) => s.expireRequest);
  const expiredRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = loan.expiresAt.getTime() - Date.now();
      setTimeLeft(remaining);
      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        expireRequest(loan.id);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [loan.expiresAt, loan.id, expireRequest]);

  const minutesLeft = Math.floor(timeLeft / 60000);
  const isUrgent = minutesLeft < 5;
  const isCritical = minutesLeft < 2;

  const handleReject = () => {
    onRejectStart?.(loan.id);
    setTimeout(() => {
      reject(loan.id);
      onRejectStart?.("");
      toast.error(`Loan request from ${loan.borrowerName} rejected`);
    }, 300);
  };

  const handleDisbursed = () => {
    setModalOpen(false);
    toast.success(`Loan disbursed to ${loan.borrowerName}`);
  };

  return (
    <>
      <div
        className={cn(
          "rounded-lg border bg-zinc-900/80 p-4 transition-all duration-300",
          isNew && "animate-slide-in-top border-rutaal-green/50",
          isRejecting && "animate-slide-out-right opacity-0",
          isCritical && "animate-red-pulse border-rutaal-red"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="font-medium text-white">{loan.borrowerName}</div>
            <div className="text-sm text-zinc-400">{loan.phone}</div>
            <div className="mt-2 flex items-center gap-2">
              <Banknote className="size-4 text-rutaal-yellow" />
              <span className="font-mono text-lg font-semibold text-white">
                ${loan.amount}
              </span>
            </div>
            <div className="mt-2">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-zinc-500">Credit Score</span>
                <span className="font-mono text-zinc-300">{loan.creditScore}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    getCreditScoreColor(loan.creditScore)
                  )}
                  style={{ width: `${loan.creditScore}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div
              className={cn(
                "font-mono text-xl font-bold tabular-nums",
                isCritical && "text-rutaal-red",
                isUrgent && !isCritical && "text-rutaal-yellow",
                !isUrgent && "text-zinc-300"
              )}
            >
              {formatTime(timeLeft)}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-rutaal-green hover:bg-rutaal-green/90"
                onClick={() => setModalOpen(true)}
              >
                Disburse
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleReject}
                className="gap-1"
              >
                <X className="size-3.5" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      </div>

      <DisbursementModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        loan={loan}
        onConfirm={handleDisbursed}
      />
    </>
  );
}
