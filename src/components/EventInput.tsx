"use client";

export interface EventInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

function getValueSizeClasses(value: string): {
  input: string;
  punctuation: string;
} {
  const length = value.trim().length;

  if (length >= 20) {
    return {
      input: "text-[clamp(1.45rem,6.8vw,3.5rem)]",
      punctuation: "text-[clamp(1.4rem,6.1vw,3.4rem)]",
    };
  }

  if (length >= 12) {
    return {
      input: "text-[clamp(1.6rem,7.4vw,3.95rem)]",
      punctuation: "text-[clamp(1.55rem,6.8vw,3.85rem)]",
    };
  }

  return {
    input: "text-[clamp(1.75rem,8.1vw,4.4rem)]",
    punctuation: "text-[clamp(1.7rem,7.4vw,4.3rem)]",
  };
}

// Controlled input used to submit an event, year, or exact date query.
export function EventInput({
  value,
  onValueChange,
  onSubmit,
  placeholder = "Christmas",
}: EventInputProps) {
  const valueSizeClasses = getValueSizeClasses(value || placeholder);

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
        <div className="w-full max-w-[38rem] sm:max-w-[44rem]">
          <div className="mx-auto max-w-[11ch] text-[clamp(2rem,10vw,5rem)] font-semibold leading-[0.94] tracking-[-0.08em] text-black dark:text-white sm:max-w-none sm:text-[clamp(2.45rem,5.8vw,5rem)]">
            <div>How many days until</div>
          </div>
          <div className="mx-auto mt-4 flex max-w-[min(88vw,24rem)] items-end justify-center gap-x-2 sm:max-w-[min(70vw,32rem)] sm:gap-x-3">
            <div className="min-w-0 flex-1">
              <input
                id="event-input"
                name="event-input"
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                placeholder={placeholder}
                className={`block w-full border-b border-[#169c76]/35 bg-transparent px-2 pb-2 text-center font-semibold italic leading-[1.02] tracking-[-0.07em] text-[#169c76] outline-none transition placeholder:text-[#169c76]/28 focus:border-[#169c76] dark:border-[#4ab494]/40 dark:text-[#4ab494] dark:placeholder:text-[#4ab494]/28 dark:focus:border-[#4ab494] ${valueSizeClasses.input}`}
              />
            </div>
            <span className={`shrink-0 leading-none text-[#169c76] dark:text-[#4ab494] ${valueSizeClasses.punctuation}`}>
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
