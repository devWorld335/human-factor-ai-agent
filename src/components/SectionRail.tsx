import { useEffect, useState } from "react";
import { SECTIONS, sectionLabel } from "./sections";
import { useSite } from "./siteContext";

/** Fixed rail on the side of the page: one dot per section and the current section's name. */
export function SectionRail() {
  const site = useSite();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-20% 0px -65% 0px" },
    );
    SECTIONS.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <aside className="section-rail" aria-label="Page sections">
      <div className="rail-dots">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-label={`Go to ${label}`} className={active === id ? "active" : undefined} />
        ))}
      </div>
      <span id="section-name">{active ? sectionLabel(active) : "INTRO"}</span>
      <button id="rail-menu" aria-label="Open section navigation" onClick={site.sectionIndex}>
        <span>≋</span>INDEX
      </button>
    </aside>
  );
}
