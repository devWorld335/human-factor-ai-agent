import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ECOSYSTEM } from "../data/ecosystem";
import { IMAGES } from "../data/images";
import { PRODUCTS } from "../data/products";
import { COMMUNITIES, PLANS, POLICIES, TEAM } from "../data/site";
import { scrollBehavior } from "../hooks/useReducedMotion";
import { SECTIONS } from "./sections";
import { SiteContext, useSite, type Site } from "./siteContext";
import { titleCase } from "./text";

export function SiteProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<Element | null>(null);
  const [content, setContent] = useState<ReactNode>(null);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);

  const openModal = useCallback((next: ReactNode) => {
    const el = dialog.current!;
    returnFocus.current = document.activeElement;
    setContent(next);
    if (!el.open) {
      el.showModal();
      document.body.style.overflow = "hidden";
    }
    closeButton.current?.focus();
  }, []);

  const closeModal = useCallback(() => {
    dialog.current?.close();
    document.body.style.overflow = "";
    (returnFocus.current as HTMLElement | null)?.focus?.();
  }, []);

  const toast = useCallback((message: string) => {
    setToastText(message);
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastVisible(false), 3500);
  }, []);

  const site = useMemo<Site>(() => {
    const s: Site = {
      openModal,
      closeModal,
      toast,
      launch: () => openModal(<LaunchModal />),
      product: (i) => openModal(<ProductModal index={i} />),
      demo: (i) => openModal(<DemoModal key={`demo-${i}-${Date.now()}`} index={i} />),
      contact: () => openModal(<ContactModal key={`contact-${Date.now()}`} />),
      bio: (i) => {
        const m = TEAM[i];
        openModal(
          <>
            <p className="eyebrow">{m.role}</p>
            <h2>{m.name}</h2>
            <p>{m.bio}</p>
            <p className="mono">FICTIONAL TEAM PROFILE / ORIGINAL AI-GENERATED PORTRAIT</p>
          </>,
        );
      },
      node: (layer, index) => {
        const l = ECOSYSTEM[layer];
        const [, label] = l.nodes[index];
        openModal(
          <>
            <p className="eyebrow">
              L{layer + 1} / {l.title.toUpperCase()}
            </p>
            <h2>{titleCase(label)}</h2>
            <p>
              This connection brings {label.toLowerCase()} into the wider Humanfator ecosystem. It is part of the{" "}
              {l.title.toLowerCase()}, linking useful tools with shared infrastructure and the people who build on it.
            </p>
            <button className="outline-button" onClick={() => s.launch()}>
              EXPLORE THE WORKSPACES ↗
            </button>
          </>,
        );
      },
      story: (story) =>
        openModal(
          <>
            <p className="eyebrow">{story.meta}</p>
            <h2>{story.title.replace("\n", " ")}</h2>
            <img
              src={IMAGES[story.art]}
              alt="Original editorial illustration"
              style={{ width: "100%", marginBottom: 24 }}
            />
            <p>{story.summary}</p>
            <p>
              This fictional editorial story explores how small teams can connect research, creativity, and intelligent
              tools. It begins with a focused experiment, gives people room to learn, and develops the most promising
              idea through collaboration.
            </p>
            <p className="mono">HUMANFATOR JOURNAL / CONCEPT STORY</p>
          </>,
        ),
      community: (name) =>
        openModal(
          <>
            <p className="eyebrow">A PLACE FOR YOUR NEXT CHAPTER</p>
            <h2>{name}</h2>
            <p>{COMMUNITIES[name] ?? COMMUNITIES["The Commons"]}</p>
            <p>This community is part of the fictional Humanfator concept. Prepare an introduction to explore the contact experience.</p>
            <button className="outline-button" onClick={() => s.contact()}>
              PREPARE AN INTRODUCTION ↗
            </button>
          </>,
        ),
      info: (title) =>
        openModal(
          <>
            <p className="eyebrow">THE CONNECTED ECOSYSTEM</p>
            <h2>{title}</h2>
            <p>
              Explore the people, tools, and possibilities behind the Humanfator concept. Every connection is a starting
              point for a more useful, thoughtful intelligence experience.
            </p>
            <div className="modal-options">
              <button onClick={() => s.launch()}>Explore workspaces ↗</button>
              <button onClick={() => s.contact()}>Start a conversation ↗</button>
            </div>
          </>,
        ),
      policy: (name) =>
        openModal(
          <>
            <h2>{name}</h2>
            <p>{POLICIES[name]}</p>
          </>,
        ),
      plans: () =>
        openModal(
          <>
            <p className="eyebrow">ROOM FOR EVERY KIND OF CURIOSITY</p>
            <h2>Find your starting point.</h2>
            <p>Illustrative plans for the Humanfator concept. No purchases or payment collection are available.</p>
            <div className="modal-options">
              {PLANS.map((p) => (
                <button key={p.name} onClick={() => s.plan(p.name)}>
                  {p.name} · {p.price}
                  <small>{p.detail}</small>
                </button>
              ))}
              <button onClick={() => s.contact()}>
                Build with us<small>PREPARE A TEAM INTRODUCTION ↗</small>
              </button>
            </div>
          </>,
        ),
      plan: (name) =>
        openModal(
          <>
            <p className="eyebrow">YOUR STARTING POINT</p>
            <h2>{name}</h2>
            <p>You have selected the {name.toLowerCase()} concept plan. This preview includes no billing or purchase process.</p>
            <button className="outline-button" onClick={() => s.launch()}>
              EXPLORE THE INCLUDED TOOLS ↗
            </button>
          </>,
        ),
      sectionIndex: () =>
        openModal(
          <>
            <p className="eyebrow">EXPLORE THE EXPERIENCE</p>
            <h2>A connected world.</h2>
            <div className="modal-options">
              {SECTIONS.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => {
                    closeModal();
                    document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior() });
                  }}
                >
                  {label} ↗
                </button>
              ))}
            </div>
          </>,
        ),
    };
    return s;
  }, [openModal, closeModal, toast]);

  useEffect(() => {
    const el = dialog.current!;
    const onCancel = () => {
      document.body.style.overflow = "";
      (returnFocus.current as HTMLElement | null)?.focus?.();
    };
    const onClick = (e: MouseEvent) => {
      if (e.target !== el) return;
      const r = el.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeModal();
    };
    el.addEventListener("cancel", onCancel);
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("cancel", onCancel);
      el.removeEventListener("click", onClick);
    };
  }, [closeModal]);

  return (
    <SiteContext.Provider value={site}>
      {children}
      <dialog id="modal" ref={dialog}>
        <div className="modal-top mono">
          <span>HUMANFATOR / EXPLORE</span>
          <button id="close-modal" ref={closeButton} aria-label="Close dialog" onClick={closeModal}>
            ×
          </button>
        </div>
        <div id="modal-content">{content}</div>
      </dialog>
      <div className={`toast${toastVisible ? " visible" : ""}`} role="status" id="toast">
        {toastText}
      </div>
    </SiteContext.Provider>
  );
}

