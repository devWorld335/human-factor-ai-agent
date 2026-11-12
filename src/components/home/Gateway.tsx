import { useState } from "react";
import { PRODUCTS } from "../../data/products";
import { USE_CASES } from "../../data/site";
import { Lines, Scene } from "../ui";

export function Gateway() {
  const [use, setUse] = useState(0);
  return (
    <section id="gateway" className="gateway" data-label="OVERVIEW">
      <div className="use-tabs mono" role="tablist" aria-label="Explore use cases">
        {USE_CASES.map((u, i) => (
          <button key={u.code} role="tab" aria-selected={use === i} onClick={() => setUse(i)}>
            {u.code} <span>{u.label}</span>
          </button>
        ))}
      </div>
      <div className="gateway-body">
        <h2 className="reveal">
          A little initiative.
          <br />
          <span className="corner-bracket">A lot more possible.</span>
        </h2>
        <Scene model="portrait" className="gateway-scene" label="Close portrait of the ceramic Humanfator character" />
        <p id="use-description">
          <Lines text={USE_CASES[use].lines.join("\n")} />
        </p>
      </div>
      <div className="awards">
        <span className="mono">AGENTS</span>
        {PRODUCTS.map((product) => (
          <div key={product.short}>
            {product.icon} {product.short}
            <small>{product.spec[0]}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
