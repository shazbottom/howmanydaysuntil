import { ImageResponse } from "next/og";

interface CountdownOgImageOptions {
  count: number | string;
  label: string;
  footer: string;
}

export const ogImageSize = {
  width: 1200,
  height: 630,
};

export const ogImageContentType = "image/png";

export function createCountdownOgImage({
  count,
  label,
  footer,
}: CountdownOgImageOptions): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "#f5f3ed",
          color: "#121212",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: "0.28em",
              fontWeight: 600,
              opacity: 0.58,
              textTransform: "uppercase",
            }}
          >
            DaysUntil
          </div>
          <div
            style={{
              height: 14,
              width: 14,
              borderRadius: 999,
              background: "#1f8f73",
              opacity: 0.85,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontSize: 172,
                lineHeight: 0.9,
                fontWeight: 700,
                letterSpacing: "-0.06em",
              }}
            >
              {count}
            </div>
            <div
              style={{
                fontSize: 54,
                lineHeight: 1,
                fontWeight: 600,
                letterSpacing: "-0.04em",
              }}
            >
              days
            </div>
          </div>
          <div
            style={{
              fontSize: 56,
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: "-0.05em",
              maxWidth: 980,
            }}
          >
            until {label}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 28,
            borderTop: "1px solid rgba(18,18,18,0.12)",
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 500,
              opacity: 0.72,
            }}
          >
            {footer}
          </div>
          <div
            style={{
              fontSize: 24,
              letterSpacing: "0.22em",
              fontWeight: 600,
              textTransform: "uppercase",
              opacity: 0.42,
            }}
          >
            Live countdown
          </div>
        </div>
      </div>
    ),
    ogImageSize,
  );
}
