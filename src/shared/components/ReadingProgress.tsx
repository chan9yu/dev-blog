"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const updateProgress = () => {
			const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
			const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
			const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

			setProgress(scrolled);
		};

		window.addEventListener("scroll", updateProgress, { passive: true });
		updateProgress();

		return () => window.removeEventListener("scroll", updateProgress);
	}, []);

	return (
		<div
			className="fixed top-0 left-0 z-50 h-1 transition-all duration-150"
			style={{
				width: `${progress}vw`,
				backgroundColor: "rgb(var(--color-accent))",
				boxShadow: progress > 0 ? "0 0 10px rgba(var(--color-accent), 0.5)" : "none"
			}}
		/>
	);
}
