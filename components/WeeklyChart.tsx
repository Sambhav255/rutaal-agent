"use client";

import { useMemo } from "react";
import { format, subDays } from "date-fns";

const WEEKLY_EARNINGS = [12, 18, 15, 22, 19, 25, 20];

export function WeeklyChart() {
  const maxEarning = Math.max(...WEEKLY_EARNINGS);
  const total = WEEKLY_EARNINGS.reduce((a, b) => a + b, 0);
  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i)),
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#323030]/70">
          Weekly Earnings
        </h3>
        <span className="font-mono text-base font-bold text-rutaal-green tabular-nums">
          ${total} total
        </span>
      </div>
      <div className="flex h-36 items-end gap-2">
        {WEEKLY_EARNINGS.map((value, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="w-full min-w-[12px] max-w-[28px] rounded-t-md bg-gradient-to-t from-rutaal-green/80 to-rutaal-green transition-all duration-300 hover:from-rutaal-green hover:to-rutaal-green/90 shadow-sm"
              style={{
                height: `${Math.max((value / maxEarning) * 100, 12)}%`,
                minHeight: "16px",
              }}
              title={`${format(days[i], "EEE")}: $${value}`}
            />
            <span className="text-[11px] font-medium text-[#323030]/70">
              {format(days[i], "EEE")}
            </span>
            <span className="text-xs font-bold text-[#323030] tabular-nums">
              ${value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
