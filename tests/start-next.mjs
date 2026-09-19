import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

export function testPort() {
  return Number(process.env.TEST_PORT || 3010);
}

export function testBase() {
  return process.env.TEST_BASE || `http://127.0.0.1:${testPort()}`;
}

export async function waitForServer(base = testBase(), attempts = 60) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(`${base}/api/health`);
      if (response.ok) return;
    } catch {
      // Server still booting.
    }
    await sleep(500);
  }
  throw new Error(`Server not ready at ${base}`);
}

export async function withNextServer(run) {
  const existing = process.env.TEST_BASE;
  if (existing) {
    await waitForServer(existing);
    return run(existing);
  }

  const port = testPort();
  const base = `http://127.0.0.1:${port}`;
  const child = spawn("npx", ["next", "start", "--port", String(port), "--hostname", "127.0.0.1"], {
    cwd: root,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  child.stdout?.on("data", (chunk) => {
    output += String(chunk);
  });
  child.stderr?.on("data", (chunk) => {
    output += String(chunk);
  });

  const failed = new Promise((_, reject) => {
    child.once("exit", (code) => {
      reject(new Error(`next start exited ${code}: ${output.slice(-2000)}`));
    });
  });

  try {
    await Promise.race([waitForServer(base), failed]);
    return await run(base);
  } finally {
    child.removeAllListeners("exit");
    child.kill("SIGTERM");
    await sleep(300);
    if (child.exitCode === null) child.kill("SIGKILL");
  }
}
