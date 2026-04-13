import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type SocialLink = {
	label: string;
	href: string;
	icon: ReactNode;
};

type SocialLinksProps = {
	items: SocialLink[];
	className?: string;
};

export function SocialLinks({ items, className }: SocialLinksProps) {
	return (
		<ul className={cn("flex items-center gap-3", className)}>
			{items.map((item) => (
				<li key={item.href}>
					<a
						href={item.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={item.label}
						className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 inline-flex items-center justify-center rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						{item.icon}
					</a>
				</li>
			))}
		</ul>
	);
}
