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
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				});
			},
			{ rootMargin: "-100px 0px -66% 0px", threshold: 0.5 }
		);

		items.forEach(({ id }) => {
			const element = document.getElementById(id);
			if (element) {
				observer.observe(element);
			}
		});

		return () => observer.disconnect();
	}, [items]);

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
