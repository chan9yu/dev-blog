"use client";

import { useEffect, useRef } from "react";

/**
 * 주어진 콜백을 requestAnimationFrame으로 throttle한다.
 *
 * - 연속 호출 시 이전 rAF를 취소하고 마지막 호출만 다음 paint 사이클에 실행
 * - callbackRef 패턴으로 stale closure 없이 항상 최신 callback 호출
 * - 컴포넌트 언마운트 시 자동 cancelAnimationFrame
 *
 * @example
 * const handleScroll = useRafCallback((e: Event) => { ... });
 * window.addEventListener("scroll", handleScroll);
 */
export function useRafCallback<Args extends unknown[]>(callback: (...args: Args) => void): (...args: Args) => void {
	const rafRef = useRef<number | undefined>(undefined);
	const callbackRef = useRef(callback);

	// 최신 callback 참조 유지 (stale closure 방지)
	useEffect(() => {
		callbackRef.current = callback;
	});

	// 언마운트 시 pending rAF 취소
	useEffect(() => {
		return () => {
			if (rafRef.current !== undefined) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);

	// React Compiler가 자동 메모이제이션 — useCallback 생략
	return (...args: Args) => {
		if (rafRef.current !== undefined) {
			cancelAnimationFrame(rafRef.current);
		}
		rafRef.current = requestAnimationFrame(() => {
			rafRef.current = undefined;
			callbackRef.current(...args);
		});
	};
}
