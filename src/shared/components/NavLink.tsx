"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
	href: string;
	children: React.ReactNode;
};

export function NavLink({ href, children }: NavLinkProps) {
	const pathname = usePathname();
	const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

	return (
		<Link
			href={href}
			className={`rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-[rgb(var(--color-bg-secondary))] ${
				isActive ? "bg-[rgb(var(--color-bg-secondary))]" : ""
			}`}
			style={{
				color: isActive ? "rgb(var(--color-accent))" : "rgb(var(--color-text-secondary))"
			}}
		>
			{children}
		</Link>
	);
}
