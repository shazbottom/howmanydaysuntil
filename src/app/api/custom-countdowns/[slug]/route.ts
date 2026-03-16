import { NextResponse } from "next/server";
import { findCustomCountdownBySlug } from "../../../../lib/customCountdowns";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(_: Request, { params }: RouteContext) {
  const { slug } = await params;
  const record = await findCustomCountdownBySlug(slug);

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    slug: record.slug,
    title: record.title,
    path: `/c/${record.slug}`,
  });
}
