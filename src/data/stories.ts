import type { ImageKey } from "./images";

export type Story = {
  art: ImageKey;
  /** Title over the artwork; `\n` marks a line break. */
  title: string;
  summary: string;
  meta: string;
};

export const CASE_STUDIES: Story[] = [
  {
    art: "panther",
    title: "From question\nto clarity.",
    summary: "How an independent team connects research, planning, and action with specialized agents.",
    meta: "RESEARCH / CONTEXT TO KNOWLEDGE",
  },
  {
    art: "gyroscope",
    title: "A system\nthat takes initiative.",
    summary: "From a scattered brief to a coordinated workflow: a new way to move work forward.",
    meta: "WORKFLOW / PLAN TO ACTION",
  },
  {
    art: "token",
    title: "Less routine.\nMore possibility.",
    summary: "An operations agent handles the moving parts so a team can focus on its next decision.",
    meta: "OPERATIONS / TOOLS THAT WORK",
  },
  {
    art: "strata",
    title: "Less friction.\nMore flow.",
    summary: "How Strata creates room for faster experimentation across distributed teams.",
    meta: "STRATA / DEVELOPMENT",
  },
  {
    art: "creation",
    title: "Original minds.\nNew worlds.",
    summary: "Meet the artists finding an entirely new visual language inside Design Agent.",
    meta: "COLLECTIVE / CREATION",
  },
  {
    art: "network",
    title: "Better\nconnections.",
    summary: "Lumen is exploring what a more participatory intelligence network could become.",
    meta: "LUMEN / NETWORK",
  },
];

export const JOURNAL_TABS = ["journal", "films", "sessions"] as const;

export const JOURNAL: Story[][] = [
  [
    {
      art: "journal_context",
      title: "Intelligence,\nin context.",
      summary: "A field guide to connected thinking in an increasingly fragmented world.",
      meta: "SEPTEMBER 12, 2027 / PERSPECTIVES",
    },
    {
      art: "journal_agents",
      title: "One intent.\nMany agents.",
      summary: "Meet a coordinated team of research, design, code, data, and operations agents.",
      meta: "AUGUST 29, 2027 / NOTES",
    },
    {
      art: "journal_creation",
      title: "Make room\nfor the new.",
      summary: "Six experiments at the intersection of intelligence and imagination.",
      meta: "AUGUST 16, 2027 / CREATIVE PRACTICE",
    },
  ],
  [
    {
      art: "journal_studio",
      title: "Inside\nthe studio.",
      summary: "Film: a day with the people behind Design Agent.",
      meta: "STUDIO FILM / 04:32",
    },
    {
      art: "journal_architecture",
      title: "A closer\nconnection.",
      summary: "Film: visualizing the architecture of connected intelligence.",
      meta: "EXPLAINER / 03:18",
    },
    {
      art: "journal_spark",
      title: "From spark\nto network.",
      summary: "Film: meet the builders exploring the next frontier.",
      meta: "PORTRAITS / 06:24",
    },
  ],
  [
    {
      art: "journal_conversation",
      title: "An open\nconversation.",
      summary: "Session: designing a network around people.",
      meta: "LIVE SESSION / OCTOBER 09, 2027",
    },
    {
      art: "journal_prototype",
      title: "Under the\nsurface.",
      summary: "Session: from your first prompt to a working prototype.",
      meta: "BUILDERS SESSION / OCTOBER 21, 2027",
    },
    {
      art: "journal_unexpected",
      title: "Create\nunexpectedly.",
      summary: "Session: finding a new visual voice with intelligent tools.",
      meta: "CREATIVE SESSION / NOVEMBER 06, 2027",
    },
  ],
];
