import { useEffect, useRef, useState } from "react";
import { stage } from "../../engine/stage";
import { HERO_ANNOTATIONS, HERO_PHASES, STORY_STAGES, TOKEN_CA } from "../../data/site";
import { prefersReducedMotion, scrollBehavior } from "../../hooks/useReducedMotion";
import { useSite } from "../siteContext";
import { Scene } from "../ui";

/** Hover/focus props that tell the robot which capability the pointer is on. */
const react = (key: string) => ({
  onPointerEnter: () => (stage.reaction = key),
  onPointerLeave: () => (stage.reaction = ""),
  onFocus: () => (stage.reaction = key),
  onBlur: () => (stage.reaction = ""),
});

/**
 * The pinned, scroll-driven intro. Scrolling through the tall track moves the story from 0 to 4;
 * the engine reads `stage.storyProgress` to zoom into the robot, explode it and fan out the network.
 */
export function Hero() {
  const site = useSite();
  const track = useRef<HTMLElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const [phase, setPhase] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = track.current;
      if (el) {
        const span = el.offsetHeight - innerHeight;
        const scrolled = span > 0 ? Math.max(0, Math.min(1, scrollY / span)) * 4 : 0;
        const t = stage.capturePhase !== undefined ? stage.capturePhase : scrolled;
        stage.storyProgress = t;
        setPhase(Math.min(4, Math.floor(t + 0.4)));
        if (progressBar.current) progressBar.current.style.width = (t / 4) * 100 + "%";
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    document.body.dataset.agentPhase = String(phase);
    if (!prefersReducedMotion() && !stage.capture) {
      title.current?.animate(
        [
          { opacity: 0.45, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 420, easing: "cubic-bezier(.2,.6,0,1)" },
      );
    }
  }, [phase]);

  const jump = (to: number) => {
    if (prefersReducedMotion()) {
      stage.capturePhase = to;
      setPhase(to);
      return;
    }
    const span = (track.current?.offsetHeight ?? 0) - innerHeight;
    scrollTo({ top: span * (to / 4), behavior: scrollBehavior() });
  };

  const copyAddress = () => {
    const text = TOKEN_CA.address;
    const done = () => {
      setCopied(true);
      site.toast("Address copied.");
      window.setTimeout(() => setCopied(false), 1600);
    };
    const fallback = () => {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      if (ok) done();
    };
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(text).then(done, fallback);
      return;
    }
    fallback();
  };

  const p = HERO_PHASES[phase];

  return (
    <section id="intro" ref={track} className="hero-track agent-story" data-label="HUMANFATOR">
      <div className="hero-sticky">
        <div className="agent-story-grid" aria-hidden="true" />
        <div className="hero-wiring">
          <div className="prompt-card">
            <span className="quote">CA</span>
            <button
              className="prompt-copy prompt-ca mono"
              type="button"
              id="prompt-copy"
              title="Copy the contract address"
              onClick={copyAddress}
            >
              <small>
                {TOKEN_CA.chain} · ${TOKEN_CA.symbol}
              </small>
              {TOKEN_CA.address}
            </button>
          </div>
          <div className="prompt-sub mono">{copied ? "ADDRESS COPIED" : "SELECT THE ADDRESS TO COPY"}</div>
          <div className="analysis-label mono">
            <span className="pulse-dot" /> AGENT STATUS — ACTIVE<strong id="prompt-product">{p.product}</strong>
          </div>
          <ul className="hero-spec mono">
            <li>
              TOOLS CONNECTED <b>12</b>
            </li>
            <li>
              MEMORY <b>ACTIVE</b>
            </li>
            <li>
              CONFIDENCE <b>97.4%</b>
            </li>
            <li>
              ACTION <b>READY</b>
            </li>
          </ul>
          <svg className="wires" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="wireGradient">
                <stop stopColor="#ff6a1a" />
                <stop offset=".65" stopColor="#8e431e" />
                <stop offset="1" stopColor="#29201b" />
              </linearGradient>
            </defs>
            <path d="M20 45H185L215 12H725L745 32V105H960" />
            <path className="data-flow" d="M20 45H185L215 12H725L745 32V105H960" />
            <path d="M55 153H610L640 180H990" />
          </svg>
        </div>
        <Scene
          model="robot"
          className="hero-scene"
          label="Humanfator: a rounded warm-white ceramic robot with enormous orange digital eyes and an illuminated chest core"
        />
        <div className="hero-title">
          <p className="mono" id="story-eyebrow">
            {p.eyebrow}
          </p>
          <h1 id="story-title" ref={title}>
            {p.title[0]}
            <br /> {p.title[1]}
            <br /> <span>{p.accent}</span>
          </h1>
          <p className="story-description" id="story-description">
            {p.desc}
          </p>
          <button className="agent-cta" onClick={site.launch} {...react("cta")}>
            EXPLORE YOUR AGENTS <span>↗</span>
          </button>
        </div>
        <div className="scene-annotations" aria-label="Agent capabilities">
          {HERO_ANNOTATIONS.map(([key, label, to]) => (
            <button key={key} onClick={() => jump(to)} {...react(key)}>
              {label} <i>↗</i>
            </button>
          ))}
        </div>
        <div className="phase-panel mono" id="phase-panel">
          <span className="phase-number">{String(phase + 1).padStart(2, "0")} / 05</span>
          <span className="phase-label">{p.label}</span>
          <span className="phase-status">
            <i /> {p.status}
          </span>
        </div>
        <div className="story-stages" role="tablist" aria-label="Agent story chapters">
          {STORY_STAGES.map((name, i) => (
            <button key={name} role="tab" aria-selected={phase === i} onClick={() => jump(i)}>
              <small>{String(i + 1).padStart(2, "0")}</small> {name}
            </button>
          ))}
        </div>
        <div className="exploded-labels" aria-hidden="true">
          <span>PERCEPTION</span>
          <span>MEMORY</span>
          <span>REASONING ENGINE</span>
          <span>NEURAL CORE</span>
          <span>TOOL ROUTER</span>
          <span>PLANNING ENGINE</span>
        </div>
        <div className="agent-network-labels" aria-hidden="true">
          <span>RESEARCH</span>
          <span>DESIGN</span>
          <span>CODE</span>
          <span>DATA</span>
          <span>OPERATIONS</span>
        </div>
        <div className="hero-progress" ref={progressBar} />
      </div>
    </section>
  );
}
