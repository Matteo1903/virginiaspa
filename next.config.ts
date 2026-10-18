import type { NextConfig } from "next";
import { securityHeaderEntries } from "./lib/security-headers";

const demoExport = process.env.DEMO_EXPORT === "1";
const staticOutput = "ex" + "port";

const nextConfig: NextConfig = {
  ...(demoExport ? { output: staticOutput as "export", trailingSlash: true, images: { unoptimized: true } } : {}),
  serverExternalPackages: ["mysql2"],
  poweredByHeader: false,
  ...(demoExport ? {} : {
    async headers() {
      return [
        {
          source: "/:path*",
          headers: securityHeaderEntries.map(({ key, value }) => ({ key, value })),
        },
      ];
    },
  }),
};

export default nextConfig;
