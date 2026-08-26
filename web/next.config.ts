import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // Statik görseller için Vercel'de kolaylık sağlar
  },
};

export default nextConfig;
