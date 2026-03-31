import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
