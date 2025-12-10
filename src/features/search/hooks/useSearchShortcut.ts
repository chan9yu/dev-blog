"use client";

import { useEffect } from "react";

/**
 * 검색 키보드 단축키 훅 (Cmd/Ctrl + K)
 * @param onTrigger - 단축키가 눌렸을 때 실행할 콜백
 */
export function useSearchShortcut(onTrigger: () => void) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Cmd+K (Mac) 또는 Ctrl+K (Windows/Linux)
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault(); // 브라우저 기본 동작 방지
				onTrigger();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [onTrigger]);
}
