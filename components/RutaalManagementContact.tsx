"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Headphones, Mail, Phone } from "lucide-react";

interface RutaalManagementContactProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CONTACT_OPTIONS = [
  {
    icon: Phone,
    label: "Call Support",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: Mail,
    label: "Email Management",
    value: "management@rutaal.com",
    href: "mailto:management@rutaal.com",
  },
  {
    icon: Headphones,
    label: "Agent Helpline",
    value: "1-800-RUTAAL",
    href: "tel:1800788225",
  },
];

export function RutaalManagementContact({ open, onOpenChange }: RutaalManagementContactProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-rutaal-navy/20 bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rutaal-navy">
            <Headphones className="size-5" />
            Reach Ruta&apos;al Management
          </DialogTitle>
          <DialogDescription className="text-[#323030]/80 pt-1">
            Contact our team for support, questions, or escalations.
          </DialogDescription>
        </DialogHeader>

        <p className="rounded-md bg-rutaal-yellow/20 px-3 py-2 text-xs text-[#323030]/80 border border-rutaal-yellow/40">
          Demo placeholder—replace with real contact info before launch.
        </p>

        <div className="grid gap-3 py-4">
          {CONTACT_OPTIONS.map(({ icon: Icon, label, value, href }) => (
            <a
              key={href}
              href={href}
              className="flex items-center justify-between rounded-lg border border-rutaal-navy/20 bg-[#f5f3ed] px-4 py-3 transition-colors hover:border-rutaal-navy/40 hover:bg-[#ebe9e3]"
            >
              <div className="flex items-center gap-3">
                <Icon className="size-4 text-rutaal-navy" />
                <span className="text-sm font-medium text-[#323030]">{label}</span>
              </div>
              <span className="font-mono text-sm font-semibold text-rutaal-green">{value}</span>
            </a>
          ))}
        </div>

        <p className="text-xs text-[#323030]/50">
          For urgent matters, use the Emergency button in the header.
        </p>
      </DialogContent>
    </Dialog>
  );
}
