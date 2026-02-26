export interface LoanRequest {
  id: string;
  borrowerName: string;
  phone: string;
  amount: number;
  creditScore: number;
  requestedAt: Date;
  expiresAt: Date;
}

export interface ActiveLoan {
  id: string;
  borrowerName: string;
  amount: number;
  totalRepayable: number;
  monthlyPayment: number;
  nextDue: Date;
  status: "on_track" | "due_soon" | "overdue";
  disbursedAt: Date;
}

export const MEXICO_NAMES = [
  "Roberto Hernández",
  "María González",
  "José García",
  "Carmen López",
  "Miguel Martínez",
  "Rosa Sánchez",
  "Francisco Rodríguez",
  "Ana Martínez",
  "Juan Pérez",
  "Elena Flores",
  "Carlos Ramírez",
  "Guadalupe Torres",
];

export const NEPAL_NAMES = [
  "Ram Bahadur",
  "Sita Devi",
  "Krishna Sharma",
  "Parbati Gurung",
  "Gopal Rai",
  "Maya Tamang",
  "Raj Kumar",
  "Sunita Thapa",
  "Bishnu Magar",
  "Durga Limbu",
  "Suresh Karki",
  "Laxmi Adhikari",
];

export const INITIAL_LOAN_QUEUE: LoanRequest[] = [
  {
    id: "req-1",
    borrowerName: "Sambhav Lamichhane",
    phone: "+977 *** *** 5543",
    amount: 250,
    creditScore: 72,
    requestedAt: new Date(Date.now() - 5 * 60 * 1000),
    expiresAt: new Date(Date.now() + 20 * 60 * 1000), // 20 min
  },
];

export const INITIAL_ACTIVE_LOANS: ActiveLoan[] = [
  {
    id: "loan-1",
    borrowerName: "Carmen López",
    amount: 200,
    totalRepayable: 224,
    monthlyPayment: 56,
    nextDue: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    status: "on_track",
    disbursedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
  },
  {
    id: "loan-2",
    borrowerName: "Ram Bahadur",
    amount: 350,
    totalRepayable: 392,
    monthlyPayment: 98,
    nextDue: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    status: "due_soon",
    disbursedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
  },
  {
    id: "loan-3",
    borrowerName: "María González",
    amount: 120,
    totalRepayable: 134,
    monthlyPayment: 34,
    nextDue: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: "overdue",
    disbursedAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
  },
  {
    id: "loan-4",
    borrowerName: "Krishna Sharma",
    amount: 425,
    totalRepayable: 476,
    monthlyPayment: 119,
    nextDue: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    status: "on_track",
    disbursedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

export const INITIAL_WALLET = {
  cashDeployed: 1095,
  feesEarned: 240, // Agent commissions (aligns with slide: ~$240/month at 50 customers)
  activeCount: 4,
  repaymentRate: 94.2,
};
