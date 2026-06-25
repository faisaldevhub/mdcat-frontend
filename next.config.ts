import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for development warnings
  reactStrictMode: true,

  // Image optimization — allow backend domain for user avatars
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.mdcatinsecond.com",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
    ],
  },
};

export default nextConfig;
