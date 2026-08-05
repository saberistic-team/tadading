import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@tadading/config", "@tadading/contracts"],
};

export default nextConfig;
