import { cookies } from "next/headers";
import Link from "next/link";

import type { Theme } from "../utils";
import { MobileMenu, NavLink, ThemeSwitcher } from ".";

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
		<header className="bg-primary/80 sticky top-0 z-50 backdrop-blur-lg md:mt-12">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 md:px-8 md:py-6 lg:px-12">
				<div className="flex items-center gap-1">
					<Link href="/" className="text-primary text-lg font-bold tracking-tight transition-colors md:text-xl">
						{"<chan9yu />"}
					</Link>
				</div>

				{/* Desktop Navigation */}
				<div className="hidden items-center gap-1 md:flex">
					{Object.entries(navItems).map(([path, { name }]) => (
						<NavLink key={path} href={path}>
							{name}
						</NavLink>
					))}
					<div className="ml-2 flex items-center justify-center">
						<ThemeSwitcher initialTheme={theme} />
					</div>
				</div>

				{/* Mobile Navigation */}
				<div className="flex items-center gap-2 md:hidden">
					<ThemeSwitcher initialTheme={theme} />
					<MobileMenu />
				</div>
			</nav>
		</header>
	);
}
