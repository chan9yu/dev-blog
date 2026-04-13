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

export function Header({ navItems = siteNav, searchSlot, themeSlot, mobileMenuSlot, className }: HeaderProps) {
	return (
		<header
			className={cn("bg-background/80 border-border-subtle sticky top-0 z-40 border-b backdrop-blur-md", className)}
		>
			{/* Skip link — page layout에서 <main id="main-content" tabIndex={-1}> 제공 전제 */}
			<a
				href="#main-content"
				className="bg-foreground text-background focus-visible:ring-ring sr-only rounded-md px-3 py-2 text-sm font-medium focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
			>
				본문 바로가기
			</a>
			<Container>
				<div className="flex h-16 items-center justify-between gap-4">
					<Link href="/" aria-label="chan9yu 홈" className="text-foreground text-xl font-bold tracking-tight">
						chan9yu
					</Link>

					<nav className="hidden items-center gap-6 md:flex" aria-label="주요 메뉴">
						{navItems.map((item) => (
							<NavLink key={item.href} href={item.href}>
								{item.label}
							</NavLink>
						))}
					</nav>

					<div className="flex items-center gap-2">
						{searchSlot}
						{themeSlot}
						<div className="md:hidden">{mobileMenuSlot}</div>
					</div>
				</div>
			</Container>
		</header>
	);
}
