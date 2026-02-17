import type { LoanRequest } from "./seed-data";
import { MEXICO_NAMES, NEPAL_NAMES } from "./seed-data";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function maskPhone(countryCode: string): string {
  const last4 = randomInt(1000, 9999);
  return `${countryCode} *** *** ${last4}`;
}

export function generateLoanRequest(): LoanRequest {
  const useMexico = Math.random() > 0.5;
  const names = useMexico ? MEXICO_NAMES : NEPAL_NAMES;
  const countryCode = useMexico ? "+52" : "+977";

  const id = `req-${Date.now()}-${randomInt(100, 999)}`;
  const amount = randomInt(50, 500);
  const creditScore = randomInt(45, 88);
  const requestedAt = new Date();
  const expiresAt = new Date(requestedAt.getTime() + 20 * 60 * 1000);

  return {
    id,
    borrowerName: randomChoice(names),
    phone: maskPhone(countryCode),
    amount,
    creditScore,
    requestedAt,
    expiresAt,
  };
}
