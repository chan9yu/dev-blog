"use client";

import { createContext, type ReactNode, useContext } from "react";

import { useLightbox } from "../hooks";
import type { LightboxImage } from "../types";
import { ImageLightbox } from "./ImageLightbox";

type LightboxContextValue = {
	openLightbox: (images: LightboxImage[], index?: number) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightboxContext() {
	const context = useContext(LightboxContext);
	if (!context) {
		throw new Error("useLightboxContext must be used within LightboxProvider");
	}
	return context;
}

type LightboxProviderProps = {
	children: ReactNode;
};

/**
 * Lightbox Context Provider
 * - 전역 lightbox 상태 관리
 * - MDX 이미지에서 사용
 */
export function LightboxProvider({ children }: LightboxProviderProps) {
	const { isOpen, currentIndex, images, openLightbox, closeLightbox } = useLightbox();

	return (
		<LightboxContext.Provider value={{ openLightbox }}>
			{children}
			<ImageLightbox isOpen={isOpen} onClose={closeLightbox} images={images} currentIndex={currentIndex} />
		</LightboxContext.Provider>
	);
}
