import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'quotus.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
