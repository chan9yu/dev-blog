"use client";

import { useEffect, useState } from "react";

import type { TocItem } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

type TocProps = {
	items: TocItem[];
};

export function Toc({ items }: TocProps) {
	const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

	useEffect(() => {
		if (items.length === 0) return;
		const headings = items
			.map((item) => document.getElementById(item.id))
			.filter((el): el is HTMLElement => el !== null);
		if (headings.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				if (visible[0]) setActiveId(visible[0].target.id);
			},
			{ rootMargin: "-20% 0px -60% 0px" }
		);

		headings.forEach((heading) => observer.observe(heading));
		return () => observer.disconnect();
	}, [items]);

	if (items.length === 0) return null;

	return (
		<nav aria-label="목차" className="space-y-3">
			<h2 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">목차</h2>
			<ul className="border-border-subtle space-y-1 border-l">
				{items.map((item) => (
					<li key={item.id}>
						<a
							href={`#${item.id}`}
							className={cn(
								"focus-visible:ring-ring -ml-px block border-l-2 py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
								item.level === 3 ? "pl-6" : "pl-3",
								activeId === item.id
									? "border-accent text-accent font-medium"
									: "text-muted-foreground hover:text-foreground border-transparent"
							)}
						>
							{item.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
