"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type PageTransitionProps = {
	children: ReactNode;
	className?: string;
};

/**
 * 페이지 전환 시 pathname을 key로 받아 React 재마운트 + CSS fade-in 트리거.
 * 무거운 라이브러리(framer-motion) 없이 animate-in 유틸 활용.
 */
export function PageTransition({ children, className }: PageTransitionProps) {
	const pathname = usePathname();
	return (
		<div
			key={pathname}
			className={cn(
				"motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-500",
				className
			)}
		>
			{children}
		</div>
	);
}
