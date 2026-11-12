import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const api = "http://127.0.0.1:7726";

const optionalPeers: Record<string, string[]> = {
  "@solana-program/system": ["getTransferSolInstruction"],
  "@solana-program/memo": ["getAddMemoInstruction"],
  permissionless: ["createSmartAccountClient"],
  "@abstract-foundation/agw-client": ["createAbstractClient"],
};

function stubOptionalPeers(): Plugin {
  const prefix = "\0humanfator-peer:";
  return {
    name: "stub-privy-optional-peers",
    enforce: "pre",
    resolveId(id) {
      const pkg = Object.keys(optionalPeers).find((name) => id === name || id.startsWith(`${name}/`));
      if (pkg) return prefix + id;
    },
    load(id) {
      if (!id.startsWith(prefix)) return;
      const spec = id.slice(prefix.length);
      const pkg = Object.keys(optionalPeers).find((name) => spec === name || spec.startsWith(`${name}/`));
      if (!pkg) return;
      const body = optionalPeers[pkg]
        .map((name) => `export function ${name}() { throw new Error(${JSON.stringify(`${pkg} is not used by this app`)}); }`)
        .join("\n");
      return `${body}\nexport default {};\n`;
    },
  };
}

export default defineConfig({
  plugins: [react(), stubOptionalPeers()],
  assetsInclude: ["**/*.glb"],
  build: {
    chunkSizeWarningLimit: 900,
  },
  server: {
    port: 7725,
    host: true,
    proxy: {
      "/api/ca": { target: "https://humanfactor.172.86.127.236.sslip.io", changeOrigin: true, secure: true },
      "/api": { target: api, timeout: 200_000, proxyTimeout: 200_000 },
    },
  },
  preview: {
    port: 7725,
    host: true,
    proxy: {
      "/api/ca": { target: "https://humanfactor.172.86.127.236.sslip.io", changeOrigin: true, secure: true },
      "/api": { target: api, timeout: 200_000, proxyTimeout: 200_000 },
    },
  },
});
