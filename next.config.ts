import type { NextConfig } from "next";
import { securityHeaderEntries } from "./lib/security-headers";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mysql2"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaderEntries.map(({ key, value }) => ({ key, value })),
      },
    ];
  },
};

export default nextConfig;
