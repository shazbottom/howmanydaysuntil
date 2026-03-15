const FULL_DATE_FORMATTER_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
};

const SHORT_DATE_FORMATTER_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

const LONG_DATE_FORMATTER_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

function createDateFormatter(options: Intl.DateTimeFormatOptions, locale?: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, options);
}

export function formatFullDate(date: Date, locale?: string): string {
  return createDateFormatter(FULL_DATE_FORMATTER_OPTIONS, locale).format(date);
}

export function formatLongDate(date: Date, locale?: string): string {
  return createDateFormatter(LONG_DATE_FORMATTER_OPTIONS, locale).format(date);
}

export function formatShortDate(date: Date, locale?: string): string {
  return createDateFormatter(SHORT_DATE_FORMATTER_OPTIONS, locale).format(date);
}
