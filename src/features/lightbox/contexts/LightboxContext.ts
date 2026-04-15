import { createContext } from "react";

export type LightboxContextValue = {
	open: (payload: { src: string; alt: string }) => void;
	close: () => void;
};

export const LightboxContext = createContext<LightboxContextValue | null>(null);
