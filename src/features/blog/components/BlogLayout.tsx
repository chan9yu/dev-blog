"use client";

import { useState } from "react";

import ChevronRightIcon from "@/shared/assets/icons/chevron-right.svg";
import XIcon from "@/shared/assets/icons/x.svg";
import { cn } from "@/shared/utils";

import type { TocItem } from "../utils";
import { TableOfContents } from "./TableOfContents";

type BlogLayoutProps = {
	tocItems: TocItem[];
	children: React.ReactNode;
};

export function BlogLayout({ tocItems, children }: BlogLayoutProps) {
	const [isTocOpen, setIsTocOpen] = useState(true);

	return (
		<div className="relative flex xl:gap-8">
			{children}

			{/* TOC - Desktop Only */}
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
									onClick={() => setIsTocOpen(!isTocOpen)}
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
									/>
								</button>
								<TableOfContents items={tocItems} />
							</div>
						)}

						{/* Toggle Button - When closed */}
						{!isTocOpen && (
							<button
								onClick={() => setIsTocOpen(!isTocOpen)}
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
								/>
							</button>
						)}
					</div>
				</aside>
			)}
		</div>
	);
}
