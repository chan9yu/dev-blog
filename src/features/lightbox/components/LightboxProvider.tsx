"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useState } from "react";

import { LightboxContext } from "../contexts/LightboxContext";

/** 초기 번들에서 제외해 LCP 개선 — 라이트박스는 사용자 인터랙션 후에만 필요 */
const ImageLightbox = dynamic(() => import("./ImageLightbox").then((mod) => ({ default: mod.ImageLightbox })), {
	ssr: false
});

type LightboxState = {
	src: string | null;
	alt: string;
};

type LightboxProviderProps = {
	children: ReactNode;
};

/**
 * 라이트박스 Context Provider. useCallback/useMemo는 React 19 컴파일러가 처리하므로 수동 안정화 제거(react.md 성능 가이드).
 */
export function LightboxProvider({ children }: LightboxProviderProps) {
	const [state, setState] = useState<LightboxState>({ src: null, alt: "" });

	const open = (payload: { src: string; alt: string }) => {
		setState({ src: payload.src, alt: payload.alt });
	};

	const close = () => {
		setState({ src: null, alt: "" });
	};

	return (
		<LightboxContext value={{ open, close }}>
			{children}
			{state.src && <ImageLightbox src={state.src} alt={state.alt} onClose={close} />}
		</LightboxContext>
	);
}
