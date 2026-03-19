import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/days-until/:slug",
        destination: "/days-until-:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
