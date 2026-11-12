import { useEffect, useState } from "react";
import { TOKEN_CA } from "../data/site";

export type LiveToken = {
  address: string;
  name: string;
  chain: string;
};

const fallback: LiveToken = {
  address: TOKEN_CA.address,
  name: TOKEN_CA.symbol,
  chain: TOKEN_CA.chain,
};

let current = fallback;
const listeners = new Set<(token: LiveToken) => void>();
let timer = 0;

function apply(token: LiveToken) {
  if (token.address === current.address && token.name === current.name) return;
  current = token;
  for (const listener of listeners) listener(current);
}

async function pull() {
  try {
    // /api/ca is https://www.human-factor.site/api/ca once the Vercel rewrite is deployed.
    const response = await fetch("/api/ca", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as { address?: unknown; name?: unknown };
    const address = typeof data.address === "string" ? data.address.trim() : "";
    const name = typeof data.name === "string" ? data.name.trim() : "";
    apply({
      address: address || fallback.address,
      name: name || fallback.name,
      chain: fallback.chain,
    });
  } catch {
    // Keep the last address when the endpoint is briefly unreachable.
  }
}

function start() {
  if (timer) return;
  void pull();
  timer = window.setInterval(() => void pull(), 15_000);
  document.addEventListener("visibilitychange", onVisible);
}

function stop() {
  window.clearInterval(timer);
  timer = 0;
  document.removeEventListener("visibilitychange", onVisible);
}

function onVisible() {
  if (document.visibilityState === "visible") void pull();
}

export function useTokenCa(): LiveToken {
  const [token, setToken] = useState(current);
  useEffect(() => {
    listeners.add(setToken);
    start();
    setToken(current);
    return () => {
      listeners.delete(setToken);
      if (listeners.size === 0) stop();
    };
  }, []);
  return token;
}
