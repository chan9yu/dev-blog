"use client";

import { useEffect, useRef, useState } from "react";

import type { TocItem } from "../utils";

type TableOfContentsProps = {
	items: TocItem[];
};

export function TableOfContents({ items }: TableOfContentsProps) {
	const [activeId, setActiveId] = useState<string>("");
	const scrollingRef = useRef(false);
	const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		let debounceTimeout: NodeJS.Timeout | null = null;

		const handleScroll = () => {
			// 스크롤 시작 플래그 설정
			scrollingRef.current = true;

			// 기존 타임아웃 클리어
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}

			// 100ms 후 스크롤 종료로 간주
			scrollTimeoutRef.current = setTimeout(() => {
				scrollingRef.current = false;
			}, 100);

			// 맨 위에 있으면 activeId 초기화
			if (window.scrollY < 100) {
				if (debounceTimeout) clearTimeout(debounceTimeout);
				debounceTimeout = setTimeout(() => {
					setActiveId("");
				}, 50);
			}
		};

		const observer = new IntersectionObserver(
			(entries) => {
				// 프로그래밍 방식 스크롤 중이면 무시
				if (scrollingRef.current) return;

				// 맨 위에 있으면 무시
				if (window.scrollY < 100) return;

				// intersecting 중인 항목들 찾기
				const intersectingEntries = entries.filter((entry) => entry.isIntersecting);

				if (intersectingEntries.length > 0) {
					// 가장 위에 있는 항목 선택
					const topEntry = intersectingEntries.reduce((top, entry) => {
						const topY = top.boundingClientRect.top;
						const entryY = entry.boundingClientRect.top;
						return entryY < topY ? entry : top;
					});

					if (debounceTimeout) clearTimeout(debounceTimeout);
					debounceTimeout = setTimeout(() => {
						setActiveId(topEntry.target.id);
					}, 50);
				}
			},
			{ rootMargin: "-100px 0px -66% 0px", threshold: [0, 0.5, 1] }
		);

		items.forEach(({ id }) => {
			const element = document.getElementById(id);
			if (element) {
				observer.observe(element);
			}
		});

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", handleScroll);
			if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
			if (debounceTimeout) clearTimeout(debounceTimeout);
		};
	}, [items]);

	const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
		e.preventDefault();

		// 즉시 activeId 업데이트 (하이라이트 표시)
		setActiveId(id);

		// 스크롤 플래그 설정 (IntersectionObserver 비활성화)
		scrollingRef.current = true;

		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
			// URL 업데이트
			window.history.replaceState(null, "", `#${id}`);

			// 스크롤 완료 후 플래그 해제 (800ms 후)
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
			scrollTimeoutRef.current = setTimeout(() => {
				scrollingRef.current = false;
			}, 800);
		}
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
								onClick={(e) => handleLinkClick(e, item.id)}
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
