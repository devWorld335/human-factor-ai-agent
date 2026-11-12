import { useSite } from "../siteContext";
import { Scene } from "../ui";

const FEATURES = [
  "COORDINATED AUTONOMY",
  "SHARED CONTEXT & MEMORY",
  "SPECIALIST AGENT ROUTING",
  "HUMAN APPROVAL CONTROLS",
  "PARALLEL TASK EXECUTION",
  "ONE CLEAR RESULT",
];

const PARTNERS = ["⌘ vertex", "✺ OpenRelay", "⟐ PRISM", "◇ CONNECT", "∿ auric"];

export function Network() {
  const site = useSite();
  return (
    <section id="network" className="token-section" data-label="NETWORK">
      <div className="token-title">
        <p className="eyebrow">MANY AGENTS. ONE SHARED INTENT.</p>
        <h2 className="rainbow-bracket">
          BETTER.
          <br />
          TOGETHER.
        </h2>
        <p>
          Research. Design. Code. Data. Operations.
          <br />
          Specialists that think and act together.
        </p>
        <button className="outline-button" onClick={() => site.info("The Humanfator network")}>
          DISCOVER THE NETWORK ↗
        </button>
      </div>
      <Scene model="network" className="token-scene" label="A coordinated network of specialized ceramic AI agents" />
      <ul className="token-features mono">
        {FEATURES.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <div className="exchange-strip mono">
        <span>EXPLORE WITH</span>
        <button onClick={() => site.info("Workflow integrations")}>
          ◇ CONNECT <small>NETWORK</small> ↗
        </button>
        <button onClick={() => site.info("Connected tools")}>
          ◈ WORKFLOWS <small>COMMUNITY</small> ↗
        </button>
      </div>
      <div className="partner-ticker">
        {PARTNERS.map((p) => (
          <span key={p}>{p}</span>
        ))}
      </div>
    </section>
  );
}
