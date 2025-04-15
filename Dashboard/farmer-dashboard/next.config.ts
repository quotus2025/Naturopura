import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'quotus.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'crop.kindwise.com',
        pathname: '/api/**',
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    },
    turbo: {
      rules: {
        api: {
          loose: false,
          loaders: []
        }
      }
    }
  },
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  }
};

export default nextConfig;
