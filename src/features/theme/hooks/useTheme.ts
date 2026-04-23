"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

type UseThemeReturn = {
	/** mount 후 실 테마 값. hydration 전에는 `null` (FOUC 회피용). */
	resolvedTheme: Theme | null;
	/** 현재 테마 반대로 토글. 미마운트 상태에선 no-op. */
	toggleTheme: () => void;
	/** 명시적 설정. View Transitions API 지원 시 transition 경유. */
	setTheme: (theme: Theme) => void;
	/** hydration 완료 여부 — UI가 SSR/Client 양립 컨텐츠를 분기할 때 사용. */
	mounted: boolean;
};

const emptySubscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * MOD-theme `useTheme` wrapper — ADR-011.
 *
 * next-themes의 `useTheme`을 얇게 감싸 세 가지 가치를 제공:
 * 1. `useSyncExternalStore` 기반 `mounted` 플래그 — hydration 이전 null 상태로 FOUC 차단
 * 2. `toggleTheme` — light ↔ dark 스왑을 단일 호출로
 * 3. View Transitions API progressive enhancement — `document.startViewTransition` 존재 시 전환 경유, 미지원 시 즉시 apply
 *
 * 도메인 중립 API지만 구현은 theme 도메인에 종속되므로 `features/theme/hooks`에 배치.
 */
export function useTheme(): UseThemeReturn {
	const { resolvedTheme, setTheme: setNextTheme } = useNextTheme();
	const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

	const currentTheme: Theme | null = mounted ? (resolvedTheme === "dark" ? "dark" : "light") : null;

	const applyWithTransition = (theme: Theme) => {
		const apply = () => setNextTheme(theme);

		if (typeof document !== "undefined" && typeof document.startViewTransition === "function") {
			document.startViewTransition(apply);
		} else {
			apply();
		}
	};

	const toggleTheme = () => {
		if (!mounted || currentTheme === null) return;
		applyWithTransition(currentTheme === "dark" ? "light" : "dark");
	};

	return {
		resolvedTheme: currentTheme,
		toggleTheme,
		setTheme: applyWithTransition,
		mounted
	};
}
