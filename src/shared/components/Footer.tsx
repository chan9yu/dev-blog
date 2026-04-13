import { Rss } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

import { Container } from "./Container";
import { ScrollToTopButton } from "./ScrollToTopButton";

type FooterProps = {
	socialLinksSlot?: ReactNode;
	className?: string;
};

// 빌드 타임 기준 — SSG 빌드 시점에 고정. 매년 재배포 시 자동 갱신
const buildYear = new Date().getFullYear();

export function Footer({ socialLinksSlot, className }: FooterProps) {
	return (
		<footer aria-labelledby="site-footer-heading" className={cn("border-border-subtle border-t py-10", className)}>
			<h2 id="site-footer-heading" className="sr-only">
				사이트 푸터
			</h2>
			<Container>
				<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<p className="text-muted-foreground text-sm">© {buildYear} chan9yu. All rights reserved.</p>
					<nav aria-label="보조 링크" className="flex items-center gap-4">
						{socialLinksSlot}
						<Link
							href="/rss"
							aria-label="RSS 피드 구독"
							className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 inline-flex items-center justify-center rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
						>
							<Rss className="size-5" aria-hidden />
						</Link>
						<ScrollToTopButton />
					</nav>
				</div>
			</Container>
		</footer>
	);
}
