import { create } from "zustand";
import type { LoanRequest, ActiveLoan } from "./seed-data";
import {
  INITIAL_LOAN_QUEUE,
  INITIAL_ACTIVE_LOANS,
  INITIAL_WALLET,
} from "./seed-data";
import { generateLoanRequest } from "./loan-generator";

export interface WalletState {
  cashDeployed: number;
  feesEarned: number;
  activeCount: number;
  repaymentRate: number;
}

interface AgentStore {
  loanQueue: LoanRequest[];
  activeLoans: ActiveLoan[];
  wallet: WalletState;
  disburse: (id: string, loan: LoanRequest) => void;
  reject: (id: string) => void;
  expireRequest: (id: string) => void;
  confirmDisbursement: (id: string, loan: LoanRequest) => void;
  addLoanRequest: (request: LoanRequest) => void;
  injectRandomLoan: () => LoanRequest | null;
}

const MAX_QUEUE_SIZE = 3;

const FEE_RATE = 0.12; // 12% fee on disbursed amount
const REPAYMENT_PERIOD_MONTHS = 4;

export const useAgentStore = create<AgentStore>((set) => ({
  loanQueue: INITIAL_LOAN_QUEUE,
  activeLoans: INITIAL_ACTIVE_LOANS,
  wallet: INITIAL_WALLET,

  addLoanRequest: (request) =>
    set((state) => ({
      loanQueue: [request, ...state.loanQueue],
    })),

  injectRandomLoan: () => {
    let added: LoanRequest | null = null;
    set((state) => {
      if (state.loanQueue.length >= MAX_QUEUE_SIZE) return state;
      const newLoan = generateLoanRequest();
      added = newLoan;
      return { loanQueue: [newLoan, ...state.loanQueue] };
    });
    return added;
  },

  reject: (id) =>
    set((state) => ({
      loanQueue: state.loanQueue.filter((l) => l.id !== id),
    })),

  expireRequest: (id) =>
    set((state) => ({
      loanQueue: state.loanQueue.filter((l) => l.id !== id),
    })),

  disburse: (id) => {
    // Disburse action - just removes from queue, modal handles confirmDisbursement
    set((state) => ({
      loanQueue: state.loanQueue.filter((l) => l.id !== id),
    }));
  },

  confirmDisbursement: (id, loan) => {
    const fee = Math.round(loan.amount * FEE_RATE);
    const totalRepayable = loan.amount + fee;
    const monthlyPayment = Math.round(totalRepayable / REPAYMENT_PERIOD_MONTHS);
    const nextDue = new Date();
    nextDue.setMonth(nextDue.getMonth() + 1);

    const newLoan: ActiveLoan = {
      id: `loan-${id}`,
      borrowerName: loan.borrowerName,
      amount: loan.amount,
      totalRepayable,
      monthlyPayment,
      nextDue,
      status: "on_track",
      disbursedAt: new Date(),
    };

    set((state) => {
      const loanQueue = state.loanQueue.filter((l) => l.id !== id);
      const daysUntilDue = Math.ceil(
        (newLoan.nextDue.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
      );
      const status: ActiveLoan["status"] =
        daysUntilDue < 0
          ? "overdue"
          : daysUntilDue <= 7
            ? "due_soon"
            : "on_track";

      const loanWithStatus = { ...newLoan, status };

      return {
        loanQueue,
        activeLoans: [loanWithStatus, ...state.activeLoans],
        wallet: {
          ...state.wallet,
          cashDeployed: state.wallet.cashDeployed + loan.amount,
          feesEarned: state.wallet.feesEarned + fee,
          activeCount: state.wallet.activeCount + 1,
        },
      };
    });
  },
}));
