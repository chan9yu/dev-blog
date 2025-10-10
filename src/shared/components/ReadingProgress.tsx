"use client";

import { useEffect, useRef, useState } from "react";
import { tv } from "tailwind-variants";

const progressBar = tv({
	base: "bg-accent fixed left-0 top-0 z-50 h-1 w-full origin-left transition-transform duration-150",
	variants: {
		variant: {
			main: "",
			glow: "pointer-events-none opacity-50 blur-[10px]"
		}
	},
	defaultVariants: {
		variant: "main"
	}
});

function calculateScrollProgress() {
	const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

	return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
}

export function ReadingProgress() {
	const [progress, setProgress] = useState(0);
	const rafId = useRef<number | null>(null);
	const isScheduled = useRef(false);

	useEffect(() => {
		const updateProgress = () => {
			const currentProgress = calculateScrollProgress();
			setProgress(currentProgress);
			isScheduled.current = false;
		};

		const scheduleProgressUpdate = () => {
			if (isScheduled.current) return;

			rafId.current = requestAnimationFrame(updateProgress);
			isScheduled.current = true;
		};

		window.addEventListener("scroll", scheduleProgressUpdate, { passive: true });
		updateProgress();

		return () => {
			window.removeEventListener("scroll", scheduleProgressUpdate);
			if (rafId.current !== null) {
				cancelAnimationFrame(rafId.current);
			}
		};
	}, []);

	const progressScale = progress / 100;
	const showGlow = progress > 0;
	const transformStyle = { transform: `scaleX(${progressScale})` };

	return (
		<>
			<div className={progressBar()} style={transformStyle} />
			{showGlow && <div className={progressBar({ variant: "glow" })} style={transformStyle} />}
		</>
	);
}
