import Image from "next/image";

interface BrandProps {
  variant?: "stacked" | "horizontal" | "icon";
  height?: number;
  className?: string;
  priority?: boolean;
}

const BRAND_ASSETS = {
  stacked: {
    src: "/logo/main-logo-text-underneath.svg",
    width: 2016,
    height: 2094,
  },
  horizontal: {
    src: "/logo/logo-side-text.svg",
    width: 3620,
    height: 1152,
  },
  icon: {
    src: "/logo/logo-no-text-small.svg",
    width: 2016,
    height: 2094,
  },
} as const;

export function Brand({
  variant = "stacked",
  height,
  className = "",
  priority = false,
}: BrandProps) {
  const asset = BRAND_ASSETS[variant];
  const resolvedHeight = height ?? (
    variant === "stacked" ? 96 : variant === "horizontal" ? 28 : 20
  );
  const scaledWidth = Math.round((asset.width / asset.height) * resolvedHeight);

  return (
    <Image
      src={asset.src}
      alt="DaysUntil"
      width={scaledWidth}
      height={resolvedHeight}
      priority={priority}
      className={`w-auto ${className}`.trim()}
    />
  );
}
