const DAY_MS = 24 * 60 * 60 * 1000;

export interface DatePlanningCalendarCell {
  day: number | null;
  isTarget: boolean;
  isToday: boolean;
}

export interface ExactDatePlanningData {
  monthLabel: string;
  weekdayHeaders: string[];
  calendarWeeks: DatePlanningCalendarCell[][];
  calendarDaysRemaining: number;
  weekdaysRemaining: number;
  weekendDaysRemaining: number;
  dayOfYear: number;
  daysInYear: number;
  yearProgressPercent: number;
}

function toUtcDateOnly(date: Date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

function isSameLocalDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDayOfYear(date: Date) {
  const start = Date.UTC(date.getFullYear(), 0, 1);
  const current = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((current - start) / DAY_MS) + 1;
}

function getCalendarWeeks(targetDate: Date, today: Date) {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const cellCount = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;
  const cells = Array.from({ length: cellCount }, (_, index): DatePlanningCalendarCell => {
    const day = index - firstDayOffset + 1;

    if (day < 1 || day > daysInMonth) {
      return { day: null, isTarget: false, isToday: false };
    }

    const cellDate = new Date(year, month, day);
    return {
      day,
      isTarget: isSameLocalDay(cellDate, targetDate),
      isToday: isSameLocalDay(cellDate, today),
    };
  });

  return Array.from({ length: cellCount / 7 }, (_, index) =>
    cells.slice(index * 7, index * 7 + 7),
  );
}

export function getExactDatePlanningData(
  targetDate: Date,
  now: Date = new Date(),
): ExactDatePlanningData {
  const todayUtc = toUtcDateOnly(now);
  const targetUtc = toUtcDateOnly(targetDate);
  const calendarDaysRemaining = Math.max(
    0,
    Math.round((targetUtc.getTime() - todayUtc.getTime()) / DAY_MS),
  );
  let weekdaysRemaining = 0;
  let weekendDaysRemaining = 0;

  for (let offset = 1; offset <= calendarDaysRemaining; offset += 1) {
    const date = new Date(todayUtc.getTime() + offset * DAY_MS);
    const day = date.getUTCDay();

    if (day === 0 || day === 6) {
      weekendDaysRemaining += 1;
    } else {
      weekdaysRemaining += 1;
    }
  }

  const dayOfYear = getDayOfYear(targetDate);
  const daysInYear = isLeapYear(targetDate.getFullYear()) ? 366 : 365;

  return {
    monthLabel: new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
    }).format(targetDate),
    weekdayHeaders: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    calendarWeeks: getCalendarWeeks(targetDate, now),
    calendarDaysRemaining,
    weekdaysRemaining,
    weekendDaysRemaining,
    dayOfYear,
    daysInYear,
    yearProgressPercent: Math.round((dayOfYear / daysInYear) * 100),
  };
}