function LaunchModal() {
  const site = useSite();
  return (
    <>
      <p className="eyebrow">MY AGENTS</p>
      <h2>Explore your agents.</h2>
      <p>Personal is open. Code and Design are coming soon.</p>
      <div className="modal-options">
        {PRODUCTS.map((p, i) => (
          <button key={p.short} onClick={() => site.product(i)}>
            {p.icon} &nbsp; {p.short}
            <small>{p.ready ? "FREE" : "SOON"}</small>
          </button>
        ))}
      </div>
    </>
  );
}

function ProductModal({ index }: { index: number }) {
  const p = PRODUCTS[index];
  return (
    <>
      <p className="eyebrow">P{index + 1} / THE INTELLIGENCE SUITE</p>
      <h2>{p.short}</h2>
      <p>{p.desc}</p>
      <p className="mono">{p.ready ? `FREE · ${p.offer}` : p.offer}</p>
      <ul className="modal-spec">
        {p.spec.map((s) => (
          <li key={s} className="mono" style={{ padding: "10px 0", borderBottom: "1px solid #302039", color: "#b09bc0" }}>
            ↗ {s}
          </li>
        ))}
      </ul>
      {p.ready && (
        <div className="center-action" style={{ padding: "25px 0 0" }}>
          <a className="wide-button" href="/signup?agent=personal">
            CREATE AGENT <span>↗</span>
          </a>
        </div>
      )}
    </>
  );
}

