import { Fragment } from "react";
import { ECOSYSTEM, wirePath } from "../../data/ecosystem";

/** Four stacked architecture layers, each a node diagram wired to its hub. */
export function Ecosystem() {
  return (
    <section id="ecosystem" className="ecosystem-section" data-label="ECOSYSTEM">
      <div className="section-heading">
        <h2 className="reveal">
          Inside the <span className="corner-bracket">system.</span>
          <br />
          Behind every action.
        </h2>
        <p>
          Context, reasoning, tools, and memory.
          <br />
          One architecture. Coordinated action.
        </p>
      </div>
      <div id="ecosystem-layers">
        {ECOSYSTEM.map((layer, li) => (
          <article key={layer.title} className="ecosystem-layer" style={{ zIndex: 5 + li }}>
            <div className="layer-label">
              LAYER <span>L{li + 1}</span>
            </div>
            <div className="layer-content">
              <h3>{layer.title}</h3>
              <div className="network-diagram">
                <svg className="network-wires" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
                  {layer.positions.map((_, n) => {
                    const d = wirePath(layer, n);
                    return (
                      d && (
                        <Fragment key={n}>
                          <path d={d} />
                          <path className="signal-path" style={{ animationDelay: `-${n * 1.7}s` }} d={d} />
                        </Fragment>
                      )
                    );
                  })}
                </svg>
                {layer.nodes.map(([icon, label], n) => (
                  <div
                    key={label}
                    className="network-node"
                    style={{ left: `${layer.positions[n][0]}%`, top: `${layer.positions[n][1]}%` }}
                  >
                    <span className="node-icon">{icon}</span>
                    <span className="node-name">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
