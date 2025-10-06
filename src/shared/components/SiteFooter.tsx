export function SiteFooter() {
	const links = [
		{ href: "/rss", label: "RSS", external: false },
		{ href: "https://github.com", label: "GitHub", external: true },
		{ href: "mailto:your@email.com", label: "Email", external: false }
	];

	return (
		<footer className="mt-24 border-t pt-12" style={{ borderColor: "rgb(var(--color-border-primary))" }}>
			<div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-2">
					<p className="text-sm font-medium" style={{ color: "rgb(var(--color-text-primary))" }}>
						Blog9yu.dev
					</p>
					<p className="text-sm" style={{ color: "rgb(var(--color-text-tertiary))" }}>
						프론트엔드 개발 블로그
					</p>
				</div>

				<nav className="flex flex-wrap gap-6">
					{links.map((link) => (
						<a
							key={link.href}
							href={link.href}
							target={link.external ? "_blank" : undefined}
							rel={link.external ? "noopener noreferrer" : undefined}
							className="text-sm font-medium transition-colors hover:text-[rgb(var(--color-accent))]"
							style={{ color: "rgb(var(--color-text-secondary))" }}
						>
							{link.label}
						</a>
					))}
				</nav>
			</div>

			<div
				className="mt-8 border-t pt-6 text-center text-sm"
				style={{ borderColor: "rgb(var(--color-border-secondary))", color: "rgb(var(--color-text-tertiary))" }}
			>
				© {new Date().getFullYear()} Blog9yu. All rights reserved.
			</div>
		</footer>
	);
}
