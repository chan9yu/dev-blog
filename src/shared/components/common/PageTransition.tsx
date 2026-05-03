"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";

type PageTransitionProps = PropsWithChildren<{
	className?: string;
}>;

// 첫 rAF에서 mounted=true 전환 — hydration flash 없이 진입 애니메이션.
// pathname을 key로 사용해 라우트 전환마다 remount → 페이지마다 진입 효과.
export function PageTransition({ children, className }: PageTransitionProps) {
	const pathname = usePathname();

	const [mounted, setMounted] = useState(false);
	const rafRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		rafRef.current = requestAnimationFrame(() => {
			setMounted(true);
		});

		return () => {
			if (rafRef.current !== undefined) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);

	return (
		<motion.div
			key={pathname}
			className={className}
			initial={{ opacity: 0, y: 20 }}
			animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
			transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
		>
			{children}
		</motion.div>
	);
}
