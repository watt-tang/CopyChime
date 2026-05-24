import { spawn } from "child_process";
import { createServer } from "vite";

async function main() {
  // Start Vite dev server for renderer
  const vite = await createServer({
    configFile: "./vite.config.ts",
  });
  await vite.listen();
  const viteUrl = `http://localhost:${vite.config.server.port}`;
  console.log(`Vite dev server: ${viteUrl}`);

  // Compile main process with tsc
  const tscMain = spawn("npx", ["tsc", "-p", "tsconfig.main.json", "--watch"], {
    stdio: "inherit",
    shell: true,
  });

  // Compile preload with tsc
  const tscPreload = spawn("npx", ["tsc", "-p", "tsconfig.preload.json", "--watch"], {
    stdio: "inherit",
    shell: true,
  });

  // Wait a bit for initial compilation
  await new Promise((r) => setTimeout(r, 2000));

  // Start Electron
  const electron = spawn("npx", ["electron", "."], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, VITE_DEV_SERVER_URL: viteUrl },
  });

  electron.on("close", () => {
    tscMain.kill();
    tscPreload.kill();
    vite.close();
    process.exit(0);
  });

  process.on("SIGINT", () => {
    electron.kill();
    tscMain.kill();
    tscPreload.kill();
    vite.close();
    process.exit(0);
  });
}

main().catch(console.error);
