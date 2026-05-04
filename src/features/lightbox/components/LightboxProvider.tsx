"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useState } from "react";

import type { LightboxImage } from "../contexts/LightboxContext";
import { LightboxContext } from "../contexts/LightboxContext";

/** 초기 번들에서 제외해 LCP 개선 — 라이트박스는 사용자 인터랙션 후에만 필요 */
const ImageLightbox = dynamic(() => import("./ImageLightbox").then((mod) => ({ default: mod.ImageLightbox })), {
	ssr: false
});

type LightboxState = {
	images: ReadonlyArray<LightboxImage>;
	index: number;
};

const INITIAL_STATE: LightboxState = { images: [], index: 0 };

type LightboxProviderProps = {
	children: ReactNode;
};

// 상태 모델: `images.length === 0`이면 닫힘 상태. `open(single)`은 `openMany([single], 0)` sugar.
export function LightboxProvider({ children }: LightboxProviderProps) {
	const [state, setState] = useState<LightboxState>(INITIAL_STATE);

	const open = (image: LightboxImage) => {
		setState({ images: [image], index: 0 });
	};

	const openMany = (images: ReadonlyArray<LightboxImage>, startIndex = 0) => {
		if (images.length === 0) return;
		const bounded = Math.max(0, Math.min(startIndex, images.length - 1));
		setState({ images, index: bounded });
	};

	const close = () => {
		setState(INITIAL_STATE);
	};

	const goNext = () => {
		setState((prev) => {
			if (prev.images.length === 0) return prev;
			return { ...prev, index: (prev.index + 1) % prev.images.length };
		});
	};

	const goPrev = () => {
		setState((prev) => {
			if (prev.images.length === 0) return prev;
			return { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length };
		});
	};

	const isOpen = state.images.length > 0;

	return (
		<LightboxContext value={{ open, openMany, close }}>
			{children}
			{isOpen && (
				<ImageLightbox images={state.images} index={state.index} onNext={goNext} onPrev={goPrev} onClose={close} />
			)}
		</LightboxContext>
	);
}
