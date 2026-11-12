import { useState } from "react";
import { FAQ, FAQ_TABS } from "../../data/site";
import { useSite } from "../siteContext";

export function Faq() {
  const site = useSite();
  const [tab, setTab] = useState(0);
  return (
    <section id="faq" className="faq-section" data-label="ANSWERS">
      <div className="section-heading">
        <h2 className="reveal">
          A little more
          <br />
          <span className="corner-bracket">clarity.</span>
        </h2>
        <p>
          Still wondering about something?
          <br />
          <button className="inline-link" onClick={site.contact}>
            Start a conversation.
          </button>
        </p>
      </div>
      <div className="faq-body">
        <div className="faq-tabs mono" role="tablist" aria-label="Question topics">
          {FAQ_TABS.map((name, i) => (
            <button key={name} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>
              {name}
            </button>
          ))}
        </div>
        <div id="faq-list" key={tab}>
          {FAQ[tab].map(([q, a]) => (
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
