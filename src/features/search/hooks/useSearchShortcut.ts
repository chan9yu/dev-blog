"use client";

import { useEffect, useRef } from "react";

/**
 * Cmd+K (macOS) / Ctrl+K (Windows·Linux) 단축키 listen.
 * callback ref 패턴으로 stale closure 방지 + 이벤트 리스너 단 한 번만 등록.
 */
export function useSearchShortcut(callback: () => void) {
	const callbackRef = useRef(callback);

	// 매 렌더마다 최신 callback을 ref에 동기화
	useEffect(() => {
		callbackRef.current = callback;
	});

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				callbackRef.current();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []); // 마운트 시 한 번만 등록 — ref로 최신 callback 참조
}
