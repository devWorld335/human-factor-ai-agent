/**
 * Creates the shared WebGL renderer, loads the robot model and starts rendering every
 * `.scene[data-model]` element on the page. Rejects when WebGL or the model is unavailable.
 */
export function startEngine(): Promise<void>;
