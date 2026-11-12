export type Product = {
  /** Display name; `\n` marks the line break used in the large heading. */
  name: string;
  short: string;
  icon: string;
  /** Which 3D module the engine renders in this product's scene. */
  model: string;
  desc: string;
  spec: string[];
  action: string;
  /** One line for the explore dialog. */
  offer: string;
  /** Personal is open. Code and Design stay listed until they launch. */
  ready: boolean;
};

export const PRODUCTS: Product[] = [
  {
    name: "Personal\nAgent",
    short: "Personal Agent",
    icon: "◎",
    model: "head",
    desc: "Tell it what you want to achieve. Your personal agent remembers the context, connects the right tools, and makes a thoughtful plan to move your work forward.",
    spec: [
      "CONTEXT-AWARE REASONING",
      "PERSISTENT WORKING MEMORY",
      "CONNECTED TOOLS",
      "MULTI-STEP PLANNING",
      "HUMAN APPROVAL CONTROLS",
      "CLEAR ACTION REPORTS",
    ],
    action: "MEET YOUR PERSONAL AGENT",
    offer: "Pro, with 5 credits a day, is not available yet.",
    ready: true,
  },
  {
    name: "Code\nAgent",
    short: "Code Agent",
    icon: "⌘",
    model: "code",
    desc: "An idea becomes a plan. A plan becomes working code. Your code agent understands your project, develops changes, and checks the result with you.",
    spec: [
      "PROJECT-AWARE CONTEXT",
      "IMPLEMENTATION PLANNING",
      "CODE GENERATION & REVIEW",
      "TEST-DRIVEN ITERATION",
      "TOOL-ASSISTED DEVELOPMENT",
    ],
    action: "BUILD WITH YOUR AGENT",
    offer: "Coming soon.",
    ready: false,
  },
  {
    name: "Design\nAgent",
    short: "Design Agent",
    icon: "✳",
    model: "canvas",
    desc: "Give an intention a visual language. Your design agent develops concepts, understands your system, and helps turn a direction into a cohesive experience.",
    spec: [
      "CREATIVE DIRECTION",
      "DESIGN SYSTEM MEMORY",
      "VISUAL EXPLORATION",
      "ITERATIVE REFINEMENT",
      "CONSISTENT OUTPUTS",
    ],
    action: "EXPLORE YOUR NEXT IDEA",
    offer: "Coming soon.",
    ready: false,
  },
];
