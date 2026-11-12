import { useEffect, useState } from "react";
import { useSite } from "./siteContext";

const GROUPS: { label: string; links: [string, string][] }[] = [
  {
    label: "Products",
    links: [
      ["#solutions", "All products ↗"],
      ["#product-0", "Personal Agent"],
      ["#product-1", "Code Agent"],
      ["#product-2", "Design Agent"],
    ],
  },
];

const LINKS: [string, string][] = [
  ["/docs", "How it works"],
  ["#solutions", "AGENTS"],
  ["#ecosystem", "Structure"],
];

export function Header() {
  const site = useSite();
  const onHome = (window.location.pathname.replace(/\/+$/, "") || "/") === "/";
  const to = (href: string) => (onHome || href.startsWith("/") ? href : `/${href}`);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { user?: { username?: string } } | null) => {
        if (live && data?.user?.username) setAccount(data.user.username);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, []);

  // Any in-page link (here, in the rail or the footer) and Escape close the menus.
  useEffect(() => {
    const close = () => {
      setMenuOpen(false);
      setOpenGroup(null);
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest?.("a[href]")) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header id="header">
      <nav aria-label="Main navigation">
        <a className="brand" href={to("#intro")}>
          <img className="brand-icon" src="/logo.png" alt="" />Humanfator
        </a>
        <a className="ecosystem-nav mono" href={to("#solutions")}>
          <span>⠿</span> AGENT ECOSYSTEM
        </a>
        <div className={`nav-links${menuOpen ? " open" : ""}`}>
          {GROUPS.map((g, i) => (
            <div key={g.label} className={`nav-group${openGroup === i ? " open" : ""}`}>
              <button
                className="nav-trigger"
                aria-expanded={openGroup === i}
                onClick={() => setOpenGroup(openGroup === i ? null : i)}
              >
                {g.label} <span>⌄</span>
              </button>
              <div className="dropdown">
                {g.links.map(([href, label]) => (
                  <a key={href} href={to(href)}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
          {LINKS.map(([href, label]) => (
            <a key={label} href={to(href)} aria-current={href === "/docs" && !onHome ? "page" : undefined}>
              {label}
            </a>
          ))}
          {!account && (
            <a className="nav-signin-mobile" href="/signin">
              Sign in
            </a>
          )}
        </div>
        {!account && (
          <a className="nav-signin mono" href="/signin">
            SIGN IN
          </a>
        )}
        <button className="outline-button launch" onClick={site.launch}>
          <span>••</span> EXPLORE YOUR AGENTS
        </button>
        <button
          className="mobile-menu"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          ☰
        </button>
      </nav>
    </header>
  );
}
