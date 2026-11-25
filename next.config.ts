import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// 'unsafe-inline' is needed for script/style because this app uses Next's
// inlined-stylesheet feature and Next's own hydration script, neither of
// which carry a nonce here — still blocks the main XSS vector (loading
// attacker-controlled script/style from a different origin) and clickjacking.
// 'unsafe-eval' is only added in dev: React's dev-mode debugging tools use
// eval() to reconstruct stack traces; React never uses it in production.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
        ],
      },
    ];
  },
};

export default nextConfig;
