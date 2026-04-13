"use client";

import { ArrowUp } from "lucide-react";

export function ScrollToTopButton() {
	const handleClick = () => {
		const main = document.getElementById("main-content");
		window.scrollTo({ top: 0, behavior: "smooth" });
		main?.focus({ preventScroll: true });
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			aria-label="맨 위로 이동"
			className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 inline-flex items-center justify-center rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
		>
			<ArrowUp className="size-5" aria-hidden />
		</button>
	);
}
