import { NextResponse } from "next/server";
import { createCustomCountdownInRedis } from "../../../lib/customCountdownStore";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createCustomCountdownInRedis({
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
    title: result.record?.title,
    path: result.record ? `/c/${result.record.slug}` : null,
  });
}
