"use client";

import { useAgentStore } from "@/lib/store";
import type { ActiveLoan } from "@/lib/seed-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function getRepaymentStatus(nextDue: Date): ActiveLoan["status"] {
  const daysUntilDue = Math.ceil(
    (nextDue.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
  );
  if (daysUntilDue < 0) return "overdue";
  if (daysUntilDue <= 7) return "due_soon";
  return "on_track";
}

const STATUS_CONFIG = {
  on_track: {
    label: "On Track",
    className: "bg-rutaal-green/20 text-rutaal-green border-rutaal-green/30",
  },
  due_soon: {
    label: "Due Soon",
    className: "bg-rutaal-yellow/20 text-rutaal-yellow border-rutaal-yellow/30",
  },
  overdue: {
    label: "Overdue",
    className: "bg-rutaal-red/20 text-rutaal-red border-rutaal-red/30",
  },
} as const;

export function RepaymentTable() {
  const activeLoans = useAgentStore((s) => s.activeLoans);
  // Calculate one minute ago timestamp once on mount
  const [oneMinuteAgo] = useState(() => Date.now() - 60000);

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Borrower
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Amount
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Total Repayable
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Monthly Payment
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Next Due
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {activeLoans.map((loan, index) => (
              <RepaymentRow
                key={loan.id}
                loan={loan}
                isNew={index === 0 && loan.disbursedAt.getTime() > oneMinuteAgo}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RepaymentRow({ loan, isNew }: { loan: ActiveLoan; isNew?: boolean }) {
  const status = getRepaymentStatus(loan.nextDue);
  const config = STATUS_CONFIG[status];

  return (
    <tr
      className={cn(
        "border-b border-zinc-800/80 transition-colors hover:bg-zinc-900/50",
        isNew && "animate-fade-in bg-rutaal-green/5"
      )}
    >
      <td className="px-4 py-3 font-medium text-white">{loan.borrowerName}</td>
      <td className="px-4 py-3 text-right font-mono text-zinc-300">
        ${loan.amount}
      </td>
      <td className="px-4 py-3 text-right font-mono text-zinc-300">
        ${loan.totalRepayable}
      </td>
      <td className="px-4 py-3 text-right font-mono text-zinc-300">
        ${loan.monthlyPayment}
      </td>
      <td className="px-4 py-3 text-right font-mono text-zinc-400">
        {format(loan.nextDue, "MMM d, yyyy")}
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex rounded-md border px-2 py-0.5 text-xs font-medium",
            config.className
          )}
        >
          {config.label}
        </span>
      </td>
    </tr>
  );
}
