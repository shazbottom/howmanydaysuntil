export interface EventChip {
  slug: string;
  label: string;
}

export interface EventChipListProps {
  events: EventChip[];
  selectedSlug?: string | null;
  onSelect: (event: EventChip) => void;
}

// Renders a simple set of clickable event chips for quick countdown selection.
export function EventChipList({
  events,
  selectedSlug,
  onSelect,
}: EventChipListProps) {
  return (
    <section aria-label="Suggested events" className="w-full">
      <div className="flex flex-wrap justify-center gap-3">
        {events.map((event) => {
          const isActive = event.slug === selectedSlug;

          return (
            <button
              key={event.slug}
              type="button"
              onClick={() => onSelect(event)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-black text-white"
                  : "bg-black/[0.035] text-black/78 hover:bg-black/[0.055]"
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
