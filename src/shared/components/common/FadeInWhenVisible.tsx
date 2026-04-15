"use client";

import { motion, useInView } from "framer-motion";
import type { PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";

type FadeInWhenVisibleProps = PropsWithChildren<{
	/** 애니메이션 시작 지연 (초 단위, 기본값 0) */
	delay?: number;
	className?: string;
}>;

/** 모션 객체를 모듈 스코프 상수로 올려 매 렌더마다 새 참조 생성을 방지 */
const INITIAL = { opacity: 0, y: 30 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const EASE = [0.4, 0, 0.2, 1] as const;

/**
 * 뷰포트에 진입할 때 fade + slide-up 애니메이션을 실행한다.
 *
 * ## requestAnimationFrame 전략
 * useInView가 true를 반환하면 즉시 animate하지 않는다.
 * rAF로 다음 paint 사이클까지 대기 후 shouldAnimate를 활성화한다.
 * → initial(opacity:0) 상태가 먼저 페인팅된 뒤 전환이 시작되어 FOUC 방지.
 *
 * ## prefers-reduced-motion
 * MotionConfig(app/providers.tsx)의 `reducedMotion="user"` 설정으로
 * 시스템 설정을 자동 존중한다.
 *
 * @example
 * <FadeInWhenVisible delay={0.1}>
 *   <PostCard ... />
 * </FadeInWhenVisible>
 */
export function FadeInWhenVisible({ children, delay = 0, className }: FadeInWhenVisibleProps) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-50px" });

	const [shouldAnimate, setShouldAnimate] = useState(false);
	// useRef로 "이미 실행됨" 여부를 추적 — shouldAnimate를 deps에 포함하면
	// setShouldAnimate(true) 후 effect가 불필요하게 재실행되는 규칙 위반
	const hasAnimatedRef = useRef(false);
	const rafRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		if (!isInView || hasAnimatedRef.current) return;
		hasAnimatedRef.current = true;
		// paint 사이클 동기화: initial state가 먼저 렌더된 뒤 animation 트리거
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
