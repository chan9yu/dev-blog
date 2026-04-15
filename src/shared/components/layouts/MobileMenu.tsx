"use client";

import { Menu } from "lucide-react";
import type { ReactNode } from "react";

import { Sheet } from "@/shared/components/ui/Sheet";
import { type NavItem, siteNav } from "@/shared/config/site";

import { NavLink } from "../common/NavLink";

type MobileMenuProps = {
	navItems?: NavItem[];
	socialLinksSlot?: ReactNode;
	triggerLabel?: string;
};

export function MobileMenu({ navItems = siteNav, socialLinksSlot, triggerLabel = "메뉴 열기" }: MobileMenuProps) {
	return (
		<Sheet>
			<Sheet.Trigger
				aria-label={triggerLabel}
				className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 inline-flex size-11 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
			>
				<Menu className="size-5" aria-hidden />
			</Sheet.Trigger>
			<Sheet.Content side="right" className="flex w-72 max-w-[85vw] flex-col sm:max-w-sm">
				<Sheet.Header>
					<Sheet.Title>메뉴</Sheet.Title>
					<Sheet.Description className="sr-only">사이트 내비게이션 메뉴</Sheet.Description>
				</Sheet.Header>
				<nav className="mt-2 flex flex-col gap-1 px-4" aria-label="모바일 메뉴">
					{navItems.map((item) => (
						<Sheet.Close asChild key={item.href}>
							<NavLink href={item.href} className="hover:bg-muted px-3 py-2 font-medium">
								{item.label}
							</NavLink>
						</Sheet.Close>
					))}
				</nav>
				{socialLinksSlot && <div className="border-border-subtle mt-auto border-t p-4">{socialLinksSlot}</div>}
			</Sheet.Content>
		</Sheet>
	);
}
