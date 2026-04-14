"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const SHOW_THRESHOLD = 400;

export function ScrollToTop() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => setVisible(window.scrollY > SHOW_THRESHOLD);
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

	if (!visible) return null;
	return (
		<button
			type="button"
			onClick={handleClick}
			aria-label="맨 위로 이동"
			className="bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-ring fixed right-6 bottom-6 z-40 inline-flex size-12 items-center justify-center rounded-full shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:transition-opacity"
		>
			<ArrowUp className="size-5" aria-hidden />
		</button>
	);
}
