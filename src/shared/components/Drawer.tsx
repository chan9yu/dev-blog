"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import { cn } from "../utils";

type DrawerProps = {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
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

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="bg-primary/80 fixed inset-0 z-40 backdrop-blur-sm"
					/>

					{/* Drawer Panel */}
					<motion.div
						initial={slideDirection}
						animate={{ x: 0 }}
						exit={slideDirection}
						transition={{ type: "spring", damping: 30, stiffness: 300 }}
						className={cn("bg-elevated fixed top-0 z-50 h-screen w-64 shadow-2xl", positionClass, className)}
					>
						{children}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
