import Link from "next/link";
import type { ExactDatePlanningData } from "../lib/datePlanning";

export function ExactDatePlanner({
  data,
  businessDaysHref,
  embedded = false,
}: {
  data: ExactDatePlanningData;
  businessDaysHref: string;
  embedded?: boolean;
}) {
  const metrics = [
    { label: "Calendar days", value: data.calendarDaysRemaining },
    { label: "Weekdays", value: data.weekdaysRemaining },
    { label: "Weekend days", value: data.weekendDaysRemaining },
    { label: "Through the year", value: `${data.yearProgressPercent}%` },
  ];

  return (
    <section className={`${embedded ? "" : "mt-12 "}w-full max-w-[31.9rem] overflow-hidden rounded-[2rem] bg-[#fdfcf9] text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:max-w-[34rem]`}>
      <div className="border-b border-black/7 px-6 py-6 dark:border-white/9 sm:px-8">
        <p className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
          Date planner
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">{data.monthLabel}</h2>
        <p className="mt-2 text-sm leading-6 text-black/54 dark:text-white/57">
          A calendar view and practical breakdown of the days between today and the target date.
          Counts exclude today and include the target date. Weekdays do not exclude public holidays.
        </p>
      </div>

      <div className="grid grid-cols-2 border-b border-black/7 dark:border-white/9">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={`px-5 py-5 sm:px-7 ${
              index % 2 === 0 ? "border-r border-black/7 dark:border-white/9" : ""
            } ${index < 2 ? "border-b border-black/7 dark:border-white/9" : ""}`}
          >
            <p className="font-mono text-2xl font-semibold tabular-nums">{metric.value}</p>
            <p className="mt-2 text-xs font-semibold tracking-wide text-black/65 dark:text-white/70">
              {metric.label}
            </p>
          </div>
        ))}
      </div>

      <div className="px-5 py-6 sm:px-7">
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-black/65 dark:text-white/70">
          {data.weekdayHeaders.map((weekday) => (
            <span key={weekday} className="py-2">
              {weekday}
            </span>
          ))}
        </div>
        <div className="mt-1 space-y-1">
          {data.calendarWeeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((cell, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`flex aspect-square items-center justify-center rounded-[0.8rem] text-sm font-medium ${
                    cell.isTarget
                      ? "bg-[#6495ED] text-white shadow-[0_5px_15px_rgba(100,149,237,0.28)] dark:bg-[#6f97db]"
                      : cell.isToday
                        ? "ring-1 ring-[#6495ED]/60 text-black dark:text-white"
                        : cell.day
                          ? "text-black/68 dark:text-white/68"
                          : "text-transparent"
                  }`}
                >
                  {cell.day ?? "-"}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/7 pt-4 text-xs text-black/48 dark:border-white/9 dark:text-white/50">
          <span>
            Day {data.dayOfYear} of {data.daysInYear}
          </span>
          <Link
            href={businessDaysHref}
            className="font-semibold text-black/68 underline underline-offset-4 hover:text-black dark:text-white/70 dark:hover:text-white"
          >
            Calculate regional business days
          </Link>
        </div>
      </div>
    </section>
  );
}
