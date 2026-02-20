"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useId, useState } from "react";

import type { TocItem } from "@/features/blog/utils";
import ChevronRightIcon from "@/shared/assets/icons/chevron-right.svg";
import MenuIcon from "@/shared/assets/icons/menu.svg";
import XIcon from "@/shared/assets/icons/x.svg";
import { cn } from "@/shared/utils";

import { TableOfContents } from "./TableOfContents";

type BlogLayoutProps = {
	tocItems: TocItem[];
	children: ReactNode;
};

export function BlogLayout({ tocItems, children }: BlogLayoutProps) {
	const [isTocOpen, setIsTocOpen] = useState(true);
	const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
	const mobileTocTitleId = useId();

	const handleToggleToc = () => setIsTocOpen((prev) => !prev);
	const handleOpenMobileToc = () => setIsMobileTocOpen(true);
	const handleCloseMobileToc = () => setIsMobileTocOpen(false);

	return (
		<div className="relative flex xl:gap-8">
			{children}

			{/* TOC - Desktop Only (XL+) */}
			{tocItems.length > 0 && (
				<aside
					className={cn("hidden flex-none transition-all duration-300 xl:block", isTocOpen ? "xl:w-3xs" : "xl:w-0")}
				>
					<div className="sticky top-24">
						{/* TOC Content */}
						{isTocOpen && (
							<div className="relative w-3xs">
								{/* Close Button */}
								<button
									onClick={handleToggleToc}
									className={cn(
										"group absolute -top-3 -right-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-300",
										"bg-secondary/80 hover:bg-tertiary backdrop-blur-sm",
										"shadow-lg hover:shadow-xl",
										"hover:scale-110 active:scale-95"
									)}
									aria-label="목차 접기"
								>
									<XIcon
										className={cn("h-4 w-4 transition-all duration-300", "text-tertiary group-hover:text-primary")}
										aria-hidden="true"
									/>
								</button>
								<TableOfContents items={tocItems} />
							</div>
						)}

						{/* Toggle Button - When closed */}
						{!isTocOpen && (
							<button
								onClick={handleToggleToc}
								className={cn(
									"group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300",
									"bg-secondary/80 hover:bg-tertiary backdrop-blur-sm",
									"shadow-lg hover:shadow-xl",
									"hover:scale-110 active:scale-95"
								)}
								aria-label="목차 펼치기"
							>
								<ChevronRightIcon
									className={cn(
										"h-5 w-5 rotate-180 transition-all duration-300",
										"text-tertiary group-hover:text-primary"
									)}
									aria-hidden="true"
								/>
							</button>
						)}
					</div>
				</aside>
			)}

			{/* Mobile TOC Button (Mobile only) */}
			{tocItems.length > 0 && (
				<>
					<button
						onClick={handleOpenMobileToc}
						className={cn(
							"fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 xl:hidden",
							"bg-accent shadow-lg hover:shadow-xl",
							"hover:scale-110 active:scale-95"
						)}
						aria-label="목차 열기"
						aria-expanded={isMobileTocOpen}
					>
						<MenuIcon className="text-on-accent size-6" aria-hidden="true" />
					</button>

					{/* Mobile TOC Bottom Sheet */}
					<AnimatePresence>
						{isMobileTocOpen && (
							<>
								{/* Backdrop */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									onClick={handleCloseMobileToc}
									className="bg-primary/80 fixed inset-0 z-50 backdrop-blur-sm xl:hidden"
								/>

								{/* Bottom Sheet */}
								<motion.div
									role="dialog"
									aria-modal="true"
									aria-labelledby={mobileTocTitleId}
									initial={{ y: "100%" }}
									animate={{ y: 0 }}
									exit={{ y: "100%" }}
									transition={{ type: "spring", damping: 30, stiffness: 300 }}
									className="bg-elevated fixed right-0 bottom-0 left-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl shadow-2xl xl:hidden"
								>
									<div className="sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 backdrop-blur-sm">
										<h2 id={mobileTocTitleId} className="text-primary text-lg font-bold">
											목차
										</h2>
										<button
											onClick={handleCloseMobileToc}
											className="text-secondary hover:text-primary hover:bg-secondary flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
											aria-label="목차 닫기"
										>
											<XIcon className="size-5" aria-hidden="true" />
										</button>
									</div>
									<div className="p-6" onClick={handleCloseMobileToc}>
										<TableOfContents items={tocItems} />
									</div>
								</motion.div>
							</>
						)}
					</AnimatePresence>
				</>
			)}
		</div>
	);
}
