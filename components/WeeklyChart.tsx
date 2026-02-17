"use client";

import { useMemo } from "react";
import { format, subDays } from "date-fns";

const WEEKLY_EARNINGS = [12, 18, 15, 22, 19, 25, 20];

export function WeeklyChart() {
  const maxEarning = Math.max(...WEEKLY_EARNINGS);
  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i)),
    []
  );

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-400">
        Weekly Earnings ($)
      </h3>
      <div className="flex h-24 items-end gap-1">
        {WEEKLY_EARNINGS.map((value, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full min-w-[8px] rounded-t bg-rutaal-green transition-all duration-300 hover:bg-rutaal-green/80"
              style={{
                height: `${(value / maxEarning) * 100}%`,
                minHeight: value > 0 ? "4px" : "0",
              }}
            />
            <span className="text-[10px] text-zinc-500">
              {format(days[i], "EEE")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
