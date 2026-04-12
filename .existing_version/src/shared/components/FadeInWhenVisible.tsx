"use client";

import { motion, useInView } from "framer-motion";
import { type ReactNode, useRef } from "react";

type FadeInWhenVisibleProps = {
	children: ReactNode;
	delay?: number;
};

export function FadeInWhenVisible({ children, delay = 0 }: FadeInWhenVisibleProps) {
	const ref = useRef(null);
	const isInView = useInView(ref, {
		once: true,
		margin: "-50px"
	});

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 30 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
			transition={{
				duration: 0.5,
				delay,
				ease: [0.4, 0, 0.2, 1]
			}}
		>
			{children}
		</motion.div>
	);
}
