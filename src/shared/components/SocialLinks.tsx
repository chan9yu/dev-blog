import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type SocialLinkItem = {
	label: string;
	href: string;
	icon: ReactNode;
};

type SocialLinksProps = {
	items: SocialLinkItem[];
	className?: string;
};

/**
 * 레거시 SocialLinks 디자인: 아이콘+텍스트 버튼형, hover 시 살짝 위로 + scale + shadow.
 * 외부 링크는 target="_blank" + rel="noopener noreferrer" (mailto는 제외).
 */
export function SocialLinks({ items, className }: SocialLinksProps) {
	return (
		<ul className={cn("flex flex-wrap gap-3", className)}>
			{items.map((item) => {
				const isExternal = /^https?:\/\//i.test(item.href);
				return (
					<li key={item.href}>
						<a
							href={item.href}
							target={isExternal ? "_blank" : undefined}
							rel={isExternal ? "noopener noreferrer" : undefined}
							aria-label={item.label}
							className="bg-card text-foreground border-border-subtle focus-visible:ring-ring group inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.03]"
						>
							<span className="inline-flex size-4 items-center justify-center transition-transform duration-200 motion-safe:group-hover:rotate-12">
								{item.icon}
							</span>
							{item.label}
						</a>
					</li>
				);
			})}
		</ul>
	);
}
