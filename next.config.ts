import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fast-chicken-657.convex.cloud',
      },
    ],
  },
};

export default nextConfig;
