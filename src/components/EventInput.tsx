export interface EventInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

// Controlled input used to submit an event, year, or exact date query.
export function EventInput({
  value,
  onValueChange,
  onSubmit,
  placeholder = "Christmas",
}: EventInputProps) {
  return (
    <form
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="event-input" className="sr-only">
        Event or date
      </label>
      <div className="flex flex-col items-center text-center">
        <div className="w-full max-w-[44rem]">
          <div className="text-[clamp(2.45rem,5.8vw,5rem)] font-semibold leading-[0.92] tracking-[-0.08em]">
            <div>How many days until</div>
          </div>
          <div className="mt-4 flex items-end justify-center gap-x-2 sm:gap-x-3">
            <div className="w-[min(78vw,26rem)] sm:w-[min(70vw,32rem)]">
              <input
                id="event-input"
                name="event-input"
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                placeholder={placeholder}
                className="block w-full border-b border-[#18c28f]/35 bg-transparent px-2 pb-2 text-center text-[clamp(2.4rem,6vw,4.9rem)] font-semibold italic leading-[1.02] tracking-[-0.08em] text-[#18c28f] outline-none transition placeholder:text-[#18c28f]/28 focus:border-[#18c28f]"
              />
            </div>
            <span className="shrink-0 text-[clamp(2.35rem,6.2vw,4.8rem)] leading-none text-[#18c28f]">
              ?
            </span>
          </div>
        </div>
      </div>
      <button type="submit" className="sr-only">
        Calculate
      </button>
    </form>
  );
}
