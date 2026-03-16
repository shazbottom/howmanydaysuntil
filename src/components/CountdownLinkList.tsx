import Link from "next/link";

export interface CountdownLinkItem {
  href: string;
  label: string;
}

export interface CountdownLinkListProps {
  title: string;
  description?: string;
  links: CountdownLinkItem[];
  centered?: boolean;
}

export function CountdownLinkList({
  title,
  description,
  links,
  centered = false,
}: CountdownLinkListProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <section className={`mt-16 w-full border-t border-black/10 py-10 ${centered ? "text-center" : ""}`}>
      <h2 className="text-sm uppercase tracking-[0.24em] text-black/45">{title}</h2>
      {description ? (
        <p className={`mt-4 max-w-2xl text-sm text-black/55 ${centered ? "mx-auto" : ""}`}>{description}</p>
      ) : null}
      <div className={`mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm ${centered ? "justify-center" : ""}`}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-black/70 underline-offset-4 transition hover:text-black hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
