import { useRef, useState } from "react";
import { JOURNAL, JOURNAL_TABS } from "../../data/stories";
import { Carousel } from "../Carousel";
import { useSite } from "../siteContext";
import { StoryCard } from "../StoryCard";

export function Journal() {
  const site = useSite();
  const [tab, setTab] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  return (
    <section id="journal" className="editorial-section journal" data-label="JOURNAL">
      <div className="section-heading">
        <div>
          <p className="eyebrow">FIELD NOTES / AUTONOMOUS INTELLIGENCE</p>
          <h2>Explore our</h2>
          <div className="journal-tabs" role="tablist" aria-label="Journal categories">
            {JOURNAL_TABS.map((name, i) => (
              <button
                key={name}
                role="tab"
                aria-selected={tab === i}
                onClick={() => {
                  setTab(i);
                  if (track.current) track.current.scrollLeft = 0;
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <button className="text-link" onClick={() => site.info("The Humanfator journal")}>
          ALL TRANSMISSIONS <span>↗</span>
        </button>
      </div>
      <Carousel
        id="articles"
        label="Journal articles"
        prevLabel="Previous articles"
        nextLabel="Next articles"
        trackRef={track}
      >
        {JOURNAL[tab].map((s) => (
          <StoryCard key={s.art} story={s} asset={false} />
        ))}
      </Carousel>
    </section>
  );
}
