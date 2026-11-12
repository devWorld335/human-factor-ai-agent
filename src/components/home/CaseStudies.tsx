import { useRef } from "react";
import { CASE_STUDIES } from "../../data/stories";
import { Carousel } from "../Carousel";
import { useSite } from "../siteContext";
import { StoryCard } from "../StoryCard";

export function CaseStudies() {
  const site = useSite();
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  // Written straight to the DOM so scrolling never re-renders the cards the engine has taken over.
  const onScroll = () => {
    const el = track.current;
    const card = el?.querySelector(".story-card");
    if (!el || !card || !counter.current) return;
    const index = Math.round(el.scrollLeft / card.getBoundingClientRect().width);
    counter.current.textContent = `${String(index + 1).padStart(2, "0")} / 06`;
  };

  return (
    <section id="case-studies" className="editorial-section" data-label="STORIES">
      <div className="section-heading">
        <h2 className="reveal">
          From intent
          <br />
          <span className="corner-bracket">to impact.</span>
        </h2>
        <button className="text-link" onClick={() => site.info("Stories from the collective")}>
          FROM THE COLLECTIVE <span>↗</span>
        </button>
      </div>
      <Carousel
        id="cases"
        label="Case studies"
        prevLabel="Previous case studies"
        nextLabel="Next case studies"
        trackRef={track}
        onScroll={onScroll}
        counter={
          <span className="mono counter" id="cases-counter" ref={counter}>
            01 / 06
          </span>
        }
      >
        {CASE_STUDIES.map((s) => (
          <StoryCard key={s.art} story={s} asset />
        ))}
      </Carousel>
    </section>
  );
}
