import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  agentRules: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Ship the (small) stylesheet inside the HTML instead of as a separate
    // render-blocking request.
    inlineCss: true,
  },
};

export default nextConfig;
