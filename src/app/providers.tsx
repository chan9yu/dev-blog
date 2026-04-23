"use client";

import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

import { LightboxProvider } from "@/features/lightbox";

/**
 * 전역 Provider 조립 지점.
 *
 * - ThemeProvider: attribute="class" (html.dark 토글), enableColorScheme={false}
 *   (`tokens.css`의 `.dark` 셀렉터에서 CSS로 직접 선언 — ADR-011, theme.md).
 * - MotionConfig: 모든 motion.* 컴포넌트의 기본 transition 설정 + reducedMotion 접근성.
 *   - reducedMotion="user": 시스템 prefers-reduced-motion 자동 존중 (WCAG 2.1 §2.3.3)
 *   - GPU 가속을 위해 transform(scale, x, y)과 opacity만 애니메이션 대상으로 사용
 *   - easing [0.4, 0, 0.2, 1]: 빠른 시작 + 부드러운 감속 — Material Design 표준 곡선
 * - LightboxProvider: MDX 이미지 확대 오버레이 Context (M3-16) — `useLightbox()` 소비자 트리 전역 배치.
 */

const MOTION_TRANSITION = { duration: 0.3, ease: [0.4, 0, 0.2, 1] } as const;

export function Providers({ children }: PropsWithChildren) {
	return (
		<ThemeProvider attribute="class" enableColorScheme={false} defaultTheme="system" disableTransitionOnChange>
			<MotionConfig reducedMotion="user" transition={MOTION_TRANSITION}>
				<LightboxProvider>{children}</LightboxProvider>
			</MotionConfig>
		</ThemeProvider>
	);
}
