import type { ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";

const appId = "cmwcb4uo0012z0hig3nijvjue";

export function PrivyAuth({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["google", "apple"],
        appearance: { theme: "dark" },
        embeddedWallets: {
          ethereum: { createOnLogin: "off" },
          solana: { createOnLogin: "off" },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
