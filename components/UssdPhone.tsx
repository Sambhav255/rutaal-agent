"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ShieldCheck, Signal, Wifi, Battery, Phone, PhoneOff } from "lucide-react";

type Scene =
  | "locked"
  | "dialer"
  | "loading"
  | "pin"
  | "menu_main"
  | "balance"
  | "history"
  | "find_agent"
  | "pay_bills"
  | "send_phone"
  | "send_confirm_name"
  | "send_amount"
  | "send_confirm_tx"
  | "send_success"
  | "menu_loan"
  | "loan_amount"
  | "loan_duration"
  | "loan_confirm"
  | "loan_success";

const MAGIC_PIN = "2580";
const MAGIC_LOAN_AMT = "250";
const LOAN_DURATIONS = [3, 6, 8, 12] as const; // months
const APR = 0.36;
const PROCESSING_FEE_RATE = 0.02;
const MAGIC_SEND_AMT = "50";
const MAGIC_PHONE = "981205543";

function calcLoanDetails(amount: number, months: number) {
  const processingFee = Math.round(amount * PROCESSING_FEE_RATE);
  const interest = Math.round(amount * (months / 12) * APR);
  const totalRepay = amount + interest + processingFee;
  const monthlyPayment = Math.round((totalRepay / months) * 100) / 100;
  return { processingFee, interest, totalRepay, monthlyPayment };
}

