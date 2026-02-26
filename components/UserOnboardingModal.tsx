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
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

interface UserOnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserOnboardingModal({ open, onOpenChange }: UserOnboardingModalProps) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    idNumber: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!form.fullName.trim() || !form.phone.trim()) {
      toast.error("Please fill in at least name and phone.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Profile created", {
        description: `${form.fullName} has been onboarded. They can now use *777# to access Ruta'al.`,
      });
      setForm({ fullName: "", phone: "", idNumber: "", address: "", notes: "" });
      setSubmitting(false);
      onOpenChange(false);
    }, 600);
  };

  const handleClose = () => {
    setForm({ fullName: "", phone: "", idNumber: "", address: "", notes: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-rutaal-navy/20 bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rutaal-navy">
            <UserPlus className="size-5" />
            User Onboarding
          </DialogTitle>
          <DialogDescription className="text-[#323030]/80 pt-1">
            Create a new customer profile. They can then use USSD *777# to access
            Ruta&apos;al services.
          </DialogDescription>
        </DialogHeader>

        <p className="rounded-md bg-[#f5f3ed] px-3 py-2 text-xs text-[#323030]/60 border border-rutaal-navy/10">
          Demo—data is not persisted.
        </p>

        <div className="space-y-4 py-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#323030]/70">
              Full Name *
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              placeholder="e.g. Sambhav Lamichhane"
              className="w-full rounded-md border border-rutaal-navy/20 bg-white px-3 py-2 text-sm text-[#323030] placeholder:text-[#323030]/40 focus:border-rutaal-navy/50 focus:outline-none focus:ring-1 focus:ring-rutaal-navy/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#323030]/70">
              Phone Number *
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="e.g. +977 981205543"
              className="w-full rounded-md border border-rutaal-navy/20 bg-white px-3 py-2 text-sm text-[#323030] placeholder:text-[#323030]/40 focus:border-rutaal-navy/50 focus:outline-none focus:ring-1 focus:ring-rutaal-navy/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#323030]/70">
              ID Number
            </label>
            <input
              type="text"
              value={form.idNumber}
              onChange={(e) => setForm((f) => ({ ...f, idNumber: e.target.value }))}
              placeholder="Government ID or passport"
              className="w-full rounded-md border border-rutaal-navy/20 bg-white px-3 py-2 text-sm text-[#323030] placeholder:text-[#323030]/40 focus:border-rutaal-navy/50 focus:outline-none focus:ring-1 focus:ring-rutaal-navy/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#323030]/70">
              Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="Location or address"
              className="w-full rounded-md border border-rutaal-navy/20 bg-white px-3 py-2 text-sm text-[#323030] placeholder:text-[#323030]/40 focus:border-rutaal-navy/50 focus:outline-none focus:ring-1 focus:ring-rutaal-navy/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#323030]/70">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Optional notes"
              rows={2}
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
            {submitting ? "Creating…" : "Create Profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
