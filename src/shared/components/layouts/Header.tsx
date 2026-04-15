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
		<header className={cn("bg-background/80 sticky top-0 z-40 backdrop-blur-lg md:mt-12", className)}>
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