export function UssdPhone() {
  const [scene, setScene] = useState<Scene>("locked");
  const [input, setInput] = useState("");
  const [magicIndex, setMagicIndex] = useState(0);
  const [showSms, setShowSms] = useState(false);
  const [loanAmount, setLoanAmount] = useState(250);
  const [loanDuration, setLoanDuration] = useState<number>(6);

  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel("rutaal-demo");
    } catch {
      channelRef.current = null;
    }
    return () => {
      channelRef.current?.close();
    };
  }, []);

  function notifyAgent(type: "send_money_success" | "loan_approved") {
    const ch = channelRef.current;
    if (!ch) return;
    try {
      ch.postMessage({
        source: "rutaal-user",
        type,
        payload:
          type === "send_money_success"
            ? { amount: MAGIC_SEND_AMT, phone: MAGIC_PHONE }
            : { amount: String(loanAmount), duration: loanDuration, phone: MAGIC_PHONE, borrowerName: "Sambhav Lamichhane" },
        timestamp: Date.now(),
      });
    } catch {
      // ignore
    }
  }

  function startLoading(next: Scene, delay: number) {
    setScene("loading");
    setInput("");
    setMagicIndex(0);
    window.setTimeout(() => {
      setScene(next);
      setInput("");
      setMagicIndex(0);
      if (next === "send_success") {
        notifyAgent("send_money_success");
        setTimeout(() => {
          setShowSms(true);
          setTimeout(() => setShowSms(false), 4000);
        }, 1500);
      } else if (next === "loan_success") {
        notifyAgent("loan_approved");
      }
    }, delay);
  }

  function unlock() {
    setScene("dialer");
    setInput("*777#");
  }

  function handleKey(k: string) {
    if (scene === "locked") {
      unlock();
      return;
    }

    if (k === "1") {
      const toMenu: Scene[] = [
        "balance",
        "history",
        "find_agent",
        "pay_bills",
        "send_success",
        "loan_success",
      ];
      if (toMenu.includes(scene)) {
        startLoading("menu_main", 300);
        return;
      }
    }

    if (scene === "menu_loan" && k === "2") {
      startLoading("menu_main", 300);
      return;
    }
    if (scene === "send_confirm_name" && k === "2") {
      startLoading("menu_main", 300);
      return;
    }
    if (scene === "send_confirm_tx" && k === "2") {
      startLoading("menu_main", 300);
      return;
    }
    if (scene === "loan_confirm" && k === "2") {
      startLoading("menu_main", 300);
      return;
    }
    if (scene === "loan_duration" && ["1", "2", "3", "4"].includes(k)) {
      setInput(k);
      return;
    }

    if (scene === "send_phone") {
      setInput(MAGIC_PHONE);
      return;
    }

    if (scene === "pin" && magicIndex < MAGIC_PIN.length) {
      setInput((prev) => prev + MAGIC_PIN[magicIndex]);
      setMagicIndex((m) => m + 1);
      return;
    }
    if (scene === "send_amount" && magicIndex < MAGIC_SEND_AMT.length) {
      setInput((prev) => prev + MAGIC_SEND_AMT[magicIndex]);
      setMagicIndex((m) => m + 1);
      return;
    }
    if (scene === "loan_amount" && magicIndex < MAGIC_LOAN_AMT.length) {
      setInput((prev) => prev + MAGIC_LOAN_AMT[magicIndex]);
      setMagicIndex((m) => m + 1);
      return;
    }

    const canTypeScenes: Scene[] = [
      "dialer",
      "menu_main",
      "menu_loan",
      "loan_confirm",
      "send_confirm_name",
      "send_confirm_tx",
    ];
    if (canTypeScenes.includes(scene)) {
      setInput((prev) => prev + k);
    }
  }

  function handleCall() {
    if (scene === "dialer") {
      startLoading("pin", 500);
    } else if (scene === "pin") {
      startLoading("menu_main", 800);
    } else if (scene === "menu_main") {
      if (input.includes("1")) startLoading("balance", 400);
      else if (input.includes("2")) startLoading("send_phone", 400);
      else if (input.includes("3")) startLoading("menu_loan", 500);
      else if (input.includes("4")) startLoading("history", 400);
      else if (input.includes("5")) startLoading("find_agent", 400);
      else if (input.includes("6")) startLoading("pay_bills", 400);
    } else if (scene === "send_phone") {
      startLoading("send_confirm_name", 400);
    } else if (scene === "send_confirm_name" && input.includes("1")) {
      startLoading("send_amount", 400);
    } else if (scene === "send_amount") {
      startLoading("send_confirm_tx", 400);
    } else if (scene === "send_confirm_tx" && input.includes("1")) {
      startLoading("send_success", 1000);
    } else if (scene === "menu_loan" && input.includes("1")) {
      setScene("loan_amount");
      setInput("");
      setMagicIndex(0);
    } else if (scene === "loan_amount") {
      const amt = parseInt(input, 10) || 250;
      const clamped = Math.min(500, Math.max(50, amt));
      setLoanAmount(clamped);
      setScene("loan_duration");
      setInput("");
    } else if (scene === "loan_duration" && ["1", "2", "3", "4"].includes(input)) {
      const months = LOAN_DURATIONS[parseInt(input, 10) - 1];
      setLoanDuration(months);
      startLoading("loan_confirm", 500);
    } else if (scene === "loan_confirm" && input.includes("1")) {
      startLoading("loan_success", 1200);
    }
  }

  function handleBack() {
    const toMenu: Scene[] = [
      "balance",
      "history",
      "menu_loan",
      "send_phone",
      "send_success",
      "loan_success",
      "find_agent",
      "pay_bills",
    ];
    if (toMenu.includes(scene)) {
      setScene("menu_main");
      setInput("");
      return;
    }
    if (scene === "send_confirm_name") {
      setScene("send_phone");
      setInput("");
      setMagicIndex(0);
      return;
    }
    if (scene === "send_amount") {
      setScene("send_confirm_name");
      setInput("");
      return;
    }
    if (scene === "send_confirm_tx") {
      setScene("send_amount");
      setInput("");
      return;
    }
    if (scene === "loan_amount") {
      setScene("menu_loan");
      setInput("");
      return;
    }
    if (scene === "loan_duration") {
      setScene("loan_amount");
      setInput("");
      return;
    }
    if (scene === "loan_confirm") {
      setScene("loan_duration");
      setInput("");
      return;
    }
    if (input.length > 0) {
      setInput((prev) => prev.slice(0, -1));
      if (["pin", "send_amount", "loan_amount"].includes(scene)) {
        setMagicIndex((m) => Math.max(0, m - 1));
      }
    }
  }

  function handleMenu() {
    if (scene === "locked") {
      unlock();
      return;
    }
    if (scene === "dialer") {
      startLoading("menu_main", 500);
      return;
    }
    // From any other screen jump back to main menu
    if (scene !== "menu_main") {
      setScene("menu_main");
      setInput("");
      setMagicIndex(0);
    }
  }

  function resetDemo() {
    setScene("locked");
    setInput("");
    setMagicIndex(0);
    setShowSms(false);
    setLoanAmount(250);
    setLoanDuration(6);
  }

  const loadingMessage = useMemo(() => {
    const msgs = ["Connecting...", "Verifying...", "Processing..."];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }, [scene === "loading"]);

  return (
    <div className="flex items-center justify-center py-8">
      <div
        className="relative w-[400px] sm:w-[440px] rounded-[2.75rem] p-5 flex flex-col shadow-2xl"
        style={{
          height: "min(90vh, 760px)",
          background:
            "linear-gradient(180deg, #4b5563 0%, #374151 15%, #1f2937 60%, #111827 100%)",
          boxShadow:
            "0 25px 50px rgba(0,0,0,0.25), 0 10px 20px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-14 h-1 rounded-full bg-black/50" />
        <div className="text-center mt-1.5 mb-0.5 text-white/80 text-[11px] tracking-[0.25em] font-bold">
          NOKIA
        </div>

        <div className="relative w-full flex-[1.4] min-h-0 rounded-t-xl rounded-b-[1.75rem] p-2 border-2 border-black/80 shadow-inner bg-black/90 mt-1">
          <div
            className="relative flex h-full min-h-[400px] flex-col overflow-hidden rounded-t-lg rounded-b-[1.5rem]"
            style={{
              backgroundColor: "#ffffff",
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.02) 50%, transparent 50%)",
              backgroundSize: "100% 3px",
            }}
          >
            <div className="flex h-10 items-center justify-between bg-rutaal-navy px-4 text-white shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="font-sans font-bold tracking-wide text-[15px]">
                  USSD
                </span>
                <Signal className="w-4 h-4 opacity-80" />
                <Wifi className="w-4 h-4 opacity-80" />
              </div>
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {showSms && (
              <div className="absolute inset-x-0 top-9 z-20 border-b-4 border-rutaal-yellow bg-gray-800 px-3 py-2 text-xs text-white shadow-xl">
                <div className="text-[10px] font-semibold text-rutaal-yellow">
                  NEW SMS MESSAGE
                </div>
                <div className="mt-1 text-[11px] font-semibold">
                  Ruta&apos;al: Sent $50.00 to Hapaki Lorenzo.
                </div>
                <div className="mt-0.5 text-[10px] text-slate-400">TxID: 99281</div>
              </div>
            )}

            <div className="relative flex-1 overflow-y-auto px-5 py-4 text-base leading-snug text-gray-900">
              {scene === "locked" && (
                <button
                  onClick={unlock}
                  className="flex h-full w-full flex-col items-center justify-center text-center cursor-pointer"
                >
                  <div className="text-7xl font-bold text-rutaal-green mb-3">R</div>
                  <div className="text-3xl font-bold text-rutaal-navy tracking-tight">
                    RUTA&apos;AL
                  </div>
                  <div className="text-base text-slate-500 mt-4 font-semibold">
                    Banking Without Barriers
                  </div>
                  <div className="text-lg text-slate-600 mt-6 font-bold">
                    Press *777#
                  </div>
                </button>
              )}

              {scene === "dialer" && (
                <div className="flex h-full flex-col justify-end pb-6">
                  <div className="mb-4 text-center text-sm font-medium text-slate-400">
                    SIM1 - Ruta&apos;al
                  </div>
                  <div className="text-center text-4xl font-bold tracking-[0.2em] text-black">
                    {input}
                    <span className="ml-1 inline-block h-8 w-[3px] animate-pulse bg-slate-600" />
                  </div>
                </div>
              )}

              {scene === "loading" && (
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-rutaal-yellow border-t-transparent" />
                  <div className="text-sm font-semibold text-slate-700">{loadingMessage}</div>
                </div>
              )}

              {scene === "pin" && (
                <div className="space-y-4">
                  <div className="rounded-lg border-l-4 border-rutaal-navy bg-slate-50 px-3 py-2">
                    <div className="text-sm font-bold text-rutaal-navy">
                      Welcome, Sambhav
                    </div>
                  </div>
                  <div className="text-sm font-semibold">Enter PIN:</div>
                </div>
              )}

              {scene === "menu_main" && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-rutaal-green">
                    Ruta&apos;al Menu
                  </div>
                  <div className="space-y-2 text-sm font-semibold text-slate-800">
                    <div>1. Check Balance</div>
                    <div>2. Send Money</div>
                    <div>3. Apply for Loan</div>
                    <div>4. History</div>
                    <div>5. Find Agent</div>
                    <div>6. Pay Bills</div>
                  </div>
                </div>
              )}

              {scene === "balance" && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-rutaal-green px-3 py-2 text-sm font-bold text-white">
                    My Balance
                  </div>
                  <div className="mt-6 text-center">
                    <div className="text-4xl font-extrabold text-rutaal-green">
                      $450.00
                    </div>
                    <div className="mt-2 text-sm font-medium text-slate-500">Available</div>
                  </div>
                  <div className="rounded-lg border-l-4 border-rutaal-navy bg-sky-50 px-3 py-2 text-sm">
                    <span className="font-bold text-rutaal-green">
                      ↑ +$80 this week
                    </span>
                  </div>
                  <div className="border-t-2 border-slate-200 pt-3 text-sm font-semibold">
                    1. Main Menu
                  </div>
                </div>
              )}

              {scene === "history" && (
                <div className="space-y-3 text-[11px]">
                  <div className="rounded-md bg-slate-200 px-2 py-1.5 font-semibold">
                    History
                  </div>
                  <div className="rounded-md border-l-4 border-rutaal-navy bg-sky-50 px-2 py-1.5">
                    <div className="font-semibold text-rutaal-green">✓ Credit Builder</div>
                    <div>8 weeks active streak</div>
                  </div>
                  <div className="space-y-2">
                    <div className="border-b border-slate-300 pb-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Loan (Approved)</span>
                        <span className="font-semibold text-rutaal-green">
                          +$250.00
                        </span>
                      </div>
                      <div className="text-[10px] font-semibold text-orange-600">
                        Ready for Pickup
                      </div>
                    </div>
                    <div className="border-b border-slate-300 pb-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Sent to Hapaki</span>
                        <span className="font-semibold text-rutaal-red">-$50.00</span>
                      </div>
                      <div className="text-[10px] font-semibold text-slate-500">
                        Today, 12:01 PM
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-300 pt-1 text-[11px] font-semibold">
                    1. Main Menu
                  </div>
                </div>
              )}

              {scene === "find_agent" && (
                <div className="space-y-3 text-[11px]">
                  <div className="rounded-md bg-rutaal-navy px-2 py-1.5 font-semibold text-white">
                    Nearest Agents
                  </div>
                  <div className="space-y-2">
                    <div className="border-b border-slate-300 border-l-4 border-rutaal-green bg-white px-2 py-1.5">
                      <div className="font-semibold text-[13px]">Juan&apos;s Pharmacy</div>
                      <div className="text-[10px] font-semibold text-slate-500">
                        0.3 km • Open now
                      </div>
                      <div className="mt-1 text-[10px] font-semibold text-rutaal-green">
                        ✓ Cash available
                      </div>
                    </div>
                    <div className="border-b border-slate-300 border-l-4 border-slate-300 bg-white px-2 py-1.5">
                      <div className="font-semibold text-[13px]">Rosa&apos;s Store</div>
                      <div className="text-[10px] font-semibold text-slate-500">
                        0.8 km • Open now
                      </div>
                      <div className="mt-1 text-[10px] font-semibold text-rutaal-green">
                        ✓ Cash available
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-300 pt-1 text-[11px] font-semibold">
                    1. Main Menu
                  </div>
                </div>
              )}

              {scene === "pay_bills" && (
                <div className="space-y-3 text-[11px]">
                  <div className="rounded-md bg-rutaal-yellow px-2 py-1.5 font-semibold text-white">
                    Pay Bills
                  </div>
                  <div className="space-y-2">
                    <div className="border-l-4 border-rutaal-green bg-white px-2 py-1.5">
                      <div className="font-semibold text-[13px]">Electric Company</div>
                      <div className="text-[10px] font-semibold text-slate-500">
                        Due: Nov 25
                      </div>
                      <div className="mt-1 text-[13px] font-semibold">$45.00</div>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] font-semibold text-rutaal-green">
                    ✓ On-time payments build credit
                  </div>
                  <div className="border-t border-slate-300 pt-1 text-[11px] font-semibold">
                    1. Main Menu
                  </div>
                </div>
              )}

              {scene === "send_phone" && (
                <div className="space-y-3 text-[11px]">
                  <div className="rounded-md bg-rutaal-navy px-2 py-1.5 font-semibold text-white">
                    Send Money
                  </div>
                  <div className="text-xs font-semibold">Enter Phone Number:</div>
                  <div className="mt-2 text-[10px] font-semibold text-rutaal-green">
                    ✓ Secure Transfer
                  </div>
                </div>
              )}

              {scene === "send_confirm_name" && (
                <div className="space-y-3 text-[11px]">
                  <div className="rounded-md border-2 border-slate-300 bg-white px-2 py-1.5 text-center">
                    <div className="text-[10px] font-semibold uppercase text-slate-500">
                      Send to
                    </div>
                    <div className="text-[15px] font-extrabold text-rutaal-navy">
                      Hapaki Lorenzo
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600">{MAGIC_PHONE}</div>
                  </div>
                  <div className="text-[11px] font-semibold">1. Yes</div>
                  <div className="text-[11px] font-semibold text-slate-500">2. No (Cancel)</div>
                </div>
              )}

              {scene === "send_amount" && (
                <div className="space-y-3 text-[11px]">
                  <div className="rounded-md bg-rutaal-navy px-2 py-1.5 font-semibold text-white">
                    Send Money
                  </div>
                  <div className="text-xs font-semibold">Enter Amount:</div>
                  <div className="mt-1 text-[10px] font-semibold text-slate-500">
                    Receiver: Hapaki Lorenzo
                  </div>
                </div>
              )}

              {scene === "send_confirm_tx" && (
                <div className="space-y-3 text-[11px]">
                  <div className="rounded-md border-2 border-rutaal-yellow bg-yellow-50 px-2 py-1.5">
                    <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                      <span className="text-xs font-semibold">Amount:</span>
                      <span className="text-lg font-extrabold">${MAGIC_SEND_AMT}.00</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px] font-semibold text-slate-600">
                      <span>Service Fee (2%):</span>
                      <span>+$1.00</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between border-t border-slate-300 pt-1">
                      <span className="text-xs font-semibold">Total Deducted:</span>
                      <span className="text-lg font-extrabold text-rutaal-red">
                        $51.00
                      </span>
                    </div>
                  </div>
                  <div className="text-center text-[11px] font-semibold">
                    1. Confirm | 2. Cancel
                  </div>
                </div>
              )}

              {scene === "send_success" && (
                <div className="flex h-full flex-col items-center justify-center space-y-3 text-center text-[11px]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rutaal-navy text-white">
                    ✓
                  </div>
                  <div className="text-lg font-extrabold text-rutaal-navy">
                    Sent!
                  </div>
                  <div className="text-[11px] text-slate-600">
                    You sent <span className="font-semibold">${MAGIC_SEND_AMT}</span> to
                    <br />
                    Hapaki Lorenzo
                  </div>
                  <div className="w-full border-t border-slate-300 pt-1 text-left text-[11px] font-semibold">
                    1. Main Menu
                  </div>
                </div>
              )}

              {scene === "menu_loan" && (
                <div className="space-y-3 text-[11px]">
                  <div className="rounded-md border-l-4 border-rutaal-green bg-emerald-50 px-2 py-1.5">
                    <div className="text-[10px] font-semibold text-slate-600">Credit Score:</div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <div className="text-2xl font-extrabold text-rutaal-green">
                        72/100
                      </div>
                      <div className="text-[10px] font-semibold text-rutaal-navy">
                        ↑ +12 pts
                      </div>
                    </div>
                    <div className="mt-1 text-[10px] font-semibold text-slate-500">
                      First official history
                    </div>
                  </div>
                  <div className="rounded-md border-l-4 border-rutaal-navy bg-sky-50 px-2 py-1.5 text-[10px]">
                    <div className="mb-1 font-semibold">Benefits Unlocked:</div>
                    <div>• Max loan: $500</div>
                    <div>• Lower interest rates</div>
                  </div>
                  <div className="space-y-1 text-[11px] font-semibold">
                    <div>1. Enter Amount</div>
                    <div className="text-slate-500">2. Back</div>
                  </div>
                </div>
              )}

              {scene === "loan_amount" && (
                <div className="space-y-3 text-[11px]">
                  <div className="rounded-md bg-rutaal-green px-2 py-1.5 font-semibold text-white">
                    Loan Application
                  </div>
                  <div className="text-xs font-semibold">Enter Amount:</div>
                  <div className="mt-1 text-[10px] font-semibold text-slate-500">
                    ($50 - $500)
                  </div>
                </div>
              )}

              {scene === "loan_duration" && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-rutaal-green px-3 py-2 text-sm font-bold text-white">
                    Loan Duration
                  </div>
                  <div className="text-sm font-semibold text-slate-700">
                    Amount: ${loanAmount}
                  </div>
                  <div className="space-y-2 text-sm font-semibold text-slate-800">
                    <div>1. 3 months</div>
                    <div>2. 6 months</div>
                    <div>3. 8 months</div>
                    <div>4. 12 months</div>
                  </div>
                  <div className="text-xs text-slate-500">
                    Press 1-4 then Call
                  </div>
                </div>
              )}

              {scene === "loan_confirm" && (() => {
                const { processingFee, interest, totalRepay, monthlyPayment } = calcLoanDetails(loanAmount, loanDuration);
                return (
                  <div className="space-y-3 text-[11px]">
                    <div className="rounded-lg border-2 border-rutaal-yellow bg-yellow-50 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">Receive:</span>
                        <span className="text-lg font-extrabold">${loanAmount}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] font-semibold text-slate-600">
                        <span>Interest ({loanDuration}mo @ 36% APR):</span>
                        <span>+${interest}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] font-semibold text-slate-600">
                        <span>Processing (2%):</span>
                        <span>+${processingFee}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between border-t border-slate-300 pt-1">
                        <span className="text-xs font-semibold">Total Repay:</span>
                        <span className="text-lg font-extrabold">${totalRepay}</span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-rutaal-green px-3 py-2 text-center text-sm font-bold text-white">
                      {loanDuration} months • ${monthlyPayment}/mo
                    </div>
                    <div className="text-center text-[11px] font-semibold">
                      1. Confirm | 2. Cancel
                    </div>
                  </div>
                );
              })()}

              {scene === "loan_success" && (
                <div className="flex h-full flex-col items-center justify-center space-y-3 text-center text-[11px]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rutaal-green text-white">
                    ✓
                  </div>
                  <div className="text-lg font-extrabold text-rutaal-green">
                    Approved!
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500">
                    Processed in 12 seconds
                  </div>
                  <div className="w-full rounded-md border-2 border-dashed border-slate-700 bg-white px-2 py-1.5 text-left">
                    <div className="text-[9px] font-semibold uppercase text-slate-500">
                      Nearest Agent:
                    </div>
                    <div className="text-[13px] font-extrabold text-rutaal-navy">
                      &quot;Juan&apos;s Pharmacy&quot;
                    </div>
                    <div className="mt-1 text-[10px] font-semibold text-red-600">
                      ⏱ Valid for 20 mins
                    </div>
                    <div className="mt-1 border-t border-slate-200 pt-1 text-[10px] font-semibold text-slate-700">
                      Bring Legal Identification
                    </div>
                    <div className="mt-1 border-t border-slate-200 pt-1 text-[10px]">
                      <span className="mr-1 text-slate-500">Ref Code:</span>
                      <span className="font-mono text-xl font-extrabold tracking-[0.3em] text-slate-800">
                        8829
                      </span>
                    </div>
                  </div>
                  <div className="w-full border-t border-slate-300 pt-1 text-left text-[11px] font-semibold">
                    1. Main Menu
                  </div>
                </div>
              )}
            </div>

            {["pin", "menu_main", "send_phone", "send_confirm_name", "send_amount", "send_confirm_tx", "menu_loan", "loan_amount", "loan_duration", "loan_confirm"].includes(
              scene,
            ) && (
              <div className="flex items-center gap-2 border-t-2 border-slate-200 bg-white px-4 py-2.5 shrink-0">
                <span className="text-xl font-bold text-rutaal-green">&gt;</span>
                <span className="font-mono text-base font-bold tracking-wider text-slate-800">
                  {input}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex justify-between items-end px-2 mb-2">
          <button
            onClick={handleMenu}
            className="h-11 min-w-[64px] flex-1 rounded-xl bg-[#374151] text-[13px] font-bold text-white shadow-md active:scale-[0.98] transition-transform"
          >
            MENU
          </button>
          <div className="w-16 h-14 border-2 border-gray-600 rounded-2xl flex items-center justify-center -mt-1 shadow-inner bg-[#1f2937]">
            <div className="w-9 h-9 bg-black/90 rounded-xl" />
          </div>
          <button
            onClick={handleBack}
            className="h-11 min-w-[64px] flex-1 rounded-xl bg-[#374151] text-[13px] font-bold text-white shadow-md active:scale-[0.98] transition-transform"
          >
            BACK
          </button>
        </div>

        <div className="flex justify-between px-8 mb-2">
          <button
            onClick={handleCall}
            className="flex h-11 w-14 items-center justify-center rounded-2xl bg-rutaal-green text-white shadow-lg active:scale-95 transition-transform"
          >
            <Phone className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={resetDemo}
            title="Reset demo"
            className="flex h-11 w-14 items-center justify-center rounded-2xl bg-rutaal-red text-white shadow-lg active:scale-95 transition-transform"
          >
            <PhoneOff className="w-5 h-5 fill-current" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 px-3 pb-1">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((k) => (
            <button
              key={k}
              onClick={() => handleKey(k)}
              className="flex h-9 items-center justify-center rounded-lg text-white text-xl font-bold shadow active:translate-y-[1px] bg-gradient-to-b from-[#4b5563] to-[#374151] border-b-2 border-[#1f2937]"
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

