import Link from "next/link";
import type { ReactNode } from "react";

import { type NavItem, siteNav } from "@/shared/config/site";
import { cn } from "@/shared/utils/cn";

import { NavLink } from "../common/NavLink";
import { Container } from "./Container";

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
			className={cn("bg-background/80 header-scroll-border relative top-0 z-40 backdrop-blur-lg md:mt-12", className)}
		>
			<Container>
				<nav className="flex items-center justify-between gap-4 py-4 md:py-6" aria-label="주요 메뉴">
					<Link
						href="/"
						aria-label="chan9yu 홈"
						className="text-foreground flex min-h-11 items-center text-lg font-bold tracking-tight transition-colors md:text-xl"
					>
						{"<chan9yu />"}
					</Link>

					{/* search/theme slot은 단일 인스턴스로 유지 — 양쪽에 렌더하면 두 번 마운트되어 ⌘K 리스너가 중복 등록됨 */}
					<div className="flex items-center gap-1 md:gap-2">
						<div className="mr-1 hidden items-center gap-1 md:flex">
							{navItems.map((item) => (
								<NavLink key={item.href} href={item.href}>
									{item.label}
								</NavLink>
							))}
						</div>
						{searchSlot}
						{themeSlot}
						<div className="md:hidden">{mobileMenuSlot}</div>
					</div>
				</nav>
			</Container>
		</header>
	);
}
