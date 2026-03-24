import { NextResponse } from "next/server";
import { deleteCustomCountdownBySlugFromRedis } from "../../../../lib/customCountdownStore";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const result = await deleteCustomCountdownBySlugFromRedis(slug);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ deleted: result.deleted });
}
