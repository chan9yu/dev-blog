"use client";

import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

/**
 * 전역 Provider 조립 지점.
 *
 * - ThemeProvider: attribute="class" (html.dark 토글), enableColorScheme={false}
 *   (`tokens.css`의 `.dark` 셀렉터에서 CSS로 직접 선언 — ADR-011, theme.md).
 *
 * 추후 `LightboxProvider`(M3-15), `Toaster`(필요 시) 등이 이 파일에 병합 예정.
 */
export function Providers({ children }: PropsWithChildren) {
	return (
		<ThemeProvider attribute="class" enableColorScheme={false} defaultTheme="system" disableTransitionOnChange>
			{children}
		</ThemeProvider>
	);
}
