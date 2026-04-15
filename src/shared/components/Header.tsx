import Link from "next/link";
import type { ReactNode } from "react";

import { type NavItem, siteNav } from "@/shared/config/site";
import { cn } from "@/shared/utils/cn";

import { Container } from "./Container";
import { NavLink } from "./NavLink";

type HeaderProps = {
	navItems?: NavItem[];
	searchSlot?: ReactNode;
	themeSlot?: ReactNode;
	mobileMenuSlot?: ReactNode;
	className?: string;
};

/**
 * 레거시 SiteNavbar 디자인 참조:
 * - sticky top-0 + backdrop-blur
 * - 데스크톱에서 상단 여백 md:mt-12 (브레이싱 효과)
 * - Container max-w-6xl + 가로 패딩
 * - 로고는 문자열 `<chan9yu />` (font-mono 아님, 일반 font-bold)
 */
export function Header({ navItems = siteNav, searchSlot, themeSlot, mobileMenuSlot, className }: HeaderProps) {
	return (
		<header className={cn("bg-background/80 sticky top-0 z-40 backdrop-blur-lg md:mt-12", className)}>
			<a
				href="#main-content"
				className="bg-foreground text-background focus-visible:ring-ring sr-only rounded-md px-3 py-2 text-sm font-medium focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
			>
				본문 바로가기
			</a>
			<Container>
				<nav className="flex items-center justify-between gap-4 py-4 md:py-6" aria-label="주요 메뉴">
					<Link
						href="/"
						aria-label="chan9yu 홈"
						className="text-foreground text-lg font-bold tracking-tight transition-colors md:text-xl"
					>
						{"<chan9yu />"}
					</Link>

					<div className="hidden items-center gap-1 md:flex">
						{navItems.map((item) => (
							<NavLink key={item.href} href={item.href}>
								{item.label}
							</NavLink>
						))}
						<div className="ml-2 flex items-center gap-1">
							{searchSlot}
							{themeSlot}
						</div>
					</div>

					<div className="flex items-center gap-2 md:hidden">
						{searchSlot}
						{themeSlot}
						{mobileMenuSlot}
					</div>
				</nav>
			</Container>
		</header>
	);
}
