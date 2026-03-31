import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Prevent server-only ONNX packages from being bundled
      "sharp": { browser: "empty-module" },
      "onnxruntime-node": { browser: "empty-module" },
    },
  },
};

export default nextConfig;
