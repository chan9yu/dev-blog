"use client";

import type { ReactNode } from "react";
import { createContext, use, useCallback, useMemo, useState } from "react";

import { ImageLightbox } from "./ImageLightbox";

type LightboxState = {
	src: string | null;
	alt: string;
};

type LightboxContextValue = {
	open: (payload: { src: string; alt: string }) => void;
	close: () => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

type LightboxProviderProps = {
	children: ReactNode;
};

export function LightboxProvider({ children }: LightboxProviderProps) {
	const [state, setState] = useState<LightboxState>({ src: null, alt: "" });

	const open = useCallback(
		(payload: { src: string; alt: string }) => setState({ src: payload.src, alt: payload.alt }),
		[]
	);
	const close = useCallback(() => setState({ src: null, alt: "" }), []);

	const value = useMemo(() => ({ open, close }), [open, close]);

	return (
		<LightboxContext value={value}>
			{children}
			{state.src && <ImageLightbox src={state.src} alt={state.alt} onClose={close} />}
		</LightboxContext>
	);
}

export function useLightbox() {
	const context = use(LightboxContext);
	if (!context) {
		throw new Error("useLightbox는 <LightboxProvider> 내부에서만 호출할 수 있습니다.");
	}
	return context;
}
