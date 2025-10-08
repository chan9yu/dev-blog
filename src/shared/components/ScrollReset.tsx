"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollReset() {
	const pathname = usePathname();

	useEffect(() => {
		// 페이지 이동 시 스크롤을 최상단으로
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}
