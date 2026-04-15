"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/shared/utils/cn";

const SCROLL_THRESHOLD = 300;

/**
 * 레거시 ScrollToTop 디자인 참조:
 * - fixed right-8 bottom-8 z-50, bg-accent + shadow-lg + hover scale-110
 * - 숨김 상태도 DOM 유지 (pointer-events-none + translate-y-16 + opacity-0)로 부드러운 진입/퇴장 애니메이션
 */
export function ScrollToTop() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

	return (
		<button
			type="button"
			onClick={handleClick}
			aria-label="맨 위로 이동"
			aria-hidden={!visible}
			className={cn(
				"bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-ring fixed right-8 bottom-8 z-50 inline-flex cursor-pointer items-center justify-center rounded-full p-3 shadow-lg shadow-black/15 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:hover:scale-110 motion-safe:hover:shadow-xl",
				visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-16 opacity-0"
			)}
		>
			<ArrowUp className="size-6" aria-hidden />
		</button>
	);
}
