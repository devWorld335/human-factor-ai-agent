import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tailwind.css";
import "./styles/site.css";
import "./styles/preflight-v3.css";
import App from "./App";
import { PrivyAuth } from "./privy";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrivyAuth>
      <App />
    </PrivyAuth>
  </StrictMode>,
);
