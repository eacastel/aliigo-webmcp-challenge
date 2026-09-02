import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "Origin-Agent-Cluster", value: "?1" },
        { key: "Permissions-Policy", value: "tools=(self)" },
      ],
    }];
  },
};

export default nextConfig;
