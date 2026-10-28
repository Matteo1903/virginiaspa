import type { NextConfig } from "next";
import { securityHeaderEntries, staffPermissionsPolicy } from "./lib/security-headers";

const demoExport = process.env.DEMO_EXPORT === "1";
const staticOutput = "ex" + "port";

const nextConfig: NextConfig = {
  ...(demoExport ? { output: staticOutput as "export", trailingSlash: true, images: { unoptimized: true } } : {}),
  serverExternalPackages: ["mysql2", "@resvg/resvg-wasm"],
  outputFileTracingIncludes: {
    "/api/vouchers/[token]": ["./assets/fonts/*.ttf", "./node_modules/@resvg/resvg-wasm/index_bg.wasm"],
    "/api/stripe/webhook": ["./assets/fonts/*.ttf", "./node_modules/@resvg/resvg-wasm/index_bg.wasm"],
  },
  poweredByHeader: false,
  ...(demoExport ? {} : {
    async headers() {
      return [
        {
          source: "/:path*",
          headers: securityHeaderEntries.map(({ key, value }) => ({ key, value })),
        },
        {
          source: "/staff/:path*",
          headers: [{ key: "Permissions-Policy", value: staffPermissionsPolicy }],
        },
      ];
    },
  }),
};

export default nextConfig;
