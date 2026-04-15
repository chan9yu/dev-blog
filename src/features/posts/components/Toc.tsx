"use client";

import type { MouseEvent } from "react";
import { useEffect, useState } from "react";

import type { TocItem } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

type TocProps = {
	items: TocItem[];
};

const SCROLL_TOP_THRESHOLD_PX = 100;
const INTERSECTION_ROOT_MARGIN = "-100px 0px -66% 0px";
const HEADER_OFFSET_PX = 120;

/**
 * 레거시 TableOfContents 디자인 참조:
 * - nav space-y-4 / h2 uppercase text-xs 목차
 * - ul max-h-[calc(100vh-24rem)] overflow-y-auto + space-y-2.5
 * - 항목: inline padding-left (level - 1) * 12px, 좌측 라인 없음
 * - 링크: block hover:translate-x-1, active text-accent font-semibold
 * - 클릭 시 HEADER_OFFSET_PX(120) 만큼 위로 offset 이동 + hash 업데이트
 */
export function Toc({ items }: TocProps) {
	const [activeId, setActiveId] = useState<string | null>(null);

	useEffect(() => {
		if (items.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (window.scrollY < SCROLL_TOP_THRESHOLD_PX) {
					setActiveId(null);
					return;
				}
				const visible = entries.filter((entry) => entry.isIntersecting);
				if (visible.length === 0) return;
				const topmost = visible.reduce((top, entry) =>
					entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top
				);
				setActiveId(topmost.target.id);
			},
			{ rootMargin: INTERSECTION_ROOT_MARGIN, threshold: [0, 0.5, 1] }
		);

		items.forEach(({ id }) => {
			const element = document.getElementById(id);
			if (element) observer.observe(element);
		});

		return () => observer.disconnect();
	}, [items]);

	const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
		event.preventDefault();
		const element = document.getElementById(id);
		if (!element) return;
		const offsetTop = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
		window.scrollTo({ top: offsetTop, behavior: "smooth" });
		window.history.replaceState(null, "", `#${id}`);
	};

	if (items.length === 0) return null;

	return (
		<nav aria-label="목차" className="space-y-4">
			<h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">목차</h2>
			<ul className="max-h-[calc(100vh-24rem)] space-y-2.5 overflow-y-auto pr-2">
				{items.map((item, index) => {
					const isActive = activeId === item.id;
					return (
						<li key={`${item.id}-${index}`} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
							<a
								href={`#${item.id}`}
								onClick={(event) => handleClick(event, item.id)}
								className={cn(
									"focus-visible:ring-ring block rounded text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:hover:translate-x-1",
									isActive ? "text-accent font-semibold" : "text-muted-foreground font-normal"
								)}
							>
								{item.text}
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
