"use client";

import type { MouseEvent } from "react";
import { useEffect, useState } from "react";

import type { TocItem } from "@/features/blog/utils";
import { cn } from "@/shared/utils";

const SCROLL_TOP_THRESHOLD_PX = 100;
const INTERSECTION_ROOT_MARGIN = "-100px 0px -66% 0px";
const HEADER_OFFSET_PX = 120;

type TableOfContentsProps = {
	items: TocItem[];
};

export function TableOfContents({ items }: TableOfContentsProps) {
	const [activeId, setActiveId] = useState<string>("");

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				// 최상단 근처면 activeId 초기화
				if (window.scrollY < SCROLL_TOP_THRESHOLD_PX) {
					setActiveId("");
					return;
				}

				// 화면에 보이는 항목들 중 가장 위에 있는 것 선택
				const visibleEntries = entries.filter((entry) => entry.isIntersecting);

				if (visibleEntries.length > 0) {
					const topEntry = visibleEntries.reduce((top, entry) => {
						return entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top;
					});

					setActiveId(topEntry.target.id);
				}
			},
			{
				rootMargin: INTERSECTION_ROOT_MARGIN,
				threshold: [0, 0.5, 1]
			}
		);

		items.forEach(({ id }) => {
			const element = document.getElementById(id);
			if (element) {
				observer.observe(element);
			}
		});

		return () => observer.disconnect();
	}, [items]);

	const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
		e.preventDefault();

		const element = document.getElementById(id);
		if (!element) return;

		// 요소의 위치 계산 (헤더 오프셋 120px 고려)
		const elementPosition = element.getBoundingClientRect().top + window.scrollY;
		const offsetPosition = elementPosition - HEADER_OFFSET_PX;

		window.scrollTo({
			top: offsetPosition,
			behavior: "smooth"
		});

		// URL 업데이트 (replaceState 사용 - pathname 변경 안됨)
		window.history.replaceState(null, "", `#${id}`);
	};

	return (
		<nav className="space-y-4">
			<h2 className="text-tertiary text-sm font-bold tracking-wider uppercase">목차</h2>
			<ul className="max-h-[calc(100vh-24rem)] space-y-2.5 overflow-y-auto pr-2">
				{items.map((item, index) => {
					const isActive = activeId === item.id;
					return (
						<li key={`${item.id}-${index}`} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
							<a
								href={`#${item.id}`}
								onClick={(e) => handleClick(e, item.id)}
								className={cn(
									"block text-sm transition-all duration-200 hover:translate-x-1",
									isActive ? "text-accent font-semibold" : "text-secondary font-normal"
								)}
							>
								{item.title}
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
