"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/shared/utils";

type NavLinkProps = {
	href: string;
	children: ReactNode;
};

export function NavLink({ href, children }: NavLinkProps) {
	const pathname = usePathname();
	const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

	return (
		<Link
			href={href}
			className={cn(
				"rounded-lg px-4 py-2 text-sm font-medium transition-all",
				"hover:bg-secondary",
				isActive ? "bg-secondary text-accent" : "text-secondary"
			)}
		>
			{children}
		</Link>
	);
}
