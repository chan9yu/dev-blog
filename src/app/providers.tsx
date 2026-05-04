"use client";

import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

import { LightboxProvider } from "@/features/lightbox";

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
