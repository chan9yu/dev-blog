"use client";

import { useEffect, useRef } from "react";

// rAF throttle: 연속 호출 시 이전 프레임 취소 + 마지막 호출만 다음 paint에서 실행.
// callbackRef 패턴으로 stale closure 방지.
export function useRafCallback<Args extends unknown[]>(callback: (...args: Args) => void): (...args: Args) => void {
	const rafRef = useRef<number | undefined>(undefined);
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	});

	useEffect(() => {
		return () => {
			if (rafRef.current !== undefined) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);

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
