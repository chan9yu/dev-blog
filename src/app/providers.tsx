"use client";

import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

import { LightboxProvider } from "@/features/lightbox";

// ThemeProvider.enableColorScheme=false: tokens.css `.dark` 셀렉터에서 직접 선언하기 위함 (theme.md).
// MotionConfig.reducedMotion="user": prefers-reduced-motion 시스템 설정 자동 존중 (WCAG 2.1 §2.3.3).
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
