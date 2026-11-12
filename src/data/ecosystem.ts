export type EcosystemLayer = {
  title: string;
  /** [icon, label] */
  nodes: [string, string][];
  /** Node positions as [left %, top %]; the third node is the hub the wires route to. */
  positions: [number, number][];
};

export const ECOSYSTEM: EcosystemLayer[] = [
  {
    title: "Perception & context",
    nodes: [
      ["◎", "PERSONAL AGENT"],
      ["⌁", "OBSERVATION"],
      ["⠿", "CONNECTED TOOLS"],
      ["➤", "USER INTENT"],
      ["✓", "PERMISSIONS"],
      ["⌘", "WORKING CONTEXT"],
      ["↗", "KNOWLEDGE"],
      ["✳", "PERCEPTION"],
      ["◈", "LONG-TERM MEMORY"],
    ],
    positions: [
      [18, 18],
      [50, 15],
      [82, 18],
      [8, 56],
      [31, 53],
      [58, 53],
      [86, 57],
      [31, 87],
      [70, 87],
    ],
  },
  {
    title: "Reasoning & planning",
    nodes: [
      ["⠿", "CONTEXT MEMORY"],
      ["◎", "REASONING ENGINE"],
      ["◈", "NEURAL CORE"],
      ["✧", "PLANNING ENGINE"],
      ["↗", "TASK DECOMPOSITION"],
      ["✓", "CONFIDENCE CHECK"],
    ],
    positions: [
      [20, 25],
      [77, 22],
      [49, 46],
      [20, 80],
      [72, 82],
      [89, 51],
    ],
  },
  {
    title: "Tools & execution",
    nodes: [
      ["⇅", "TOOL ROUTER"],
      ["⠿", "ACTION ENGINE"],
      ["▦", "DATA CONNECTORS"],
      ["⌘", "CODE WORKSPACE"],
      ["✳", "CREATIVE TOOLS"],
      ["✓", "RESULT VALIDATION"],
    ],
    positions: [
      [20, 27],
      [51, 24],
      [83, 22],
      [16, 77],
      [49, 79],
      [83, 77],
    ],
  },
  {
    title: "A coordinated agent network",
    nodes: [
      ["◎", "PERSONAL AGENT"],
      ["✳", "DESIGN AGENT"],
      ["⌘", "CODE AGENT"],
    ],
    positions: [
      [22, 30],
      [78, 30],
      [50, 68],
    ],
  },
];

/** SVG path from a node to the layer's hub (node index 2), in a 1000×500 viewBox. */
export function wirePath(layer: EcosystemLayer, index: number): string | null {
  if (index === 2) return null;
  const [x, y] = layer.positions[index];
  const [hx, hy] = layer.positions[2];
  const r = x * 10,
    a = y * 5,
    o = hx * 10,
    l = hy * 5,
    c = (r + o) / 2;
  return `M${r} ${a}H${c - 15}L${c} ${a + 15}V${l - 15}L${c + 15} ${l}H${o}`;
}
