import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverActions: {
    // Increase body size limit for Server Actions to allow image uploads
    bodySizeLimit: "10mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      },
    ],
  }
};

export default nextConfig;
