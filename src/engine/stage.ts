/**
 * Live inputs the page feeds the 3D engine. Kept apart from the engine so the page can write
 * to it without pulling Three.js into the first chunk.
 */
export const stage: {
  /** Hero scroll story position, 0 → 4 across the five chapters. */
  storyProgress: number;
  /** Capability the pointer is over in the hero ("memory", "reasoning", "tools", "agents", "cta") or "". */
  reaction: string;
  /** Pins the hero to a chapter when set (used with reduced motion). */
  capturePhase: number | undefined;
  /** Freezes animation for still captures. */
  capture: boolean;
  /** Set by the engine once running: the views and shared renderer, for debugging. */
  render: unknown;
} = { storyProgress: 0, reaction: "", capturePhase: undefined, capture: false, render: null };
