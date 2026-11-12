import { PRICE_ICON_COLORS, PRICING } from "../../data/site";
import { useSite } from "../siteContext";

export function Pricing() {
  const site = useSite();
  return (
    <section id="pricing" className="pricing-section" data-label="PRICING">
      <div className="section-heading">
        <h2 className="reveal">
          Start with an intention.
          <br />
          <span className="corner-bracket">Let your agent work.</span>
        </h2>
        <p>
          Try the essentials on us.
          <br />
          Add credits when you need more.
        </p>
      </div>
      <div className="pricing-grid" id="pricing-grid">
        {PRICING.map(([icon, name, daily, extra], i) => (
          <article key={name} className="price-card">
            <div className="price-main">
              <span className="node-icon price-icon" style={{ color: PRICE_ICON_COLORS[i % 4] }}>
                {icon}
              </span>
              <h3>{name}</h3>
            </div>
            <div className="price-row">
              <span>▸ INCLUDED EACH DAY</span>
              <strong>{daily}</strong>
            </div>
            <div className="price-row">
              <span>▸ ADDITIONAL USE</span>
              <strong>{extra === "0" ? "COMPLIMENTARY" : `${extra} ◈`}</strong>
            </div>
          </article>
        ))}
      </div>
      <div className="center-action">
        <button className="wide-button mono" id="full-pricing" onClick={site.plans}>
          EXPLORE ALL PLANS <span>↗</span>
        </button>
      </div>
    </section>
  );
}
