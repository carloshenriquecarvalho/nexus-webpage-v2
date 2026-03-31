/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Outras configs experimentais se houver, caso contrário, apague o bloco
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;