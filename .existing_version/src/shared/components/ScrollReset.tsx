"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollReset() {
	const pathname = usePathname();

	useEffect(() => {
		// 브라우저 자동 스크롤 복원 완전 비활성화
		window.history.scrollRestoration = "manual";

		// 페이지 로드 시 무조건 최상단
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		// pathname 변경될 때마다 강제로 최상단
		window.scrollTo(0, 0);
		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;
	}, [pathname]);

	return null;
}
