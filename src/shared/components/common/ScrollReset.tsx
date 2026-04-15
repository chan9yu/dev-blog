"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * App Router 페이지 전환 시 스크롤을 상단으로 리셋.
 * Next.js 기본 동작이 히스토리 탐색에서 scroll position을 복원하지 않는 경우 대비.
 */
export function ScrollReset() {
	const pathname = usePathname();

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "instant" });
	}, [pathname]);

	return null;
}
