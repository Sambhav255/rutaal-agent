"use client";

import Link from "next/link";
import Image from "next/image";
import { useAgentStore } from "@/lib/store";
import { useEffect, useRef, useState } from "react";
import { MapPin, Package, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventoryPayableOffset } from "@/components/InventoryPayableOffset";
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
  const [inventoryOffsetOpen, setInventoryOffsetOpen] = useState(false);

  // Update previous wallet values after render
  useEffect(() => {
    setPrevWallet(wallet);
  }, [wallet]);

  return (
    <header className="border-b border-rutaal-navy/10 bg-white sticky top-0 z-20">
      {/* Top row: logo (back) + title */}
      <div className="relative flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 gap-2">
        <Link
          href="/"
          className="flex items-center transition-opacity hover:opacity-80 shrink-0 min-h-[44px] min-w-[44px] items-center"
          title="Back to landing page"
        >
          <Image
            src="/RUTA_AL_Logo.png"
            alt="Ruta'al - Back to landing page"
            width={180}
            height={65}
            className="h-10 w-auto sm:h-14"
          />
        </Link>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#323030]/80 truncate max-w-[40%]">
          Agent Dashboard
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInventoryOffsetOpen(true)}
          className="h-8 sm:h-8 gap-1 border-rutaal-navy/20 bg-white px-2 sm:px-3 text-[10px] sm:text-xs hover:bg-[#f5f3ed] hover:border-rutaal-navy/40 shrink-0 min-h-[44px]"
        >
          <Package className="size-3 sm:size-3.5 shrink-0" />
          <span className="hidden sm:inline">Inventory Payable Offset</span>
          <span className="sm:hidden">Offset</span>
        </Button>
      </div>

      {/* Main row: identity + stats */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-3 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-base font-semibold text-[#323030]">Juan&apos;s Pharmacy</h1>
            <div className="flex items-center gap-2 text-xs text-[#323030]/50">
              <MapPin className="size-3" />
              Agent Location
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-rutaal-green opacity-60" />
              <span className="relative size-2 rounded-full bg-rutaal-green" />
            </span>
            <span className="text-xs font-medium text-rutaal-green">Online</span>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setEmergencyOpen(true)}
            className="h-7 gap-1.5 px-2.5 text-xs bg-rutaal-red-deep hover:bg-rutaal-red-deep/90 text-white"
          >
            <ShieldAlert className="size-3.5" />
            Emergency
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4">
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
      </div>

      <Dialog open={emergencyOpen} onOpenChange={setEmergencyOpen}>
        <DialogContent className="border-rutaal-navy/20 bg-white sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rutaal-red">
              <ShieldAlert className="size-5" />
              Emergency
            </DialogTitle>
            <DialogDescription className="text-[#323030]/70">
              Tap a number to call. Use for police or security. Update numbers for your region.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            {EMERGENCY_CONTACTS.map(({ label, number, tel }) => (
              <a
                key={tel}
                href={tel}
                className="flex items-center justify-between rounded-lg border border-rutaal-navy/20 bg-[#f5f3ed] px-4 py-3 text-left transition-colors hover:bg-[#ebe9e3] hover:border-rutaal-red/50"
              >
                <span className="font-medium text-[#323030]">{label}</span>
                <span className="font-mono text-lg font-semibold text-rutaal-red">
                  {number}
                </span>
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <InventoryPayableOffset open={inventoryOffsetOpen} onOpenChange={setInventoryOffsetOpen} />
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
    <div className="min-w-[70px] sm:min-w-[90px] rounded-md border border-rutaal-navy/10 bg-[#f5f3ed]/60 px-2 sm:px-3 py-1.5">
      <div className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-[#323030]/50">
        {label}
      </div>
      <div
        className={`font-mono text-base sm:text-lg font-semibold tabular-nums transition-all ${
          isFlashing ? "animate-stat-flash text-rutaal-yellow" : "text-[#323030]"
        }`}
      >
        {prefix}
        {typeof value === "number" && value % 1 !== 0 ? value.toFixed(1) : value}
        {suffix}
      </div>
    </div>
  );
}

