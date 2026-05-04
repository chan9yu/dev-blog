import { createContext } from "react";

export type LightboxImage = {
	src: string;
	alt: string;
};

export type LightboxContextValue = {
	open: (image: LightboxImage) => void;
	// 2장 이상이면 carousel 화살표 노출, startIndex부터 시작.
	openMany: (images: ReadonlyArray<LightboxImage>, startIndex?: number) => void;
	close: () => void;
};

export const LightboxContext = createContext<LightboxContextValue | null>(null);
