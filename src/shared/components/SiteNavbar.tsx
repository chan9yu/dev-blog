import { cookies } from "next/headers";
import Link from "next/link";

import type { Theme } from "../utils";
import { NavLink, ThemeSwitcher } from ".";

const navItems = {
	"/": {
		name: "홈"
	},
	"/posts": {
		name: "포스트"
	},
	"/series": {
		name: "시리즈"
	},
	"/tags": {
		name: "태그"
	},
	"/about": {
		name: "About"
	}
} as const;

export async function SiteNavbar() {
	const cookieStore = await cookies();
	const theme = (cookieStore.get("theme")?.value as Theme) || "light";

	return (
		<header className="bg-primary/80 sticky top-0 z-50 mt-12 backdrop-blur-lg">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-12 py-6">
				<div className="flex items-center gap-1">
					<Link href="/" className="text-primary text-xl font-bold tracking-tight transition-colors">
						{"<chan9yu />"}
					</Link>
				</div>

				<div className="flex items-center gap-1">
					{Object.entries(navItems).map(([path, { name }]) => (
						<NavLink key={path} href={path}>
							{name}
						</NavLink>
					))}
					<div className="ml-2 flex items-center justify-center">
						<ThemeSwitcher initialTheme={theme} />
					</div>
				</div>
			</nav>
		</header>
	);
}
