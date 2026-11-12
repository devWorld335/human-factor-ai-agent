import { useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { SectionRail } from "./components/SectionRail";
import { SiteProvider } from "./components/site";
import { Ecosystem } from "./components/home/Ecosystem";
import { Footer } from "./components/home/Footer";
import { Gateway } from "./components/home/Gateway";
import { Hero } from "./components/home/Hero";
import { Products } from "./components/home/Products";
import { SignIn } from "./components/SignIn";
import { Docs } from "./components/Docs";
import { EngineContext, useEngine } from "./hooks/useEngine";
import { usePageBehaviour } from "./hooks/usePageBehaviour";

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/signin" || path === "/signup" || path === "/agents") {
    return <SignIn initialMode={path === "/signup" ? "signup" : "signin"} />;
  }
  if (path === "/docs") return <Docs />;
  return <Home />;
}

function Home() {
  const engine = useEngine();
  const cursor = useRef<HTMLDivElement>(null);
  usePageBehaviour();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const dot = cursor.current;
      if (!dot) return;
      dot.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 3}px)`;
      dot.style.opacity = e.pointerType === "mouse" ? ".6" : "0";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <EngineContext.Provider value={engine}>
      <SiteProvider>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <SectionRail />
        <main id="main">
          <Hero />
          <Gateway />
          <Products />
          <Ecosystem />
          <Footer />
        </main>
        <div className="cursor-dot" ref={cursor} aria-hidden="true" />
      </SiteProvider>
    </EngineContext.Provider>
  );
}
