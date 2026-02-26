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
    <div className="overflow-hidden rounded-lg border border-rutaal-navy/10 bg-white">
      <div className="overflow-x-auto overflow-x-scroll-touch">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="border-b border-rutaal-navy/10 bg-[#faf9f7]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#323030]/70">
                Borrower
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#323030]/70">
                Amount
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#323030]/70">
                Total Repayable
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#323030]/70">
                Monthly Payment
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#323030]/70">
                Next Due
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#323030]/70">
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
        "border-b border-rutaal-navy/10 transition-colors hover:bg-[#faf9f7]",
        isNew && "animate-fade-in bg-rutaal-green/5"
      )}
    >
      <td className="px-4 py-3 font-medium text-[#323030]">{loan.borrowerName}</td>
      <td className="px-4 py-3 text-right font-mono text-[#323030]/90">
        ${loan.amount}
      </td>
      <td className="px-4 py-3 text-right font-mono text-[#323030]/90">
        ${loan.totalRepayable}
      </td>
      <td className="px-4 py-3 text-right font-mono text-[#323030]/90">
        ${loan.monthlyPayment}
      </td>
      <td className="px-4 py-3 text-right font-mono text-[#323030]/80">
        {format(loan.nextDue, "MMM d, yyyy")}
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex rounded px-2 py-0.5 text-xs font-medium",
            config.className
          )}
        >
          {config.label}
        </span>
      </td>
    </tr>
  );
}
