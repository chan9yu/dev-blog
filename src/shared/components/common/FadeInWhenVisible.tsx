"use client";

import { motion, useInView } from "framer-motion";
import type { PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";

type FadeInWhenVisibleProps = PropsWithChildren<{
	delay?: number;
	className?: string;
}>;

// 모듈 스코프 상수로 올려 매 렌더 새 객체 생성 방지.
const INITIAL = { opacity: 0, y: 30 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const EASE = [0.4, 0, 0.2, 1] as const;

// useInView true 즉시가 아니라 rAF 한 프레임 대기 후 animate — initial(opacity:0) 페인팅 보장 → FOUC 방지.
export function FadeInWhenVisible({ children, delay = 0, className }: FadeInWhenVisibleProps) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-50px" });

	const [shouldAnimate, setShouldAnimate] = useState(false);
	// shouldAnimate를 deps에 넣으면 setState 후 effect 재실행 — ref로 1회성 가드.
	const hasAnimatedRef = useRef(false);
	const rafRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		if (!isInView || hasAnimatedRef.current) return;
		hasAnimatedRef.current = true;
		rafRef.current = requestAnimationFrame(() => {
			setShouldAnimate(true);
		});
		return () => {
			if (rafRef.current !== undefined) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, [isInView]);

	return (
		<motion.div
			ref={ref}
			className={className}
			initial={INITIAL}
			animate={shouldAnimate ? ANIMATE_VISIBLE : INITIAL}
			transition={{ duration: 0.5, delay, ease: EASE }}
		>
			{children}
		</motion.div>
	);
}
