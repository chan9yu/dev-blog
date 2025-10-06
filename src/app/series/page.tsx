import Link from "next/link";

import { getAllSeries } from "@/features/series";

export const metadata = {
	title: "시리즈",
	description: "연재 중인 시리즈별 포스트 모음"
};

export default async function SeriesPage() {
	const series = await getAllSeries();

	return (
		<div className="space-y-8">
			{/* Header */}
			<header className="space-y-3">
				<h1
					className="text-2xl font-bold tracking-tight sm:text-3xl"
					style={{ color: "rgb(var(--color-text-primary))" }}
				>
					시리즈
				</h1>
				<p className="text-sm leading-relaxed sm:text-base" style={{ color: "rgb(var(--color-text-secondary))" }}>
					연재 중인 시리즈별로 포스트를 모아보세요
				</p>
			</header>

			{/* Series Grid */}
			{series.length === 0 ? (
				<div
					className="flex flex-col items-center justify-center py-16 text-center"
					style={{ color: "rgb(var(--color-text-tertiary))" }}
				>
					<svg className="mb-4 h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						/>
					</svg>
					<p className="text-lg font-medium">아직 시리즈가 없습니다</p>
				</div>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{series.map((s) => (
						<Link
							key={s.url_slug}
							href={`/series/${s.url_slug}`}
							className="group rounded-xl border p-6 transition-all hover:shadow-md"
							style={{
								backgroundColor: "rgb(var(--color-bg-primary))",
								borderColor: "rgb(var(--color-border-primary))"
							}}
						>
							<div className="space-y-4">
								{/* Series Icon */}
								<div
									className="flex h-12 w-12 items-center justify-center rounded-lg"
									style={{ backgroundColor: "rgb(var(--color-bg-secondary))" }}
								>
									<svg
										className="h-6 w-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										style={{ color: "rgb(var(--color-accent))" }}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/>
									</svg>
								</div>

								{/* Series Info */}
								<div className="space-y-2">
									<h2
										className="text-lg font-bold tracking-tight transition-colors group-hover:text-[rgb(var(--color-accent))]"
										style={{ color: "rgb(var(--color-text-primary))" }}
									>
										{s.name}
									</h2>
									<p className="text-sm" style={{ color: "rgb(var(--color-text-tertiary))" }}>
										총 {s.posts.length}개의 포스트
									</p>
								</div>

								{/* Post Preview */}
								<div className="space-y-1.5 pt-2">
									{s.posts.slice(0, 3).map((post, idx) => (
										<div key={post.url_slug} className="flex items-start gap-2 text-sm">
											<span
												className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-medium"
												style={{
													backgroundColor: "rgb(var(--color-bg-tertiary))",
													color: "rgb(var(--color-text-tertiary))"
												}}
											>
												{idx + 1}
											</span>
											<span
												className="line-clamp-1 leading-relaxed"
												style={{ color: "rgb(var(--color-text-secondary))" }}
											>
												{post.title}
											</span>
										</div>
									))}
									{s.posts.length > 3 && (
										<p className="pl-7 text-xs" style={{ color: "rgb(var(--color-text-tertiary))" }}>
											+{s.posts.length - 3}개 더보기
										</p>
									)}
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
