"use client";

import { useEffect, useState } from "react";

import type { TocItem } from "../utils";

type TableOfContentsProps = {
	items: TocItem[];
};

export function TableOfContents({ items }: TableOfContentsProps) {
	const [activeId, setActiveId] = useState<string>("");

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				// 최상단 근처면 activeId 초기화
				if (window.scrollY < 100) {
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
				rootMargin: "-100px 0px -66% 0px",
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

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
		e.preventDefault();

		const element = document.getElementById(id);
		if (!element) return;

		// 요소의 위치 계산 (헤더 오프셋 120px 고려)
		const elementPosition = element.getBoundingClientRect().top + window.scrollY;
		const offsetPosition = elementPosition - 120;

		window.scrollTo({
			top: offsetPosition,
			behavior: "smooth"
		});

		// URL 업데이트 (replaceState 사용 - pathname 변경 안됨)
		window.history.replaceState(null, "", `#${id}`);
	};

	return (
		<nav className="space-y-4">
			<h2 className="text-sm font-bold tracking-wider uppercase" style={{ color: "rgb(var(--color-text-tertiary))" }}>
				목차
			</h2>
			<ul className="space-y-2.5">
				{items.map((item, index) => {
					const isActive = activeId === item.id;
					return (
						<li key={`${item.id}-${index}`} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
							<a
								href={`#${item.id}`}
								onClick={(e) => handleClick(e, item.id)}
								className={`block text-sm transition-all duration-200 hover:translate-x-1 ${
									isActive ? "font-semibold" : "font-normal"
								}`}
								style={{
									color: isActive ? "rgb(var(--color-accent))" : "rgb(var(--color-text-secondary))"
								}}
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
