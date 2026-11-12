import { useEffect } from "react";
import { PRODUCTS } from "../data/products";
import { Header } from "./Header";
import { SiteProvider } from "./site";

const CONTENTS = [
  ["overview", "Overview"],
  ["create", "Create an agent"],
  ["use", "Use an agent"],
  ["credits", "Credits"],
  ["kinds", "Agent kinds"],
  ["account", "Account"],
  ["privacy", "Privacy"],
  ["terms", "Terms of use"],
] as const;

export function Docs() {
  useEffect(() => {
    const previous = document.title;
    document.title = "How it works — Humanfator";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <SiteProvider>
      <a className="skip-link" href="#overview">
        Skip to content
      </a>
      <Header />
      <div className="docs-shell">
        <nav className="docs-nav" aria-label="Documentation">
          <p className="mono">Documentation</p>
          <ol>
            {CONTENTS.map(([id, label], index) => (
              <li key={id}>
                <a href={`#${id}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
          <a className="docs-nav-start" href="/signin">
            Open your account
          </a>
        </nav>
        <main id="docs" className="docs">
          <header className="docs-hero" id="overview">
            <p className="mono docs-kicker">How it works</p>
            <h1>Humanfator documentation</h1>
            <p>
              Create an agent and give it a job. Free has no credit limit. This page is the reference for that workflow.
            </p>
          </header>

          <section id="create" className="docs-section">
            <h2>Create an agent</h2>
            <p>An account keeps one Personal agent. Code and Design are coming soon.</p>
            <ol className="docs-list">
              <li>Sign in.</li>
              <li>Name the Personal agent and save it.</li>
              <li>Each conversation is kept in that agent’s chat history.</li>
            </ol>
            <p>The name is how you find the agent later. Open a past chat from the history to continue it.</p>
          </section>

          <section id="use" className="docs-section">
            <h2>Use an agent</h2>
            <p>Open the agent and state the job in plain language. It replies in that kind’s role.</p>
            <ul className="docs-list">
              <li>Personal Agent keeps each conversation in the chat history.</li>
              <li>Code Agent is coming soon.</li>
              <li>Design Agent is coming soon.</li>
            </ul>
            <p>Free does not spend credits. Pro, when it is available, spends one credit from that day’s balance.</p>
          </section>

          <section id="credits" className="docs-section">
            <h2>Credits</h2>
            <p>Credits apply to Pro. Free does not use them.</p>
            <div className="docs-table-wrap">
              <table className="docs-table">
                <caption className="sr-only">Free and Pro credit allowances</caption>
                <thead>
                  <tr>
                    <th scope="col">Plan</th>
                    <th scope="col">Allowance</th>
                    <th scope="col">When the balance is empty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Free</th>
                    <td>No credit limit.</td>
                    <td>Use continues.</td>
                  </tr>
                  <tr>
                    <th scope="row">Pro</th>
                    <td>5 credits each day.</td>
                    <td>Use stops until the next day.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>A Pro balance is shown with the agent. Pro is not available yet, so new agents stay on Free.</p>
          </section>

          <section id="kinds" className="docs-section">
            <h2>Agent kinds</h2>
            <p>Personal can be created now. Code and Design are coming soon.</p>
            <div className="docs-kinds">
              {PRODUCTS.map((product) => (
                <article key={product.short}>
                  <h3>
                    <span aria-hidden="true">{product.icon}</span>
                    {product.short}
                  </h3>
                  <p>{product.desc}</p>
                  <ul>
                    {product.spec.map((item) => (
                      <li key={item}>{item.toLowerCase()}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section id="account" className="docs-section">
            <h2>Account</h2>
            <p>An account holds your agents.</p>
            <ul className="docs-list">
              <li>Create an account with a username and a password of at least 8 characters.</li>
              <li>Google and Apple sign-in appear when the server has those keys configured.</li>
              <li>The session stays on this browser. Signing out ends it.</li>
            </ul>
            <p>
              <a className="docs-inline" href="/signin">
                Sign in
              </a>{" "}
              to create an agent, or{" "}
              <a className="docs-inline" href="/signup">
                create an account
              </a>
              .
            </p>
          </section>

          <section id="privacy" className="docs-section">
            <h2>Privacy</h2>
            <p>An account stores only what the product needs to sign you in and keep your agents.</p>
            <ul className="docs-list">
              <li>A username, the sign-in method, and a password hash when you use a password.</li>
              <li>The messages you exchange with an agent.</li>
              <li>A session cookie that stays in the browser until you sign out or it expires.</li>
            </ul>
            <p>
              Google or Apple receives the sign-in only if you choose that method and the server has their keys.
              Humanfator does not sell account data.
            </p>
          </section>

          <section id="terms" className="docs-section">
            <h2>Terms of use</h2>
            <p>Using Humanfator means you accept these terms.</p>
            <ul className="docs-list">
              <li>You need an account to create and use agents.</li>
              <li>Free does not use a credit limit. Pro, when available, allows 5 credits a day.</li>
              <li>You are responsible for the jobs you give an agent.</li>
              <li>The service can refuse a request that breaks the law or these terms.</li>
            </ul>
            <p>The token address in the footer is virtual until a contract is issued.</p>
          </section>
        </main>
      </div>
    </SiteProvider>
  );
}
