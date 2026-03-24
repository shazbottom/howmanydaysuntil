import { createCountdownOgImage } from "../../../../lib/ogImage";

export const runtime = "edge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const count = url.searchParams.get("count") ?? "-";
  const label = url.searchParams.get("label") ?? "countdown";
  const footer = url.searchParams.get("footer") ?? "DaysUntil";
  const description = url.searchParams.get("description") ?? "";

  try {
    return createCountdownOgImage({
      count,
      label,
      footer,
      description: description || undefined,
    });
  } catch {
    return createCountdownOgImage({
      count: "-",
      label: "countdown",
      footer: "DaysUntil",
    });
  }
}
