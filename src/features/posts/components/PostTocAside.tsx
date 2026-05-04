"use client";

import { ChevronLeft, X } from "lucide-react";
import { useState } from "react";

import type { TocItem } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

import { Toc } from "./Toc";

type PostTocAsideProps = {
	items: TocItem[];
};

/**
 * 데스크탑 TOC 토글 패턴:
 * - isOpen=true : aside lg:w-64 lg:ml-12 → X 닫기 버튼 + Toc nav
 * - isOpen=false: aside lg:w-0 lg:ml-0 → ChevronLeft(←) 버튼만 (overflow-visible로 노출)
 *
 * aside 자체가 lg:sticky이므로 inner sticky wrapper 불필요.
 * w-0 + ml-0 = flex 컨테이너에서 차지하는 공간 0 → article flex-1이 전체 너비 확보.
 */
export function PostTocAside({ items }: PostTocAsideProps) {
	const [isOpen, setIsOpen] = useState(true);

	if (items.length === 0) return null;

	return (
		<aside
			id="post-toc"
			aria-label="목차"
			className={cn(
				"hidden lg:sticky lg:top-24 lg:block lg:flex-none lg:self-start",
				"overflow-visible transition-[width,margin-left] duration-300 motion-reduce:transition-none",
				isOpen ? "lg:ml-12 lg:w-64" : "lg:ml-0 lg:w-0"
			)}
		>
			{isOpen ? (
				<div className="space-y-3">
					<div className="flex justify-end">
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							aria-label="목차 닫기"
							aria-expanded={true}
							aria-controls="post-toc"
							className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none motion-safe:hover:scale-110 motion-safe:active:scale-95"
						>
							<X className="size-4" aria-hidden />
						</button>
					</div>
					<Toc items={items} />
				</div>
			) : (
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					aria-label="목차 열기"
					aria-expanded={false}
					aria-controls="post-toc"
					className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex h-10 w-10 cursor-pointer items-center justify-center transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
				>
					<ChevronLeft className="size-5" aria-hidden />
				</button>
			)}
		</aside>
	);
}
