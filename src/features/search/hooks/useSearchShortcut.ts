"use client";

import { useEffect, useRef } from "react";

// Cmd+K (macOS) / Ctrl+K. callback ref 패턴으로 stale closure 방지 + 이벤트 리스너 1회만 등록.
export function useSearchShortcut(callback: () => void) {
	const callbackRef = useRef(callback);

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
	}, []);
}
