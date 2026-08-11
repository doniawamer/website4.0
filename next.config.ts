import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // No ESLint config is set up for this project yet; avoid an interactive
    // prompt during `next build`.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
