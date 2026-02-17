# Ruta'al Agent Dashboard — Next Steps

## Done in this pass

1. **Repayment status is now live** — Status (On Track / Due Soon / Overdue) is derived from `nextDue` at render time, so it updates as time passes without storing mutable status.
2. **Queue expiry** — When a request’s 20:00 countdown hits 0, it is auto-removed from the queue via `expireRequest(id)`.
3. **Cleanup** — Removed unused `injectedRef` from the dashboard page.

---

## Recommended next steps (in order)

### 1. Wire weekly earnings to real fees
- **Current:** `WeeklyChart` uses a hardcoded `[12, 18, 15, 22, 19, 25, 20]`.
- **Next:** Keep a rolling “fee history” (e.g. last 7 days) in the store. On each `confirmDisbursement`, push that day’s fee into the history and have `WeeklyChart` read from the store so the chart reflects actual disbursement fees.

### 2. Recalculate repayment rate
- **Current:** `wallet.repaymentRate` is fixed at 94.2% (seed data).
- **Next:** When you add “record payment” (see below), derive repayment rate from actual repayment events (e.g. % of installments paid on time or on schedule).

### 3. Record payment / repayments
- **Current:** Repayment table is display-only; no way to mark a payment or close a loan.
- **Next:** Add a “Record payment” (or “Mark installment paid”) action per row. Extend the store with something like `recordPayment(loanId)` and optionally:
  - Track `paidInstallments` (or `remainingBalance`) per loan.
  - When all installments are paid, move the loan to a “Paid” / “Closed” list or hide it from the active table.
  - Recompute `wallet.repaymentRate` and any “Fees This Month” from these events.

### 4. Optional: Toast when a request expires
- When `expireRequest` runs (timer hit 0), show a toast: e.g. “Request from [name] expired” so the agent sees that the request was dropped.

### 5. Backend / persistence (when moving off demo)
- Replace in-memory Zustand store with API calls (e.g. Next.js route handlers or external backend).
- Persist `loanQueue`, `activeLoans`, `wallet`, and fee history so state survives refresh and is shared across devices.

---

## Quick reference

| Area              | Current behavior                    | Possible improvement              |
|-------------------|-------------------------------------|-----------------------------------|
| Repayment status  | Derived from `nextDue` at render ✅ | —                                 |
| Queue expiry      | Auto-removed at 0:00 ✅             | Optional: expiry toast            |
| Weekly chart      | Static array                        | Feed from store fee history       |
| Repayment rate    | Static 94.2%                        | Derive from repayment events      |
| Repayment table   | Display only                        | Record payment, close loans       |
| `disburse(id)`    | In store, never used                | Remove or use for “quick disburse”|
