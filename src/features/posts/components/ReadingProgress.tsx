"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

/**
 * 페이지 최상단 고정 진행률 바.
 * - transform: scaleX(...) 방식으로 60fps 부드럽게 (width % 대신)
 * - requestAnimationFrame throttle로 scroll 이벤트 낭비 제거
 * - progress > 0 때 blur glow 레이어 추가 (반투명 잔상)
 */
function calculateScrollProgress() {
	const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

	return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
}

export function ReadingProgress() {
	const [progress, setProgress] = useState(0);
	const rafIdRef = useRef<number | null>(null);
	const scheduledRef = useRef(false);

	useEffect(() => {
		const update = () => {
			setProgress(calculateScrollProgress());
			scheduledRef.current = false;
		};

		const schedule = () => {
			if (scheduledRef.current) return;
			rafIdRef.current = requestAnimationFrame(update);
			scheduledRef.current = true;
		};

		window.addEventListener("scroll", schedule, { passive: true });

		update();

		return () => {
			window.removeEventListener("scroll", schedule);

			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, []);

	const progressStyle = { "--progress": progress / 100 } as CSSProperties & { "--progress": number };
	const showGlow = progress > 0;

	return (
		<div
			className="fixed inset-x-0 top-0 z-50"
			role="progressbar"
			aria-label="읽기 진행률"
			aria-valuenow={Math.round(progress)}
			aria-valuemin={0}
			aria-valuemax={100}
		>
			<div
				className="reading-progress-bar bg-accent h-1 w-full origin-left transition-transform duration-150"
				style={progressStyle}
			/>
			{showGlow && (
				<div
					aria-hidden
					className="reading-progress-bar bg-accent pointer-events-none absolute inset-x-0 top-0 h-1 w-full origin-left opacity-50 blur-md transition-transform duration-150"
					style={progressStyle}
				/>
			)}
		</div>
	);
}
