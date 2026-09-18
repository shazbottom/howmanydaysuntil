"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackAction } from "../lib/actionAnalytics";

export function CountdownActionLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return <Link href={href} className={className} onClick={() => trackAction("tool_followthrough")}>{children}</Link>;
}
