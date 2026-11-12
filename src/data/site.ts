import type { ImageKey } from "./images";

/** The five chapters of the scroll-driven hero story. */
export type HeroPhase = {
  eyebrow: string;
  /** Heading lines before the accented last line. */
  title: string[];
  accent: string;
  desc: string;
  label: string;
  status: string;
  /** Prompt card copy; `\n` marks a line break. */
  prompt: string;
  product: string;
};

export const HERO_PHASES: HeroPhase[] = [
  {
    eyebrow: "AUTONOMOUS INTELLIGENCE",
    title: ["THINK.", "DECIDE."],
    accent: "ACT.",
    desc: "An intelligent agent that understands context, connects your tools, and turns intent into action.",
    label: "MEET YOUR AGENT",
    status: "SYSTEM ONLINE",
    prompt: "OBSERVING CONTEXT...\nUNDERSTANDING YOUR INTENT.",
    product: "READY TO ACT",
  },
  {
    eyebrow: "02 / UNDERSTAND",
    title: ["CONTEXT.", "MEMORY."],
    accent: "INTENT.",
    desc: "It sees the whole picture. Your goals, your knowledge, your working context — connected into a useful understanding.",
    label: "A LITTLE MORE UNDERSTANDING",
    status: "MEMORY ACTIVE",
    prompt: "READING CONTEXT...\nCONNECTING WHAT MATTERS.",
    product: "PERCEPTION ONLINE",
  },
  {
    eyebrow: "03 / THINK",
    title: ["REASON.", "PLAN."],
    accent: "ADAPT.",
    desc: "Behind those eyes, a coordinated system turns a complex intention into a considered, actionable plan.",
    label: "INSIDE THE INTELLIGENCE",
    status: "REASONING",
    prompt: "EVALUATING POSSIBILITIES...\nPLANNING THE NEXT ACTION.",
    product: "NEURAL CORE ACTIVE",
  },
  {
    eyebrow: "04 / ACT",
    title: ["CONNECT.", "EXECUTE."],
    accent: "DELIVER.",
    desc: "Your agent chooses the right tools, carries out each step, and brings the result back to you. With clear boundaries, all the way.",
    label: "FROM INTENT TO ACTION",
    status: "EXECUTING TASK",
    prompt: "REQUEST → PLAN → TOOLS\nEXECUTE → REPORT",
    product: "ACTION IN PROGRESS",
  },
  {
    eyebrow: "05 / AGENT NETWORK",
    title: ["ONE INTENT.", "MANY"],
    accent: "AGENTS.",
    desc: "Personal, code, and design. Specialized agents share context and work as one coordinated team.",
    label: "INTELLIGENCE, WORKING TOGETHER",
    status: "AGENTS CONNECTED",
    prompt: "COORDINATING SPECIALISTS...\nSHARING CONTEXT & RESULTS.",
    product: "NETWORK ACTIVE",
  },
];

export const STORY_STAGES = ["MEET", "UNDERSTAND", "THINK", "ACT", "CONNECT"];

/** BSC token launched on flap.sh. This is the token contract. */
export const TOKEN_CA = {
  symbol: "BERNIE",
  chain: "BSC",
  address: "0xd7ae9dc23d2e261454f548388d631bdff6a27777",
  flap: "https://flap.sh/bnb/0xd7ae9dc23d2e261454f548388d631bdff6a27777",
};

/** Capability chips around the hero robot: [reaction key, label, phase to jump to]. */
export const HERO_ANNOTATIONS: [string, string, number][] = [
  ["memory", "MEMORY", 1],
  ["reasoning", "REASONING", 2],
  ["tools", "TOOLS", 3],
  ["agents", "AGENTS", 4],
];

export const USE_CASES: { code: string; label: string; lines: string[] }[] = [
  {
    code: "A1",
    label: "DISCOVER & UNDERSTAND",
    lines: ["An agent that remembers.", "A system that reasons.", "A partner that acts."],
  },
  {
    code: "A2",
    label: "BUILD & CREATE",
    lines: ["Intent becomes a plan.", "Tools become actions.", "You stay in control."],
  },
  {
    code: "A3",
    label: "CONNECT & SCALE",
    lines: ["Many specialized agents.", "Shared memory.", "One clear result."],
  },
];

/** [icon, name, included each day, additional use] */
export const PRICING: [string, string, string, string][] = [
  ["••", "Personal Agent", "24", "0.4"],
  ["⌘", "Code Agent", "12", "1.2"],
  ["✓", "Code Review", "8", "2.4"],
  ["⌁", "Planning Agent", "6", "1.6"],
  ["✳", "Design Agent", "32", "1.4"],
  ["◎", "Knowledge Explorer", "18", "0.8"],
  ["≋", "Research Agent", "OPEN", "0"],
  ["✓", "Guardian Agent", "OPEN", "0"],
];

export const PRICE_ICON_COLORS = ["#ff7629", "#e2cdbb", "#ff9a50", "#c9c3ba"];

export const PLANS: { name: string; price: string; detail: string }[] = [
  { name: "Explorer", price: "Complimentary", detail: "DAILY ALLOWANCES / COMMUNITY ACCESS" },
  { name: "Maker", price: "$24 / month", detail: "1,200 CREDITS / CREATIVE WORKSPACES" },
  { name: "Collective", price: "$74 / month", detail: "4,800 CREDITS / TEAM WORKSPACES" },
];

export type TeamMember = {
  name: string;
  role: string;
  category: "research" | "design" | "engineering";
  bio: string;
  portrait: ImageKey;
};

