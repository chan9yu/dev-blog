import { cookies } from "next/headers";
import Link from "next/link";

import type { Theme } from "../utils";
import { NavLink, ThemeSwitcher } from ".";

const navItems = {
	"/": {
		name: "홈"
	},
	"/posts": {
		name: "블로그"
	},
	"/series": {
		name: "시리즈"
	},
	"/tags": {
		name: "태그"
	}
} as const;

export async function SiteNavbar() {
	const cookieStore = await cookies();
	const theme = (cookieStore.get("theme")?.value as Theme) || "light";

	return (
		<header
			className="sticky top-0 z-50 backdrop-blur-lg"
			style={{ backgroundColor: "rgb(var(--color-bg-primary) / 0.8)" }}
		>
			<nav className="flex items-center justify-between py-6">
				<div className="flex items-center gap-1">
					<Link
						href="/"
						className="text-xl font-bold tracking-tight transition-colors"
						style={{ color: "rgb(var(--color-text-primary))" }}
					>
						Blog9yu
					</Link>
				</div>

				<div className="flex items-center gap-1">
					{Object.entries(navItems).map(([path, { name }]) => (
						<NavLink key={path} href={path}>
							{name}
						</NavLink>
					))}
					<div className="ml-2">
						<ThemeSwitcher initialTheme={theme} />
					</div>
				</div>
			</nav>
		</header>
	);
}
