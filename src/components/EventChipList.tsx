export interface EventChip {
  slug: string;
  label: string;
}

export interface EventChipListProps {
  events: EventChip[];
  selectedSlug?: string | null;
  onSelect: (event: EventChip) => void;
  variant?: "default" | "preview";
}

// Renders a simple set of clickable event chips for quick countdown selection.
export function EventChipList({
  events,
  selectedSlug,
  onSelect,
  variant = "default",
}: EventChipListProps) {
  return (
    <section aria-label="Suggested events" className="w-full">
      <div className="flex flex-wrap justify-center gap-3">
        {events.map((event) => {
          const isActive = event.slug === selectedSlug;
          const activeClasses =
            variant === "preview"
              ? "border-[#B0C4DE] bg-[#B0C4DE] text-black shadow-none hover:bg-[#a7bdd8] dark:border-[#7f96b1] dark:bg-[#7f96b1] dark:text-[#0d1117] dark:hover:bg-[#8ca3be]"
              : "border-[#169c76] bg-[#169c76] text-white shadow-none hover:bg-[#148a69] dark:border-[#176f59] dark:bg-[#176f59] dark:text-white dark:hover:bg-[#1c8067]";

          return (
            <button
              key={event.slug}
              type="button"
              onClick={() => onSelect(event)}
              className={`rounded-[1.05rem] border px-5 py-2.5 text-sm font-medium shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d] ${
                isActive
                  ? activeClasses
                  : "border-black/6 bg-[#f3f2ee] text-black/78 hover:border-black/9 hover:bg-[#eceae4] dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/80 dark:hover:bg-[#232625]"
              }`}
            >
              {event.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
