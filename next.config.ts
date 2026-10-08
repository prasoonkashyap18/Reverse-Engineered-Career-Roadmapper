import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // CLAUDE.md is this project's canonical agent context file.
  agentRules: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
