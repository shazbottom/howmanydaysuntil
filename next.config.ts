import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.daysuntil.is",
          },
        ],
        destination: "https://daysuntil.is/:path*",
        permanent: true,
      },
      {
        source: "/days-until/:slug",
        destination: "/days-until-:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
