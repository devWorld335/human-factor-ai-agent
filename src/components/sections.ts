/** Page sections in order, as [id, rail label]. */
export const SECTIONS: [string, string][] = [
  ["intro", "HUMANFATOR"],
  ["gateway", "OVERVIEW"],
  ["solutions", "PRODUCTS"],
  ["ecosystem", "SYSTEM"],
  ["footer", "FOOTER"],
];

export const sectionLabel = (id: string) => SECTIONS.find(([s]) => s === id)?.[1] ?? "";
