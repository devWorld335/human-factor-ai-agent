/** Title-cases an upper-case label ("TOOL ROUTER" → "Tool Router"). */
export const titleCase = (s: string) => s.toLowerCase().replace(/(^|\s)\S/g, (a) => a.toUpperCase());
