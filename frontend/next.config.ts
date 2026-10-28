import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Put it directly on the root object, NOT inside experimental */
  allowedDevOrigins: ["10.11.109.73"]
};

export default nextConfig;
