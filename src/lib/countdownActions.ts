export function formatActionDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getCountdownActions(date: Date, title: string) {
  const target = formatActionDate(date);
  const personal = new URLSearchParams({ date: target, title }).toString();
  return {
    business: `/business-days-until?target=${target}`,
    compare: `/days-between-dates?end=${target}`,
    adjust: `/add-or-subtract-date?start=${target}`,
    widget: `/countdown-widget?${personal}`,
    save: `/create?${personal}`,
  };
}

export function parseCountdownPrefill(params: Record<string, string | string[] | undefined>) {
  const single = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const date = single(params.date) ?? "";
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T12:00:00`) : null;
  const valid = parsed && Number.isFinite(parsed.getTime()) && formatActionDate(parsed) === date
    && parsed.getFullYear() >= 1900 && parsed.getFullYear() <= 2100;
  return {
    title: (single(params.title) ?? "").replace(/\s+/g, " ").trim().slice(0, 60),
    targetDate: valid ? `${date}T00:00` : "",
  };
}
