/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;