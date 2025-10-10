"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

type MotionProviderProps = {
	children: ReactNode;
};

export function MotionProvider({ children }: MotionProviderProps) {
	return (
		<MotionConfig
			reducedMotion="user"
			// GPU 가속 사용 (transform, opacity만 애니메이션)
			transition={{
				duration: 0.3,
				ease: [0.4, 0, 0.2, 1]
			}}
		>
			{children}
		</MotionConfig>
	);
}
