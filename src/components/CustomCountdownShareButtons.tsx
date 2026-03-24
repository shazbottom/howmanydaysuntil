"use client";

import { useEffect, useState } from "react";

const SITE_URL = "https://daysuntil.is";

interface CustomCountdownShareButtonsProps {
  title: string;
  description?: string;
}

export function CustomCountdownShareButtons({
  title,
  description,
}: CustomCountdownShareButtonsProps) {
  const [shareLinks, setShareLinks] = useState<{
    x: string;
    facebook: string;
    whatsapp: string;
  } | null>(null);

  useEffect(() => {
    const pageUrl = `${SITE_URL}${window.location.pathname}${window.location.search}${window.location.hash}`;
    const shareText = description
      ? `${title} - ${description}`
      : `${title} - Countdown on DaysUntil`;

    const encodedUrl = encodeURIComponent(pageUrl);
    const encodedText = encodeURIComponent(shareText);

    setShareLinks({
      x: `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`,
    });
  }, [description, title]);

  if (!shareLinks) {
    return null;
  }

  const buttonClassName =
    "inline-flex h-11 w-11 items-center justify-center rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]";

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <a
        href={shareLinks.x}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on X"
        title="Share on X"
        className={buttonClassName}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
          <path d="M18.9 2H21l-6.56 7.5L22 22h-5.94l-4.65-6.08L6.07 22H4l7.01-8.01L2 2h6.09l4.2 5.57L18.9 2Zm-1.04 18h1.64L7.2 3.9H5.45L17.86 20Z" />
        </svg>
      </a>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on Facebook"
        title="Share on Facebook"
        className={buttonClassName}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
          <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.2-1.5 1.5-1.5H16.7V4.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 4v2.3H8v3.1h2.6v8h2.9Z" />
        </svg>
      </a>
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on WhatsApp"
        title="Share on WhatsApp"
        className={buttonClassName}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-8.63 15.05L2 22l5.08-1.32A10 10 0 1 0 12 2Zm0 18.2a8.16 8.16 0 0 1-4.16-1.14l-.3-.18-3.01.78.8-2.93-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.12c-.25-.13-1.48-.73-1.7-.82-.23-.08-.4-.13-.57.13-.17.25-.65.82-.8.98-.15.17-.3.19-.55.07-.25-.13-1.07-.39-2.03-1.24-.75-.67-1.26-1.49-1.4-1.74-.15-.25-.02-.39.1-.51.11-.11.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.07-.13-.57-1.37-.78-1.88-.2-.48-.41-.42-.57-.43h-.48c-.17 0-.45.06-.69.32-.23.25-.9.88-.9 2.14 0 1.25.92 2.46 1.05 2.63.13.17 1.8 2.74 4.37 3.84.61.26 1.09.42 1.46.54.61.19 1.16.16 1.6.1.49-.07 1.48-.6 1.69-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29Z" />
        </svg>
      </a>
    </div>
  );
}
