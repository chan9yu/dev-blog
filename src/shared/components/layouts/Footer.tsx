import { Rss } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "./Container";

type FooterLink = {
	href: string;
	label: string;
	external: boolean;
	icon?: ReactNode;
};

// RSS는 XML 응답이므로 같은 탭에서 열면 raw XML이 노출되어 UX가 나쁘다 → external: true.
const FOOTER_LINKS: ReadonlyArray<FooterLink> = [
	{ href: "/rss", label: "RSS", external: true, icon: <Rss className="size-4" aria-hidden /> },
	{ href: "https://github.com/chan9yu", label: "GitHub", external: true },
	{ href: "mailto:dev.cgyeo@gmail.com", label: "Email", external: false }
];

// 빌드 시점에 연도를 고정한다. Next.js 16 Server Component 프리렌더 중
// new Date() 호출은 허용되지 않으므로(next/prerender-current-time 에러),
// 모듈 초기화 시점에 평가해 SSG 빌드 연도를 사용한다.
const BUILD_YEAR = new Date().getFullYear();

/**
 * 레거시 SiteFooter 디자인 참조:
 * - border-t + mt-24 pt-12
 * - 2-column: 브랜드(좌) · 링크(우)
 * - 하단 copyright 중앙 정렬 + border-t
 */
export function Footer() {
	return (
		<footer className="border-border-subtle mt-24 border-t pt-12 pb-8">
			<Container>
				<div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-2">
						<p className="text-foreground text-sm font-medium">@chan9yu&apos;s dev blog</p>
						<p className="text-muted-foreground text-sm leading-relaxed">
							프론트엔드 개발의 아이디어와 경험을 기록하는 개발 블로그
							<br />
							코드와 디자인, 사용자 경험을 아우르는 인사이트를 담습니다.
						</p>
					</div>

					<nav className="flex flex-wrap items-center gap-6" aria-label="푸터 링크">
						{FOOTER_LINKS.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								target={link.external ? "_blank" : undefined}
								rel={link.external ? "noopener noreferrer" : undefined}
								className="text-muted-foreground hover:text-accent focus-visible:ring-ring inline-flex items-center gap-1.5 rounded text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
							>
								{link.icon}
								{link.label}
								{link.external && <span className="sr-only"> (새 창에서 열림)</span>}
							</Link>
						))}
					</nav>
				</div>

				<div className="border-border-subtle text-muted-foreground mt-8 border-t pt-6 text-center text-sm">
					© {BUILD_YEAR} chan9yu. All rights reserved.
				</div>
			</Container>
		</footer>
	);
}
