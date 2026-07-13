export type CountdownWidgetTheme = "light" | "dark";
export type CountdownWidgetSize = "compact" | "standard" | "wide";

export interface CountdownWidgetConfig {
  title: string;
  targetDate: string;
  theme: CountdownWidgetTheme;
  accent: string;
}

export interface CountdownWidgetSizeDefinition {
  label: string;
  width: number;
  height: number;
}

export const COUNTDOWN_WIDGET_SITE_URL = "https://daysuntil.is";

export const countdownWidgetSizes: Record<
  CountdownWidgetSize,
  CountdownWidgetSizeDefinition
> = {
  compact: { label: "Compact", width: 320, height: 220 },
  standard: { label: "Standard", width: 420, height: 260 },
  wide: { label: "Wide", width: 640, height: 240 },
};

const DEFAULT_ACCENT = "#e40a2d";
const MAX_TITLE_LENGTH = 60;

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

export function formatWidgetDateInput(date: Date) {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
}

function parseDateInput(value: string): Date | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    year < 1000 ||
    year > 2100 ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function sanitizeTitle(value: string | undefined) {
  const title = value?.replace(/\s+/g, " ").trim().slice(0, MAX_TITLE_LENGTH);
  return title || "My countdown";
}

function sanitizeAccent(value: string | undefined) {
  return value && /^#[0-9a-f]{6}$/i.test(value) ? value.toLowerCase() : DEFAULT_ACCENT;
}

function sanitizeTheme(value: string | undefined): CountdownWidgetTheme {
  return value === "dark" ? "dark" : "light";
}

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function getDefaultCountdownWidgetConfig(now: Date = new Date()): CountdownWidgetConfig {
  let christmas = new Date(now.getFullYear(), 11, 25);

  if (christmas < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    christmas = new Date(now.getFullYear() + 1, 11, 25);
  }

  return {
    title: "Christmas",
    targetDate: formatWidgetDateInput(christmas),
    theme: "light",
    accent: DEFAULT_ACCENT,
  };
}

export function parseCountdownWidgetConfig(
  searchParams: Record<string, string | string[] | undefined>,
  now: Date = new Date(),
): CountdownWidgetConfig {
  const defaults = getDefaultCountdownWidgetConfig(now);
  const requestedDate = getSingleSearchParam(searchParams.date);
  const parsedDate = requestedDate ? parseDateInput(requestedDate) : null;

  return {
    title: sanitizeTitle(getSingleSearchParam(searchParams.title)),
    targetDate: parsedDate ? formatWidgetDateInput(parsedDate) : defaults.targetDate,
    theme: sanitizeTheme(getSingleSearchParam(searchParams.theme)),
    accent: sanitizeAccent(getSingleSearchParam(searchParams.accent)),
  };
}

export function buildCountdownWidgetPath(config: CountdownWidgetConfig) {
  const params = new URLSearchParams({
    title: sanitizeTitle(config.title),
    date: parseDateInput(config.targetDate)
      ? config.targetDate
      : getDefaultCountdownWidgetConfig().targetDate,
    theme: sanitizeTheme(config.theme),
    accent: sanitizeAccent(config.accent),
  });

  return `/embed/countdown?${params.toString()}`;
}

export function buildCountdownWidgetEmbedCode(
  config: CountdownWidgetConfig,
  size: CountdownWidgetSize,
) {
  const resolvedSize = countdownWidgetSizes[size] ?? countdownWidgetSizes.standard;
  const src = `${COUNTDOWN_WIDGET_SITE_URL}${buildCountdownWidgetPath(config)}`.replaceAll(
    "&",
    "&amp;",
  );

  return `<iframe src="${src}" title="${escapeHtmlAttribute(config.title)} countdown" width="${resolvedSize.width}" height="${resolvedSize.height}" loading="lazy" style="border:0;border-radius:24px;max-width:100%;" allowtransparency="true"></iframe>`;
}

export function parseWidgetTargetDate(value: string) {
  return parseDateInput(value);
}
