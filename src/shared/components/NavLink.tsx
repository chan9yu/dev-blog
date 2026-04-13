"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

type NavLinkProps = ComponentProps<typeof Link> & {
	exact?: boolean;
};

export function NavLink({ href, exact = false, className, children, ...rest }: NavLinkProps) {
	const pathname = usePathname();
	const target = typeof href === "string" ? href : href.pathname;

	const isActive =
		target === undefined || target === null
			? false
			: exact || target === "/"
				? pathname === target
				: pathname === target || pathname.startsWith(`${target}/`);

	return (
		<Link
			href={href}
			aria-current={isActive ? "page" : undefined}
			className={cn(
				"focus-visible:ring-ring/50 inline-flex items-center rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
				isActive
					? "text-foreground decoration-foreground/60 font-semibold underline decoration-2 underline-offset-8"
					: "text-muted-foreground hover:text-foreground",
				className
			)}
			{...rest}
		>
			{children}
		</Link>
	);
}
