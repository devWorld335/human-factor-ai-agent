import token from "../assets/images/token.webp";
import strata from "../assets/images/strata.webp";
import panther from "../assets/images/panther.webp";
import network from "../assets/images/network.webp";
import gyroscope from "../assets/images/gyroscope.webp";
import creation from "../assets/images/creation.webp";
import journal_unexpected from "../assets/images/journal_unexpected.webp";
import journal_studio from "../assets/images/journal_studio.webp";
import journal_spark from "../assets/images/journal_spark.webp";
import journal_prototype from "../assets/images/journal_prototype.webp";
import journal_creation from "../assets/images/journal_creation.webp";
import journal_conversation from "../assets/images/journal_conversation.webp";
import journal_context from "../assets/images/journal_context.webp";
import journal_architecture from "../assets/images/journal_architecture.webp";
import journal_agents from "../assets/images/journal_agents.webp";
import team_clara from "../assets/images/team_clara.webp";
import team_ren from "../assets/images/team_ren.webp";
import team_elias from "../assets/images/team_elias.webp";
import team_mira from "../assets/images/team_mira.webp";

export const IMAGES = {
  token,
  strata,
  panther,
  network,
  gyroscope,
  creation,
  journal_unexpected,
  journal_studio,
  journal_spark,
  journal_prototype,
  journal_creation,
  journal_conversation,
  journal_context,
  journal_architecture,
  journal_agents,
  team_clara,
  team_ren,
  team_elias,
  team_mira,
};

export type ImageKey = keyof typeof IMAGES;

/** Alt text for the editorial artwork. */
export const ARTWORK_ALT: Partial<Record<ImageKey, string>> = {
  panther: "Polished amethyst panther sculpture",
  gyroscope: "Precision platinum gyroscope with sapphire core",
  token: "Carved obsidian medallion with machined perimeter",
  strata: "Layered platinum and glass workflow sculpture",
  creation: "Swept titanium ribbons around a glass creative seed",
  network: "Silver network nodes and graphite connecting paths",
  journal_context: "Silver context lens and glass information prisms",
  journal_agents: "Six connected miniature agent instruments",
  journal_creation: "Platinum ribbon and spectral glass prism",
  journal_studio: "Exploded precision camera and optical lens",
  journal_architecture: "Open silver and glass intelligence architecture",
  journal_spark: "Silver branching conductors growing from a glass seed",
  journal_conversation: "Interlocking platinum dialogue forms",
  journal_prototype: "Layered graphite prototype and optical core",
  journal_unexpected: "Twisting silver sculpture and violet glass prism",
};

/** Static renders shown in each `.scene` when WebGL is unavailable. */
const fallbackFiles = import.meta.glob<string>("../assets/fallbacks/*.webp", {
  eager: true,
  import: "default",
});

export const SCENE_FALLBACKS: Record<string, string> = Object.fromEntries(
  Object.entries(fallbackFiles).map(([path, url]) => [path.split("/").pop()!.replace(".webp", ""), url]),
);
