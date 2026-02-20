"use client";

import { useEffect, useState } from "react";
import { tv } from "tailwind-variants";

import ArrowUpIcon from "@/shared/assets/icons/arrow-up.svg";

const SCROLL_THRESHOLD = 300;

const scrollToTopButton = tv({
	base: [
		"fixed right-8 bottom-8 z-50",
		"cursor-pointer rounded-full p-3",
		"bg-accent text-on-accent",
		"shadow-lg shadow-black/15",
		"transition-all duration-300",
		"hover:scale-110 hover:shadow-xl hover:shadow-black/20"
	],
	variants: {
		visible: {
			true: "translate-y-0 opacity-100",
			false: "pointer-events-none translate-y-16 opacity-0"
		}
	}
});

export function ScrollToTop() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsVisible(window.scrollY > SCROLL_THRESHOLD);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const handleClick = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};

	return (
		<button onClick={handleClick} className={scrollToTopButton({ visible: isVisible })} aria-label="Scroll to top">
			<ArrowUpIcon className="size-6" aria-hidden="true" />
		</button>
	);
}
