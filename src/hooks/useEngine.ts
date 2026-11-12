import { createContext, useContext, useEffect, useState } from "react";

export type EngineStatus = "loading" | "ready" | "failed";

export const EngineContext = createContext<EngineStatus>("loading");
export const useEngineStatus = () => useContext(EngineContext);

let started: Promise<void> | null = null;

/**
 * Starts the 3D engine once the page's `.scene` elements are in the DOM. The engine is loaded
 * lazily so Three.js stays out of the first paint. It starts only once, even under StrictMode.
 */
export function useEngine(): EngineStatus {
  const [status, setStatus] = useState<EngineStatus>("loading");
  useEffect(() => {
    if (new URLSearchParams(location.search).has("fallback")) {
      setStatus("failed");
      return;
    }
    let live = true;
    const frame = requestAnimationFrame(() => {
      started ??= import("../engine/engine.js").then((m) => m.startEngine());
      started.then(
        () => live && setStatus("ready"),
        (err) => {
          console.warn("3D renderer unavailable; using static scene fallback.", err);
          if (live) setStatus("failed");
        },
      );
    });
    return () => {
      live = false;
      cancelAnimationFrame(frame);
    };
  }, []);
  return status;
}
