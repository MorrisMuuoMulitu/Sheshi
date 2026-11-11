import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // AVIF first (roughly 30% smaller than WebP), WebP as the fallback.
    formats: ["image/avif", "image/webp"],
    // The hero is the only large source; the rest are already modest.
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920, 2400],
  },
};

export default nextConfig;
