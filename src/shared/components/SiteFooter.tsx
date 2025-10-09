export function SiteFooter() {
	const links = [
		{ href: "/rss", label: "RSS", external: false },
		{ href: "https://github.com/chan9yu", label: "GitHub", external: true },
		{ href: "mailto:dev.cgyeo@email.com", label: "Email", external: false }
	];

	return (
		<footer className="border-primary mt-24 border-t pt-12">
			<div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-2">
					<p className="text-primary text-sm font-medium">@chan9yu&apos;s dev blog</p>
					<p className="text-tertiary text-sm">
						프론트엔드 개발의 아이디어와 경험을 기록하는 개발 블로그
						<br />
						코드와 디자인, 사용자 경험을 아우르는 인사이트를 담습니다.
					</p>
				</div>

				<nav className="flex flex-wrap gap-6">
					{links.map((link) => (
						<a
							key={link.href}
							href={link.href}
							target={link.external ? "_blank" : undefined}
							rel={link.external ? "noopener noreferrer" : undefined}
							className="text-secondary text-sm font-medium transition-colors hover:text-[rgb(var(--color-accent))]"
						>
							{link.label}
						</a>
					))}
				</nav>
			</div>

			<div className="border-secondary text-tertiary mt-8 border-t pt-6 text-center text-sm">
				&copy; {new Date().getFullYear()} chan9yu. All rights reserved.
			</div>
		</footer>
	);
}
