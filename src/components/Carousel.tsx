import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { scrollBehavior } from "../hooks/useReducedMotion";

/**
 * Horizontal, snap-scrolling gallery with prev/next buttons. Mouse users can also drag it;
 * a drag suppresses the click that would otherwise open the card under the pointer.
 */
export function Carousel({
  id,
  label,
  prevLabel,
  nextLabel,
  counter,
  onScroll,
  trackRef,
  children,
}: {
  id: string;
  label: string;
  prevLabel: string;
  nextLabel: string;
  counter?: ReactNode;
  onScroll?: () => void;
  trackRef?: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  const own = useRef<HTMLDivElement>(null);
  const ref = trackRef ?? own;

  useEffect(() => {
    const el = ref.current!;
    let down = false,
      startX = 0,
      startLeft = 0,
      dragged = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      dragged = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 7) {
        dragged = true;
        el.scrollLeft = startLeft - dx;
        el.style.scrollSnapType = "none";
      }
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      el.style.scrollSnapType = "";
    };
    const onClick = (e: MouseEvent) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      }
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, [ref]);

  const step = (direction: number) => {
    const el = ref.current!;
    el.scrollBy({ left: el.clientWidth * 0.8 * direction, behavior: scrollBehavior() });
  };

  return (
    <div className="carousel-layout">
      <div className="carousel-controls">
        <button aria-label={prevLabel} onClick={() => step(-1)}>
          ⟵
        </button>
        <button aria-label={nextLabel} onClick={() => step(1)}>
          ⟶
        </button>
        {counter}
      </div>
      <div className="carousel" id={id} ref={ref} tabIndex={0} aria-label={label} onScroll={onScroll}>
        {children}
      </div>
    </div>
  );
}
