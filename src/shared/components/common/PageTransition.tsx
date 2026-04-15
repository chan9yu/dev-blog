"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";

type PageTransitionProps = PropsWithChildren<{
	className?: string;
}>;

/**
 * 페이지 진입 시 fade + slide-up 애니메이션.
 *
 * ## requestAnimationFrame 전략
 * SSR hydration 직후에는 initial(opacity:0) 상태로 마운트된다.
 * 첫 rAF(≈16ms)에서 mounted=true로 전환 → animate 상태로 이행.
 * React가 초기 HTML을 그린 뒤 JS가 제어권을 넘겨받는 타이밍과 일치해
 * hydration flash 없이 부드러운 진입 효과를 제공한다.
 *
 * pathname을 key로 사용해 라우트 전환마다 재마운트 → 페이지마다 진입 효과.
 *
 * @example
 * // app/page.tsx 또는 개별 page.tsx 최상위 래퍼
 * <PageTransition>
 *   <Container>...</Container>
 * </PageTransition>
 */
export function PageTransition({ children, className }: PageTransitionProps) {
	const pathname = usePathname();

	const [mounted, setMounted] = useState(false);
	const rafRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		// 첫 paint 이후 animate 시작 — hydration/route-transition flash 방지
		// key={pathname}으로 컴포넌트가 remount되므로 deps=[] 로 충분.
		// mounted 초기값 false는 리마운트 시 자동 리셋됨.
		rafRef.current = requestAnimationFrame(() => {
			setMounted(true);
		});

		return () => {
			if (rafRef.current !== undefined) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);

	return (
		<motion.div
			key={pathname}
			className={className}
			initial={{ opacity: 0, y: 20 }}
			animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
			transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
		>
			{children}
		</motion.div>
	);
}
