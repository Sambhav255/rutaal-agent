"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { toast } from "sonner";

interface InventoryPayableOffsetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InventoryPayableOffset({ open, onOpenChange }: InventoryPayableOffsetProps) {
  const [supplierName, setSupplierName] = useState("");
  const [amount, setAmount] = useState("");
  const [invoiceRef, setInvoiceRef] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    const amt = parseFloat(amount);
    if (!supplierName.trim() || !amount || isNaN(amt) || amt <= 0) {
      toast.error("Please fill in supplier name and a valid amount.");
      return;
    }
    setSubmitting(true);
    // Simulate request to admin
    setTimeout(() => {
      toast.success("Request sent to Ruta'al admin", {
        description: `Supplier payment of $${amt} for ${supplierName} will be processed. Cash will be supplied to your location.`,
      });
      setSupplierName("");
      setAmount("");
      setInvoiceRef("");
      setSubmitting(false);
      onOpenChange(false);
    }, 800);
  };

  const handleClose = () => {
    setSupplierName("");
    setAmount("");
    setInvoiceRef("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-rutaal-navy/20 bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rutaal-navy">
            <Package className="size-5" />
            Inventory Payable Offset
          </DialogTitle>
          <DialogDescription className="text-[#323030]/80 pt-1">
            Request Ruta&apos;al admin to pay your supplier directly. We supply cash to your
            location for better flow—you get inventory, we handle the payment.
          </DialogDescription>
        </DialogHeader>

        <p className="rounded-md bg-[#f5f3ed] px-3 py-2 text-xs text-[#323030]/60 border border-rutaal-navy/10">
          Demo—request is simulated; data is not persisted.
        </p>

        <div className="space-y-4 py-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#323030]/70">
              Supplier Name
            </label>
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="e.g. ABC Wholesale"
              className="w-full rounded-md border border-rutaal-navy/20 bg-white px-3 py-2 text-sm text-[#323030] placeholder:text-[#323030]/40 focus:border-rutaal-navy/50 focus:outline-none focus:ring-1 focus:ring-rutaal-navy/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#323030]/70">
              Amount ($)
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 500"
              className="w-full rounded-md border border-rutaal-navy/20 bg-white px-3 py-2 text-sm text-[#323030] placeholder:text-[#323030]/40 focus:border-rutaal-navy/50 focus:outline-none focus:ring-1 focus:ring-rutaal-navy/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#323030]/70">
              Invoice / Reference (optional)
            </label>
            <input
              type="text"
              value={invoiceRef}
              onChange={(e) => setInvoiceRef(e.target.value)}
              placeholder="e.g. INV-2024-001"
              className="w-full rounded-md border border-rutaal-navy/20 bg-white px-3 py-2 text-sm text-[#323030] placeholder:text-[#323030]/40 focus:border-rutaal-navy/50 focus:outline-none focus:ring-1 focus:ring-rutaal-navy/30"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-rutaal-green hover:bg-rutaal-green/90"
          >
            {submitting ? "Sending…" : "Request Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
