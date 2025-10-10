"use client";

import { useState } from "react";

import ChevronRightIcon from "@/shared/assets/icons/chevron-right.svg";
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
						{/* Toggle Button - Always visible */}
						<button
							onClick={() => setIsTocOpen(!isTocOpen)}
							className={cn(
								"group absolute top-0 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300",
								"bg-secondary/80 hover:bg-tertiary backdrop-blur-sm",
								"shadow-lg hover:shadow-xl",
								"hover:scale-110 active:scale-95",
								isTocOpen ? "-left-12" : "left-0"
							)}
							aria-label={isTocOpen ? "목차 접기" : "목차 펼치기"}
						>
							<ChevronRightIcon
								className={cn(
									"h-5 w-5 transition-all duration-300",
									"text-tertiary group-hover:text-primary",
									!isTocOpen && "rotate-180"
								)}
							/>
						</button>

						{/* TOC Content */}
						{isTocOpen && (
							<div className="w-3xs">
								<TableOfContents items={tocItems} />
							</div>
						)}
					</div>
				</aside>
			)}
		</div>
	);
}
