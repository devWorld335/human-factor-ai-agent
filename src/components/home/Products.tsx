import { PRODUCTS } from "../../data/products";
import { useSite } from "../siteContext";
import { Lines, Scene } from "../ui";

/** Stacked, sticky product panels. Each one has its own 3D module rendered by the engine. */
export function Products() {
  const site = useSite();
  return (
    <section id="solutions" className="solutions" data-label="PRODUCTS">
      <div className="section-heading">
        <h2 className="reveal">
          Specialized agents.
          <br />
          <span className="corner-bracket">Shared intelligence.</span>
        </h2>
        <p>
          A specialist for every task.
          <br />A coordinated system for every ambition.
        </p>
      </div>
      <div id="products">
        {PRODUCTS.map((p, i) => (
          <article key={p.short} className="product" id={`product-${i}`}>
            <div className="product-copy">
              <span className="product-number">P{i + 1}</span>
              <h3 className="reveal">
                <Lines text={p.name} />
              </h3>
              <p>{p.desc}</p>
            </div>
            <div className="product-visual">
              <Scene model={p.model} className="product-scene" label={`Original 3D module for ${p.short}`} />
              <ul className="product-spec">
                {p.spec.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <div className="product-actions">
                <button onClick={() => site.product(i)}>
                  {p.ready ? `CREATE YOUR ${p.short.toUpperCase()}` : "COMING SOON"}
                  <span>↗</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
