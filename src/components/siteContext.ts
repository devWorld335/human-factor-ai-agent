import { createContext, useContext, type ReactNode } from "react";
import type { Story } from "../data/stories";

export type Site = {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  toast: (message: string) => void;
  launch: () => void;
  product: (index: number) => void;
  demo: (index: number) => void;
  contact: () => void;
  bio: (index: number) => void;
  node: (layer: number, index: number) => void;
  story: (story: Story) => void;
  community: (name: string) => void;
  info: (title: string) => void;
  policy: (name: string) => void;
  plans: () => void;
  plan: (name: string) => void;
  sectionIndex: () => void;
};

export const SiteContext = createContext<Site | null>(null);

export function useSite(): Site {
  const site = useContext(SiteContext);
  if (!site) throw new Error("useSite must be used inside <SiteProvider>");
  return site;
}
