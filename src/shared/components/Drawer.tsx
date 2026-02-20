"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/shared/utils";

type DrawerProps = {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	position?: "left" | "right";
	className?: string;
};

export function Drawer({ isOpen, onClose, children, position = "right", className }: DrawerProps) {
	// 메뉴 열릴 때 스크롤 방지
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	const slideDirection = position === "right" ? { x: "100%" } : { x: "-100%" };
	const positionClass = position === "right" ? "right-0" : "left-0";

	// Portal을 사용하여 body에 직접 렌더링
	if (typeof document === "undefined") return null;

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 z-[100] bg-black/50"
					/>

					{/* Drawer Panel */}
					<motion.div
						role="dialog"
						aria-modal="true"
						initial={slideDirection}
						animate={{ x: 0 }}
						exit={slideDirection}
						transition={{ type: "spring", damping: 30, stiffness: 300 }}
						className={cn("bg-elevated fixed top-0 z-[110] h-screen w-64 shadow-2xl", positionClass, className)}
					>
						{children}
					</motion.div>
				</>
			)}
		</AnimatePresence>,
		document.body
	);
}
