import { Fragment } from "react";
import { SCENE_FALLBACKS } from "../data/images";
import { useEngineStatus } from "../hooks/useEngine";

/** Renders copy that uses `\n` for line breaks. */
export function Lines({ text }: { text: string }) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {p}
        </Fragment>
      ))}
    </>
  );
}

/**
 * A mount point for the 3D engine. The engine finds every `.scene[data-model]` on start and draws
 * into a canvas it appends here. If WebGL is unavailable, this shows the static render instead.
 */
export function Scene({ model, className, label }: { model: string; className: string; label: string }) {
  const status = useEngineStatus();
  if (status === "failed") {
    return (
      <div key="fallback" className={`scene ${className}`} data-model={model} role="img" aria-label={label}>
        <img className="scene-fallback" src={SCENE_FALLBACKS[model] ?? SCENE_FALLBACKS.head} alt={label} />
      </div>
    );
  }
  return <div key="live" className={`scene ${className}`} data-model={model} role="img" aria-label={label} />;
}
