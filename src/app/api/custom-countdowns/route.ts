import { NextResponse } from "next/server";
import { createCustomCountdown } from "../../../lib/customCountdowns";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createCustomCountdown({
    title: typeof body.title === "string" ? body.title : "",
    targetDate: typeof body.targetDate === "string" ? body.targetDate : "",
    timezone: typeof body.timezone === "string" ? body.timezone : "",
    note: typeof body.note === "string" ? body.note : "",
  });

  if (result.errors) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  return NextResponse.json({
    slug: result.record?.slug,
    path: `/c/${result.record?.slug}`,
  });
}
