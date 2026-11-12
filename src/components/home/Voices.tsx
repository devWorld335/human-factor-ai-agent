const QUOTES: [string, string, string][] = [
  [
    "We found the space to experiment, the tools to build, and a community ready to imagine what comes next.",
    "Alina Park",
    "FOUNDER, PRISM LAB",
  ],
  [
    "A complex research process became a clear conversation. That gave our team more time for the work that matters.",
    "Marcus Ellis",
    "RESEARCH LEAD, OPENFIELD",
  ],
  [
    "Connected intelligence feels different when every part of the experience has been designed to work together.",
    "Nadia Reyes",
    "DESIGN DIRECTOR, AERON",
  ],
];

const PRESS = ["Future Signals ↗", "NEURAL REVIEW ↗", "THE BUILDER ↗", "Digital Current ↗"];

export function Voices() {
  return (
    <section id="voices" className="voices-section" data-label="PERSPECTIVES">
      <div className="section-heading">
        <h2 className="reveal">
          Intent becomes <span className="corner-bracket">action.</span>
        </h2>
        <p>
          A new relationship
          <br />
          between people and intelligence.
        </p>
      </div>
      <div className="quotes-grid">
        {QUOTES.map(([quote, name, role]) => (
          <blockquote key={name}>
            <span className="quote">“</span>
            <p>{quote}</p>
            <footer>
              {name} <span>· {role}</span>
            </footer>
          </blockquote>
        ))}
      </div>
      <div className="press-strip">
        {PRESS.map((p) => (
          <span key={p}>{p}</span>
        ))}
      </div>
    </section>
  );
}
