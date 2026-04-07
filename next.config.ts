import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // serverActions are enabled by default in Next.js 15
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // UploadThing
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google avatars
      },
    ],
  },
};

export default nextConfig;
