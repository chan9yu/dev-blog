import { createContext } from "react";

export type LightboxImage = {
	src: string;
	alt: string;
};

export type LightboxContextValue = {
	/** 단일 이미지 오픈 — carousel 화살표는 숨김. */
	open: (image: LightboxImage) => void;
	/** 다중 이미지 오픈 — `startIndex`부터 시작, 2장 이상이면 화살표 노출. */
	openMany: (images: ReadonlyArray<LightboxImage>, startIndex?: number) => void;
	close: () => void;
};

export const LightboxContext = createContext<LightboxContextValue | null>(null);
