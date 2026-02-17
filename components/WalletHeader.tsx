"use client";

import { useAgentStore } from "@/lib/store";
import { useEffect, useRef, useState } from "react";
import { MapPin, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EMERGENCY_CONTACTS = [
  { label: "Police / Emergency", number: "911", tel: "tel:911" },
  { label: "Local security", number: "066", tel: "tel:066" },
];

export function WalletHeader() {
  const wallet = useAgentStore((s) => s.wallet);
  const [prevWallet, setPrevWallet] = useState(wallet);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  // Update previous wallet values after render
  useEffect(() => {
    setPrevWallet(wallet);
  }, [wallet]);

  return (
    <header className="relative flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950/80 px-6 py-4 pr-44 sm:pr-52">
      {/* Rutaal logo – top right, larger than agent name */}
      <div className="absolute right-6 top-4 text-right">
        <div className="font-mono text-2xl font-bold tracking-tight text-rutaal-green sm:text-3xl">
          RUTAAL
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 sm:text-xs">
          Agent Dashboard
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-lg font-semibold text-white">Don Roberto</h1>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <MapPin className="size-3.5" />
            Oaxaca, MX
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-rutaal-green opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-rutaal-green" />
          </span>
          <span className="text-xs font-medium text-rutaal-green">Online</span>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setEmergencyOpen(true)}
          className="gap-2 bg-rutaal-red hover:bg-rutaal-red/90 font-semibold"
        >
          <ShieldAlert className="size-4" />
          Emergency
        </Button>
      </div>

      <div className="flex gap-6">
        <StatCard
          label="Cash Deployed"
          value={wallet.cashDeployed}
          prevValue={prevWallet.cashDeployed}
          prefix="$"
        />
        <StatCard
          label="Fees This Month"
          value={wallet.feesEarned}
          prevValue={prevWallet.feesEarned}
          prefix="$"
        />
        <StatCard
          label="Active Loans"
          value={wallet.activeCount}
          prevValue={prevWallet.activeCount}
        />
        <StatCard
          label="Repayment Rate"
          value={wallet.repaymentRate}
          prevValue={prevWallet.repaymentRate}
          suffix="%"
        />
      </div>

      <Dialog open={emergencyOpen} onOpenChange={setEmergencyOpen}>
        <DialogContent className="border-zinc-800 bg-zinc-950 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rutaal-red">
              <ShieldAlert className="size-5" />
              Emergency
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Tap a number to call. Use for police or security.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            {EMERGENCY_CONTACTS.map(({ label, number, tel }) => (
              <a
                key={tel}
                href={tel}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-left transition-colors hover:bg-zinc-800 hover:border-rutaal-red/50"
              >
                <span className="font-medium text-white">{label}</span>
                <span className="font-mono text-lg font-semibold text-rutaal-red">
                  {number}
                </span>
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

function StatCard({
  label,
  value,
  prevValue,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value: number;
  prevValue: number;
  prefix?: string;
  suffix?: string;
}) {
  const [isFlashing, setIsFlashing] = useState(false);
  const prevRef = useRef(prevValue);

  useEffect(() => {
    if (value !== prevRef.current) {
      prevRef.current = value;
      // Schedule state update in next tick to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 400);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [value]);

  return (
    <div className="min-w-[120px] rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2">
      <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div
        className={`font-mono text-2xl font-semibold tabular-nums transition-all ${
          isFlashing ? "animate-stat-flash text-rutaal-yellow" : "text-white"
        }`}
      >
        {prefix}
        {typeof value === "number" && value % 1 !== 0 ? value.toFixed(1) : value}
        {suffix}
      </div>
    </div>
  );
}

