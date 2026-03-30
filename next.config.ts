import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: true,
  experimental: {
    legacyBrowsers: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
