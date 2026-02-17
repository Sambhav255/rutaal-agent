"use client";

import { useState } from "react";
import type { LoanRequest } from "@/lib/seed-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAgentStore } from "@/lib/store";

interface DisbursementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: LoanRequest;
  onConfirm: () => void;
}

const CHECKBOXES = [
  { id: "id", label: "Government ID verified" },
  { id: "cash", label: "Cash amount counted" },
  { id: "ack", label: "Borrower acknowledgment signed" },
] as const;

export function DisbursementModal({
  open,
  onOpenChange,
  loan,
  onConfirm,
}: DisbursementModalProps) {
  const [checks, setChecks] = useState({ id: false, cash: false, ack: false });
  const confirmDisbursement = useAgentStore((s) => s.confirmDisbursement);

  const allChecked = checks.id && checks.cash && checks.ack;

  const handleConfirm = () => {
    confirmDisbursement(loan.id, loan);
    setChecks({ id: false, cash: false, ack: false });
    onConfirm();
    onOpenChange(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setChecks({ id: false, cash: false, ack: false });
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-zinc-800 bg-zinc-950 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            Confirm Disbursement
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Verify all steps before disbursing to {loan.borrowerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Borrower</span>
                <span className="font-medium text-white">{loan.borrowerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Phone</span>
                <span className="font-mono text-zinc-300">{loan.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Amount</span>
                <span className="font-mono font-semibold text-rutaal-green">
                  ${loan.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Credit Score</span>
                <span className="font-mono text-zinc-300">{loan.creditScore}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-300">
              Pre-disbursement checklist
            </p>
            {CHECKBOXES.map(({ id, label }) => (
              <div
                key={id}
                className="flex items-center space-x-2 rounded-md border border-zinc-800 px-3 py-2"
              >
                <Checkbox
                  id={id}
                  checked={checks[id]}
                  onCheckedChange={(checked) =>
                    setChecks((c) => ({ ...c, [id]: !!checked }))
                  }
                />
                <label
                  htmlFor={id}
                  className="cursor-pointer text-sm text-zinc-300"
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!allChecked}
            className="bg-rutaal-green hover:bg-rutaal-green/90 disabled:opacity-50"
          >
            Confirm Disbursement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