export const TEAM: TeamMember[] = [
  {
    name: "Ren Sato",
    role: "CO-FOUNDER / RESEARCH",
    category: "research",
    bio: "Ren explores the relationship between useful intelligence and human curiosity. His work brings research, context, and people into the same conversation.",
    portrait: "team_ren",
  },
  {
    name: "Mira Anand",
    role: "CREATIVE DIRECTOR",
    category: "design",
    bio: "Mira shapes the visual language and everyday experience of Humanfator. She believes complex ideas deserve clear, thoughtful design.",
    portrait: "team_mira",
  },
  {
    name: "Elias Brooks",
    role: "HEAD OF INFRASTRUCTURE",
    category: "engineering",
    bio: "Elias builds the foundations that help small ideas become reliable systems. He leads the development of the Agent OS compute experience.",
    portrait: "team_elias",
  },
  {
    name: "Clara Moreau",
    role: "PRODUCT ENGINEERING",
    category: "engineering",
    bio: "Clara turns research into tools that people enjoy using. She connects the details of an interface to the possibilities of the wider ecosystem.",
    portrait: "team_clara",
  },
];

export const TEAM_FILTERS: [string, string][] = [
  ["all", "EVERYONE"],
  ["research", "RESEARCH"],
  ["design", "DESIGN"],
  ["engineering", "ENGINEERING"],
];

export const FAQ_TABS = ["ABOUT HUMANFATOR", "ACCESS & CREDITS", "BUILDING TOGETHER"];

export const FAQ: [string, string][][] = [
  [
    [
      "What can I explore with Humanfator?",
      "Humanfator is a concept for a connected suite of intelligent tools: a research companion, a creative engine, a development workspace, and a coordinated agent ecosystem. This interactive experience lets you explore how those pieces fit together.",
    ],
    [
      "Where should I begin?",
      "Open the workspace and select a tool that matches your curiosity. The product panels explain Personal, Code, and Design agents.",
    ],
    [
      "Can I try the tools without an account?",
      "This recreation includes local demonstrations and product previews. It does not connect to a live AI service or require an account. The interface clearly identifies demonstration results.",
    ],
    [
      "How are the different products connected?",
      "The application layer brings together the tools you use. The reasoning layer creates a plan, the tool layer executes scoped actions, and specialized agents coordinate using shared context.",
    ],
    [
      "Who is this experience designed for?",
      "Curious individuals, creators, researchers, developers, and teams. Each product has a different purpose, with a shared visual language and a common starting point.",
    ],
    [
      "Can I use this website on my phone?",
      "Yes. The layout, galleries, diagrams, dialogs, and navigation adapt to smaller screens. Horizontal galleries also support touch scrolling.",
    ],
    [
      "Where can I learn about the project?",
      "Open Project credits in the footer for information about this independent concept, original visuals, and the libraries used.",
    ],
  ],
  [
    [
      "How does agent usage work?",
      "Credits provide a consistent way to describe usage across tools. The figures in this recreation are original illustrative values for exploring the agent workspace, with no connected billing service.",
    ],
    [
      "What is included in the starter experience?",
      "The starter experience includes a daily allowance for Personal, Code, and Design agents. The figures are illustrative, with no connected billing service.",
    ],
    [
      "Can I purchase a plan here?",
      "There is no billing service attached to this recreation. The plan dialog lets you compare the proposed options and explore their included features.",
    ],
    [
      "Can agents coordinate with one another?",
      "No wallet is involved. The network shows how specialized agents share context and coordinate a task.",
    ],
  ],
  [
    [
      "Can I build my own tools around Humanfator?",
      "The Code Agent presents how a project workspace could work. The local example illustrates the request structure, without making a live API call.",
    ],
    [
      "How can I join the collective?",
      "The community panels open an overview of each group. You can draft an introduction locally and copy it for your own use.",
    ],
    [
      "Is there a program for emerging teams?",
      "The Humanfator Collective describes a concept for mentorship, collaboration, and incubation. It is part of this fictional agent platform.",
    ],
    [
      "How do I get in touch?",
      "Use Say hello to prepare a message. This standalone site will help you copy the message, without sending personal information to an external service.",
    ],
  ],
];

export const POLICIES: Record<string, string> = {
  Privacy:
    "This standalone experience has no analytics, advertising scripts, tracking pixels, or account backend. Newsletter drafts can be stored locally in your browser. Contact messages remain on your device. Clear your browser storage to remove saved preferences.",
  Terms:
    "Humanfator is a fictional concept created as a website recreation. Product capabilities, partners, people, testimonials, dates, prices, and community figures are illustrative. Live inference, subscriptions, and community enrollment are not connected.",
  Accessibility:
    "This site supports keyboard navigation, visible focus, semantic landmarks, accessible dialogs, and reduced motion. A WebGL fallback preserves the visual content when available. Horizontal collections support touch and keyboard scrolling.",
  Attribution:
    "Independent Humanfator concept. The supplied screen recording informed the structure and visual direction. All branding, editorial copy, portraits, and article artwork are original. The interactive 3D models were constructed for this project. Rendering uses Three.js (MIT); styling uses compiled Tailwind CSS (MIT).",
};

export const COMMUNITIES: Record<string, string> = {
  "The Commons":
    "A community shaped by curiosity. Find people asking new questions and exploring what intelligence can make possible.",
  "The Workshop":
    "A gathering place for builders, designers, and independent teams to exchange ideas and develop something new.",
  "The Signal": "A stream of thoughtful updates, emerging ideas, and perspectives from the wider Humanfator collective.",
};
