"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/utils/cn";

type FadeInWhenVisibleProps = {
	children: ReactNode;
	className?: string;
	threshold?: number;
	delayMs?: number;
};

/**
 * 자식 요소가 뷰포트에 들어오면 opacity/translateY 전환 효과 적용.
 * `motion-safe`로 prefers-reduced-motion 존중.
 */
export function FadeInWhenVisible({ children, className, threshold = 0.1, delayMs = 0 }: FadeInWhenVisibleProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold }
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [threshold]);

	return (
		<div
			ref={ref}
			className={cn(
				"motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out",
				visible ? "opacity-100 motion-safe:translate-y-0" : "opacity-0 motion-safe:translate-y-4",
				className
			)}
			style={{ transitionDelay: delayMs ? `${delayMs}ms` : undefined }}
		>
			{children}
		</div>
	);
}