function DemoModal({ index }: { index: number }) {
  const p = PRODUCTS[index];
  const [question, setQuestion] = useState<string | null>(null);
  return (
    <>
      <p className="eyebrow">LOCAL DEMONSTRATION / NO LIVE AI CONNECTION</p>
      <h2>{p.short}</h2>
      <p>Try an idea to see how this workspace is arranged. The response below is a prepared example.</p>
      <form
        id="demo-form"
        className="modal-form"
        onSubmit={(e) => {
          e.preventDefault();
          setQuestion(String(new FormData(e.currentTarget).get("idea") ?? ""));
        }}
      >
        <label>
          Your idea
          <input id="demo-input" name="idea" required placeholder="What would you like to explore?" maxLength={500} />
        </label>
        <button className="outline-button" type="submit">
          EXPLORE THE EXAMPLE ↗
        </button>
      </form>
      <div id="demo-result" role="status">
        {question !== null && (
          <>
            <p className="eyebrow" style={{ marginTop: 25 }}>
              PREPARED EXAMPLE
            </p>
            <p className="demo-question">Your starting point: {question}</p>
            <p>
              Begin with a clear objective. Gather a few reliable inputs, explore the connections between them, and turn
              the most useful insight into a small next step. Your workspace keeps the research, decisions, and next
              actions together.
            </p>
          </>
        )}
      </div>
    </>
  );
}

function ContactModal() {
  const site = useSite();
  const [message, setMessage] = useState<string | null>(null);
  const output = useRef<HTMLTextAreaElement>(null);
  return (
    <>
      <p className="eyebrow">A CONVERSATION STARTS WITH AN IDEA</p>
      <h2>What are you imagining?</h2>
      <p>Prepare your introduction below. Your message stays on this device and can be copied when you are ready.</p>
      <form
        className="modal-form"
        id="contact-form"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          setMessage(`Hello Humanfator,\n\n${f.get("message")}\n\n${f.get("name")}\n${f.get("email")}`);
        }}
      >
        <label>
          Your name
          <input name="name" autoComplete="name" required maxLength={100} />
        </label>
        <label>
          Email address
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Your idea
          <textarea name="message" required maxLength={5000} placeholder="Tell us a little about what you have in mind…" />
        </label>
        <button type="submit" className="outline-button">
          PREPARE MY MESSAGE ↗
        </button>
      </form>
      <div id="contact-result" role="status">
        {message !== null && (
          <>
            <p style={{ marginTop: 20 }}>Your message is ready. Nothing has been sent.</p>
            <textarea
              ref={output}
              readOnly
              aria-label="Your prepared message"
              value={message}
              style={{
                width: "100%",
                minHeight: 140,
                background: "#08050c",
                color: "#d4c3df",
                border: "1px solid #4c345b",
                padding: 12,
              }}
            />
            <button
              className="outline-button"
              id="copy-message"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(message);
                  site.toast("Message copied.");
                } catch {
                  output.current?.select();
                  site.toast("Select and copy the prepared message.");
                }
              }}
            >
              COPY MESSAGE ↗
            </button>
          </>
        )}
      </div>
    </>
  );
}
