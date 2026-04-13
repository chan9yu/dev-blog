import type { ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

type SidebarProps = ComponentProps<"aside">;

export function Sidebar({ className, children, ...rest }: SidebarProps) {
	return (
		<aside className={cn("w-full space-y-6 md:sticky md:top-20 md:w-72 md:self-start lg:w-80", className)} {...rest}>
			{children}
		</aside>
	);
}
