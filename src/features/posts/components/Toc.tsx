"use client";

import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { AlignLeft, X } from "lucide-react";
import type { MouseEvent } from "react";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import type { TocItem } from "@/shared/types";

type TocProps = {
	items: TocItem[];
};

const SCROLL_TOP_THRESHOLD_PX = 100;
const INTERSECTION_ROOT_MARGIN = "-100px 0px -66% 0px";
const HEADER_OFFSET_PX = 120;

const tocLink = cva(
	"focus-visible:ring-ring block rounded border-l-2 pl-2 text-sm transition-all motion-reduce:transition-none duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:hover:translate-x-1",
	{
		variants: {
			active: {
				true: "border-accent text-accent font-semibold",
				false: "border-transparent text-muted-foreground font-normal"
			}
		}
	}
);

// Portal guard: SSR=false, CSR=true — useSyncExternalStore로 hydration-safe하게 구현
function subscribe() {
	return () => {};
}
function getClientSnapshot() {
	return true;
}
function getServerSnapshot() {
	return false;
}

// MDX 작성 레벨 기준 들여쓰기: # → 0, ## → 한 단계, ### → 두 단계
const LEVEL_PADDING_CLASS: Record<1 | 2 | 3, string> = {
	1: "pl-0",
	2: "pl-3",
	3: "pl-6"
};

/**
 * 레거시 TableOfContents + BlogLayout(mobile) 디자인 참조:
 * - Desktop: nav space-y-4 / h2 uppercase text-xs 목차 / ul max-h overflow-y-auto
 * - Mobile: createPortal → fixed FAB(left-6 bottom-6) + bottom-sheet 드로어(AnimatePresence)
 * - 링크: 레벨별 pl-0/pl-3/pl-6, hover:translate-x-1, active text-accent font-semibold
 * - 클릭 시 HEADER_OFFSET_PX(120) offset 이동 + hash 업데이트 + mobile sheet 닫기
 */
export function Toc({ items }: TocProps) {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	// Portal guard: SSR=false, CSR=true (useSyncExternalStore로 hydration-safe 구현)
	const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
	const mobileTitleId = useId();

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

	// ESC 키로 모바일 드로어 닫기 (a11y)
	useEffect(() => {
		if (!isMobileOpen) return;

		const handleKeyDown = (event: globalThis.KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsMobileOpen(false);
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isMobileOpen]);

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();

		const id = event.currentTarget.dataset.tocId;
		if (!id) return;

		const element = document.getElementById(id);
		if (!element) return;

		const offsetTop = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
		window.scrollTo({ top: offsetTop, behavior: "smooth" });
		window.history.replaceState(null, "", `#${id}`);
		// 모바일 드로어: TOC 항목 클릭 시 자동 닫기
		setIsMobileOpen(false);
	};

	const handleCloseMobile = () => setIsMobileOpen(false);

	if (items.length === 0) {
		return null;
	}

	const tocItems = items.map((item) => {
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
	});

	return (
		<>
			{/* Desktop TOC — aside(hidden lg:block) 내부에서 렌더 */}
			<nav aria-label="목차" className="space-y-4">
				<h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">목차</h2>
				<ul className="max-h-toc space-y-2.5 overflow-y-auto pr-2">{tocItems}</ul>
			</nav>

			{/* Mobile TOC — createPortal로 body에 직접 마운트 (aside hidden 영향 없음) */}
			{mounted &&
				createPortal(
					<>
						{/* FAB 버튼: ScrollToTop(right-8 bottom-8)과 겹치지 않도록 left 배치 */}
						<button
							type="button"
							onClick={() => setIsMobileOpen(true)}
							aria-label="목차 열기"
							aria-expanded={isMobileOpen}
							aria-controls="mobile-toc-sheet"
							className="bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-ring fixed bottom-6 left-6 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full shadow-lg shadow-black/15 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:hover:scale-110 motion-safe:active:scale-95 lg:hidden"
						>
							<AlignLeft className="size-5" aria-hidden />
						</button>

						{/* Bottom Sheet 드로어 */}
						<AnimatePresence>
							{isMobileOpen && (
								<>
									{/* 배경 오버레이 */}
									<motion.div
										key="toc-backdrop"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}
										onClick={handleCloseMobile}
										className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
										aria-hidden="true"
									/>

									{/* Bottom Sheet */}
									<motion.div
										key="toc-sheet"
										id="mobile-toc-sheet"
										role="dialog"
										aria-modal="true"
										aria-labelledby={mobileTitleId}
										initial={{ y: "100%" }}
										animate={{ y: 0 }}
										exit={{ y: "100%" }}
										transition={{ type: "spring", damping: 30, stiffness: 300 }}
										className="bg-background max-h-mobile-sheet fixed inset-x-0 bottom-0 z-50 overflow-y-auto rounded-t-2xl shadow-2xl lg:hidden"
									>
										{/* 헤더 */}
										<div className="border-border-subtle bg-background/80 sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 backdrop-blur-sm">
											<h2 id={mobileTitleId} className="text-lg font-bold">
												목차
											</h2>
											<button
												type="button"
												onClick={handleCloseMobile}
												aria-label="목차 닫기"
												className="text-muted-foreground hover:bg-bg-subtle hover:text-foreground focus-visible:ring-ring flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
											>
												<X className="size-5" aria-hidden />
											</button>
										</div>

										{/* TOC 목록 */}
										<nav aria-label="목차 (모바일)" className="p-6">
											<ul className="space-y-2.5">{tocItems}</ul>
										</nav>
									</motion.div>
								</>
							)}
						</AnimatePresence>
					</>,
					document.body
				)}
		</>
	);
}
