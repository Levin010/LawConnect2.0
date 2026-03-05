import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Add external domains here if you load images from a CDN later
    domains: [],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/:path*',
      },
    ];
  },
};

export default nextConfig;
