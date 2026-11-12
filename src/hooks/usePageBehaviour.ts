import { useEffect } from "react";
import { scrollBehavior } from "./useReducedMotion";

/** Page-wide behaviour the original site wired up on load. */
export function usePageBehaviour() {
  // Headings fade in once as they scroll into view.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Product panels are sticky and stacked, so a plain anchor jump lands on the wrong one.
  // Scroll to where the panel sits in the flow instead.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.('a[href^="#product-"]');
      if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const hash = link.getAttribute("href")!;
      const list = document.getElementById("products");
      const target = document.querySelector(hash);
      if (!/^#product-[0-2]$/.test(hash) || !list || !target) return;
      e.preventDefault();
      let top = list.getBoundingClientRect().top + scrollY;
      for (const child of list.children) {
        if (child === target) break;
        top += child.getBoundingClientRect().height;
      }
      top -= parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      if (location.hash !== hash) history.pushState(null, "", hash);
      scrollTo({ top, behavior: scrollBehavior() });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Arrow keys, Home and End move between tabs in any tablist.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tab = (e.target as Element).closest?.("[role=tab]");
      if (!tab || !["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
      const tabs = [...(tab.closest("[role=tablist]")?.querySelectorAll<HTMLElement>("[role=tab]") ?? [])];
      let i = tabs.indexOf(tab as HTMLElement);
      i =
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? tabs.length - 1
            : (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      tabs[i].focus();
      tabs[i].click();
      e.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
}
