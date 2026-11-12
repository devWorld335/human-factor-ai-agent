import type { ReactElement } from "react";
import { PRODUCTS } from "../../data/products";
import { useTokenCa } from "../../hooks/useTokenCa";
import { useSite } from "../siteContext";

const EXPLORE: [string, string][] = [["#ecosystem", "Inside the system"]];

const DOCS_LINKS: [string, string][] = [
  ["/docs#privacy", "Privacy"],
  ["/docs#terms", "Terms of use"],
];

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.5 4.4 18.3 19c-.2.9-.8 1.1-1.6.7l-4.4-3.3-2.1 2c-.2.2-.4.4-.9.4l.3-4.6 8.4-7.6c.4-.3-.1-.5-.6-.2L7.2 13.1 2.8 11.7c-.9-.3-.9-.9.2-1.3L20.2 3.6c.8-.3 1.5.2 1.3.8z"
      />
    </svg>
  );
}

function TokenIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9.6" cy="12" r="1.15" fill="currentColor" />
      <circle cx="14.4" cy="12" r="1.15" fill="currentColor" />
    </svg>
  );
}

const TELEGRAM = "https://t.me/humanfactorapp";

const SOCIAL: [string, string, () => ReactElement][] = [
  ["https://x.com/humanfactorapp", "X", XIcon],
  [TELEGRAM, "Telegram", TelegramIcon],
];

export function Footer() {
  const site = useSite();
  const token = useTokenCa();
  return (
    <footer id="footer" data-label="FOOTER">
      <div className="footer-links">
        <div>
          <h4>YOUR AGENT TEAM</h4>
          {PRODUCTS.map((p, i) => (
            <a key={p.short} href={`#product-${i}`}>
              {p.short}
            </a>
          ))}
        </div>
        <div>
          <h4>EXPLORE HUMANFATOR</h4>
          {EXPLORE.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
          <a href={TELEGRAM} target="_blank" rel="noreferrer">
            Get in touch
          </a>
        </div>
        <div>
          <h4>THE DETAILS</h4>
          {DOCS_LINKS.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
          <button onClick={() => site.policy("Attribution")}>Project credits</button>
        </div>
        <div>
          <h4>ELSEWHERE</h4>
          <div className="footer-icons">
            {SOCIAL.map(([href, label, Icon]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
                <Icon />
              </a>
            ))}
            <button
              type="button"
              aria-label="Copy token address"
              title="Token address"
              onClick={() => {
                navigator.clipboard.writeText(token.address).then(
                  () => site.toast("Token address copied."),
                  () => site.toast(token.address),
                );
              }}
            >
              <TokenIcon />
            </button>
          </div>
        </div>
      </div>
      <div className="footer-bottom mono">
        <span>© 2026 HUMANFATOR</span>
        <span>DESIGNED FOR WHAT COMES NEXT.</span>
        <span className="brand-word">HUMANFATOR</span>
      </div>
    </footer>
  );
}
