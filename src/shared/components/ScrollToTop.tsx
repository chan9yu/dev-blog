"use client";

import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 300; // 버튼 표시 기준 스크롤 위치 (px)
const THROTTLE_DELAY = 100; // 스크롤 이벤트 스로틀링 지연 시간 (ms)

export function ScrollToTop() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout | null = null;

		const toggleVisibility = () => {
			if (timeoutId) return;

			timeoutId = setTimeout(() => {
				setIsVisible(window.scrollY > SCROLL_THRESHOLD);
				timeoutId = null;
			}, THROTTLE_DELAY);
		};

		window.addEventListener("scroll", toggleVisibility, { passive: true });

		return () => {
			window.removeEventListener("scroll", toggleVisibility);
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, []);

	const scrollToTop = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		// URL에서 해시 제거 (스크롤 전에)
		if (window.location.hash) {
			window.history.replaceState(null, "", window.location.pathname + window.location.search);
		}

		// Smooth scroll to top
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};

	return (
		<button
			onClick={scrollToTop}
			className={`fixed right-8 bottom-8 z-50 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 ${
				isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-16 opacity-0"
			}`}
			style={{
				backgroundColor: "rgb(var(--color-accent))",
				color: "white",
				boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
			}}
			aria-label="Scroll to top"
		>
			<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
			</svg>
		</button>
	);
}
