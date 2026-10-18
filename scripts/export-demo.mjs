import { copyFile, mkdir, rename, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const stash = path.join(root, ".demo-build-stash");
const siteUrl = process.env.DEMO_SITE_URL || "https://virginiaspa.andreaprotani.com";
const moves = [
  ["app/api", "api"],
  ["proxy.ts", "proxy.ts"],
];

await rm(stash, { recursive: true, force: true });
await mkdir(stash, { recursive: true });
const moved = [];

try {
  for (const [from, name] of moves) {
    const source = path.join(root, from);
    const target = path.join(stash, name);
    await rename(source, target);
    moved.push([target, source]);
  }

  const code = await new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "build"], {
      cwd: root,
      stdio: "inherit",
      env: {
        ...process.env,
        DEMO_EXPORT: "1",
        NEXT_PUBLIC_DEMO_MODE: "1",
        NEXT_PUBLIC_SITE_URL: siteUrl,
      },
    });
    child.on("error", () => resolve(1));
    child.on("exit", (status) => resolve(status ?? 1));
  });
  if (code !== 0) process.exitCode = code;
  else await copyFile(path.join(root, "deploy/static.htaccess"), path.join(root, "out/.htaccess"));
} finally {
  for (const [from, to] of moved.reverse()) {
    await rename(from, to);
  }
  await rm(stash, { recursive: true, force: true });
}
