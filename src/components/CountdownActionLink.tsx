"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackAction, type ActionContext } from "../lib/actionAnalytics";

export function CountdownActionLink({ href, className, children, context }: { href: string; className?: string; children: ReactNode; context?: ActionContext }) {
  return <Link href={href} className={className} onClick={() => trackAction("tool_followthrough", context)}>{children}</Link>;
}
