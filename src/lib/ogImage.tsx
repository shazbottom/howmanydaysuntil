import { ImageResponse } from "next/og";

interface CountdownOgImageOptions {
  count: number | string;
  label: string;
  footer: string;
  description?: string;
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
  description,
}: CountdownOgImageOptions): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          height: 630,
          width: 1200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingTop: 56,
          paddingRight: 64,
          paddingBottom: 48,
          paddingLeft: 64,
          backgroundColor: "#f5f3ed",
          color: "#121212",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
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
              backgroundColor: "#1f8f73",
              opacity: 0.85,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 56,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              width: "100%",
            }}
          >
            <div
              style={{
                fontSize: 172,
                lineHeight: 0.9,
                fontWeight: 700,
                letterSpacing: -10,
              }}
            >
              {String(count)}
            </div>
            <div
              style={{
                marginLeft: 18,
                fontSize: 54,
                lineHeight: 1,
                fontWeight: 600,
                letterSpacing: -2,
              }}
            >
              days
            </div>
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 56,
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: -3,
              maxWidth: 980,
              display: "flex",
            }}
          >
            {`until ${label}`}
          </div>
          {description ? (
            <div
              style={{
                marginTop: 22,
                fontSize: 30,
                lineHeight: 1.35,
                fontWeight: 500,
                maxWidth: 920,
                color: "rgba(18,18,18,0.68)",
                display: "flex",
              }}
            >
              {description}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingTop: 28,
            borderTopWidth: 1,
            borderTopStyle: "solid",
            borderTopColor: "rgba(18,18,18,0.12)",
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
              letterSpacing: 4,
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
