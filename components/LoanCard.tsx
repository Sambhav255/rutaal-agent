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

const PLACEHOLDER_TIME = "20:00"; // Stable placeholder to avoid hydration mismatch (Date.now differs server vs client)

export function LoanCard({
  loan,
  isNew,
  isRejecting,
  onRejectStart,
}: LoanCardProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const reject = useAgentStore((s) => s.reject);
  const expireRequest = useAgentStore((s) => s.expireRequest);
  const expiredRef = useRef(false);

  useEffect(() => {
    setTimeLeft(loan.expiresAt.getTime() - Date.now());
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

  const minutesLeft = timeLeft !== null ? Math.floor(timeLeft / 60000) : 20;
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
          "rounded-lg border border-rutaal-navy/10 bg-white p-4 transition-all duration-300",
          isNew && "animate-slide-in-top border-rutaal-green/50",
          isRejecting && "animate-slide-out-right opacity-0",
          isCritical && "animate-red-pulse border-rutaal-red"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-base font-semibold text-[#323030]">{loan.borrowerName}</div>
            <div className="text-sm text-[#323030]/60">{loan.phone}</div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Banknote className="size-4 text-rutaal-yellow" />
              <span className="font-mono text-lg font-semibold text-[#323030]">
                ${loan.amount}
              </span>
            </div>
            <div className="mt-2">
              <div className="mb-0.5 flex justify-between text-xs">
                <span className="text-[#323030]/60">Credit Score</span>
                <span className="font-mono font-medium text-[#323030]/80">{loan.creditScore}</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-[#f5f3ed]">
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
          <div className="flex flex-col items-end gap-1.5">
            <div className="text-[10px] font-medium text-[#323030]/60 uppercase tracking-wider">
              Time left
            </div>
            <div
              className={cn(
                "font-mono text-base font-semibold tabular-nums",
                isCritical && "text-rutaal-red",
                isUrgent && !isCritical && "text-rutaal-yellow",
                !isUrgent && "text-[#323030]/80"
              )}
            >
              {timeLeft === null ? PLACEHOLDER_TIME : formatTime(timeLeft)}
            </div>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                className="h-7 px-2.5 text-xs bg-rutaal-green hover:bg-rutaal-green/90"
                onClick={() => setModalOpen(true)}
              >
                Disburse
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleReject}
                className="h-7 gap-1 px-2.5 text-xs"
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
