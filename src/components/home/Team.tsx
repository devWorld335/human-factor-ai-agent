import { useRef, useState } from "react";
import { IMAGES } from "../../data/images";
import { TEAM, TEAM_FILTERS } from "../../data/site";
import { Carousel } from "../Carousel";
import { useSite } from "../siteContext";

const PARTNERS: [string, string][] = [
  ["COMPUTE", "◈ HYPERION"],
  ["PROTOCOL", "✳ lumen"],
  ["RESEARCH", "⠿ Openfield"],
  ["INFRASTRUCTURE", "◒ Strata Cloud"],
  ["NETWORK", "≋ AERON"],
  ["CREATOR TOOLS", "⌘ polaris"],
];

export function Team() {
  const site = useSite();
  const [filter, setFilter] = useState("all");
  const track = useRef<HTMLDivElement>(null);

  return (
    <section id="team" className="team-section" data-label="PEOPLE">
      <div className="section-heading">
        <h2 className="reveal">
          <span className="corner-bracket">Human ambition.</span>
          <br />
          Intelligent initiative.
        </h2>
        <p>
          Meet the thinkers, makers, and explorers
          <br />
          bringing the next chapter to life.
        </p>
      </div>
      <div className="team-filters mono">
        <span>COLLECTIVE</span>
        <div role="tablist" aria-label="Filter the team">
          {TEAM_FILTERS.map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={filter === key}
              onClick={() => {
                setFilter(key);
                if (track.current) track.current.scrollLeft = 0;
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <Carousel
        id="team-cards"
        label="Team profiles"
        prevLabel="Previous team members"
        nextLabel="Next team members"
        trackRef={track}
      >
        {TEAM.map((m, i) => (
          <article
            key={m.name}
            className="team-card"
            data-category={m.category}
            hidden={filter !== "all" && m.category !== filter}
          >
            <div className="team-card-top">
              {m.name.toUpperCase()}
              <span>V / {m.category.toUpperCase()}</span>
            </div>
            <div className="portrait-frame">
              <div className="portrait-inner">
                <div
                  className="portrait"
                  role="img"
                  aria-label={`AI-generated fictional portrait of ${m.name}`}
                  style={{ backgroundImage: `url('${IMAGES[m.portrait]}')` }}
                />
              </div>
            </div>
            <div className="team-card-bottom">
              <span>{m.role}</span>
              <button aria-label={`Read ${m.name}'s biography`} onClick={() => site.bio(i)}>
                +
              </button>
            </div>
          </article>
        ))}
      </Carousel>
      <div className="team-bottom mono">
        <button onClick={() => site.info("Meet the collective")}>THE COLLECTIVE [18] ↗</button>
        <button onClick={() => site.info("Our advisors")}>ADVISORS &amp; COLLABORATORS [7] ↗</button>
      </div>
      <div className="partner-heading mono">
        <span>CONNECTED BY POSSIBILITY [126]</span>
        <button onClick={() => site.info("Ecosystem partners")}>EXPLORE PARTNERS ↗</button>
      </div>
      <div className="partner-grid">
        {PARTNERS.map(([kind, name]) => (
          <div key={kind}>
            <small>{kind}</small>
            <span>{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
