"use client";

import { useEffect } from "react";

/**
 * Cmd+K (macOS) / Ctrl+K (Windows·Linux) 단축키 listen.
 * input·textarea·contenteditable에 포커스된 경우에도 트리거 (검색 모달 열기 우선).
 */
export function useSearchShortcut(callback: () => void) {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				callback();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [callback]);
}
