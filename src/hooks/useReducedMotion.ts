const query = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null;

export const prefersReducedMotion = () => !!query?.matches;

export const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion() ? "instant" : "smooth");
