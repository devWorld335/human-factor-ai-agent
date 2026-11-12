import { Scene } from "../ui";

const SPACES: [string, string, string][] = [
  ["The Commons", "EXPLORE THE AGENT COMMUNITY", "BUILD WITH INTELLIGENCE"],
  ["The Workshop", "BUILD SOMETHING TOGETHER", "CONNECT YOUR TOOLS"],
  ["The Signal", "FOLLOW THE CONVERSATION", "IDEAS IN MOTION"],
  ["Say hello", "TELL US WHAT'S NEXT", "LET'S CONNECT"],
];

export function Community() {
  return (
    <section id="community" className="community-section" data-label="CONNECT">
      <div className="community-grid">
        {SPACES.map(([name, kicker, tag]) => (
          <div key={name}>
            <small>{kicker}</small>
            <span>{name}</span>
            <em>{tag}</em>
          </div>
        ))}
      </div>
      <Scene model="head" className="community-scene" label="Rounded Humanfator portrait with luminous orange eyes" />
    </section>
  );
}
