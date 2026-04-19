import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob:",
      "connect-src 'self' https://*.supabase.co https://api.stripe.com https://generativelanguage.googleapis.com https://api.groq.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "worker-src 'self' blob:",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      // Sitemap & robots.txt : accessibles publiquement, pas de CORP restrictif
      {
        source: "/(sitemap\\.xml|robots\\.txt)",
        headers: [
          { key: "Content-Type", value: "application/xml; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      // Toutes les autres routes
      { source: "/((?!sitemap\\.xml|robots\\.txt).*)", headers: securityHeaders },
    ];
  },
  // Turbopack (next dev)
  turbopack: {
    resolveAlias: {
      "sharp": { browser: "empty-module" },
      "onnxruntime-node": { browser: "empty-module" },
    },
  },
  // Webpack (next build / production)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        sharp: false,
        "onnxruntime-node": false,
      };
    }
    return config;
  },
};

export default nextConfig;
