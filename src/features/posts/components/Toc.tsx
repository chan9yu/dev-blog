"use client";

import { cva } from "class-variance-authority";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";

import type { TocItem } from "@/shared/types";

type TocProps = {
	items: TocItem[];
};

const SCROLL_TOP_THRESHOLD_PX = 100;
const INTERSECTION_ROOT_MARGIN = "-100px 0px -66% 0px";
const HEADER_OFFSET_PX = 120;

const tocLink = cva(
	"focus-visible:ring-ring block rounded text-sm transition-all motion-reduce:transition-none duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:hover:translate-x-1",
	{
		variants: {
			active: {
				true: "text-accent font-semibold",
				false: "text-muted-foreground font-normal"
			}
		}
	}
);

const LEVEL_PADDING_CLASS: Record<2 | 3 | 4, string> = {
	2: "pl-0",
	3: "pl-3",
	4: "pl-6"
};

/**
 * 레거시 TableOfContents 디자인 참조:
 * - nav space-y-4 / h2 uppercase text-xs 목차
 * - ul max-h(calc) overflow-y-auto + space-y-2.5
 * - 항목: 레벨별 pl-0/pl-3/pl-6, 좌측 라인 없음
 * - 링크: block hover:translate-x-1, active text-accent font-semibold + aria-current="location"
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
				if (visible.length === 0) {
					return;
				}

				const topmost = visible.reduce((top, entry) =>
					entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top
				);

				setActiveId(topmost.target.id);
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

		return () => {
			observer.disconnect();
		};
	}, [items]);

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();

		const id = event.currentTarget.dataset.tocId;
		if (!id) return;

		const element = document.getElementById(id);
		if (!element) return;

		const offsetTop = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
		window.scrollTo({ top: offsetTop, behavior: "smooth" });
		window.history.replaceState(null, "", `#${id}`);
	};

	if (items.length === 0) {
		return null;
	}

	return (
		<nav aria-label="목차" className="space-y-4">
			<h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">목차</h2>
			<ul className="max-h-toc space-y-2.5 overflow-y-auto pr-2">
				{items.map((item) => {
					const isActive = activeId === item.id;

					return (
						<li key={item.id} className={LEVEL_PADDING_CLASS[item.level]}>
							<a
								href={`#${item.id}`}
								data-toc-id={item.id}
								onClick={handleClick}
								aria-current={isActive ? "location" : undefined}
								className={tocLink({ active: isActive })}
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
