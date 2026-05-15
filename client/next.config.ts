import type { NextConfig } from "next";

const apiUrl = process.env.SERVER_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
