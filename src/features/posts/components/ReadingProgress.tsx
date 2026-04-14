"use client";

import { useEffect, useState } from "react";

/**
 * 페이지 최상단 고정 진행률 바. window.scroll 이벤트를 listen해서 백분율 계산.
 * M2+에서 포스트 본문 컨테이너 기반 측정으로 개선 가능.
 */
export function ReadingProgress() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
			const total = scrollHeight - clientHeight;
			setProgress(total > 0 ? Math.min(100, Math.max(0, (scrollTop / total) * 100)) : 0);
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div
			className="fixed inset-x-0 top-0 z-50 h-1"
			role="progressbar"
			aria-label="읽기 진행률"
			aria-valuenow={Math.round(progress)}
		>
			<div className="bg-accent h-full origin-left transition-[width] duration-100" style={{ width: `${progress}%` }} />
		</div>
	);
}
