import { cookies } from "next/headers";
import Link from "next/link";

import { ThemeSwitcher } from "@/components/theme-switcher";
import type { Theme } from "@/lib/theme";

const navItems = {
	"/": {
		name: "home"
	},
	"/blog": {
		name: "blog"
	}
} as const;

export async function Navbar() {
	const cookieStore = await cookies();
	const theme = (cookieStore.get("theme")?.value as Theme) || "light";

	return (
		<aside className="mb-16 -ml-[8px] tracking-tight">
			<div className="lg:sticky lg:top-20">
				<nav
					className="fade relative flex scroll-pr-6 flex-row items-start px-0 pb-0 md:relative md:overflow-auto"
					id="nav"
				>
					<div className="flex flex-row space-x-0 pr-10">
						{Object.entries(navItems).map(([path, { name }]) => (
							<Link
								key={path}
								href={path}
								className="relative m-1 flex px-2 py-1 align-middle transition-all hover:text-neutral-800 dark:hover:text-neutral-200"
							>
								{name}
							</Link>
						))}
						<ThemeSwitcher initialTheme={theme} />
					</div>
				</nav>
			</div>
		</aside>
	);
}
