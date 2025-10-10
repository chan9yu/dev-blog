"use client";

import { useEffect, useState } from "react";

import ArrowUpIcon from "@/assets/icons/arrow-up.svg";

const SCROLL_THRESHOLD = 300;

export function ScrollToTop() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsVisible(window.scrollY > SCROLL_THRESHOLD);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleClick = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<button
			onClick={handleClick}
			className={`bg-accent fixed right-8 bottom-8 z-50 rounded-full p-3 text-white shadow-lg transition-all duration-300 hover:scale-110 ${
				isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-16 opacity-0"
			}`}
			style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}
			aria-label="Scroll to top"
		>
			<ArrowUpIcon className="size-6" />
		</button>
	);
}
