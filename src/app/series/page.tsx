import type { Metadata } from "next";
import Link from "next/link";

import { getAllSeries } from "@/features/series";
import { SITE } from "@/shared/config";

export const metadata: Metadata = {
	title: "시리즈",
	description: "연재 중인 시리즈별로 포스트를 모아보세요. 체계적으로 구성된 학습 콘텐츠를 확인할 수 있습니다.",
	openGraph: {
		title: "시리즈 · chan9yu",
		description: "연재 중인 시리즈별 포스트 모음",
		type: "website",
		url: `${SITE.url}/series`
	},
	alternates: {
		canonical: `${SITE.url}/series`
	}
};

export default async function SeriesPage() {
	const series = await getAllSeries();

	return (
		<div className="space-y-8">
			<header className="space-y-3">
				<h1 className="text-primary text-2xl font-bold tracking-tight sm:text-3xl">시리즈</h1>
				<p className="text-secondary text-sm leading-relaxed sm:text-base">연재 중인 시리즈별로 포스트를 모아보세요</p>
			</header>

			{series.length === 0 ? (
				<div className="text-tertiary flex flex-col items-center justify-center py-16 text-center">
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
							key={s.slug}
							href={`/series/${s.slug}`}
							className="bg-primary border-primary group rounded-xl border p-6 transition-all hover:shadow-md"
						>
							<div className="space-y-4">
								<div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-lg">
									<svg className="text-accent h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/>
									</svg>
								</div>

								<div className="space-y-2">
									<h2 className="text-primary group-hover-accent text-lg font-bold tracking-tight transition-colors">
										{s.name}
									</h2>
									<p className="text-tertiary text-sm">총 {s.posts.length}개의 포스트</p>
								</div>

								<div className="space-y-1.5 pt-2">
									{s.posts.slice(0, 3).map((post, idx) => (
										<div key={post.slug} className="flex items-start gap-2 text-sm">
											<span className="bg-tertiary text-tertiary mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-medium">
												{idx + 1}
											</span>
											<span className="text-secondary line-clamp-1 leading-relaxed">{post.title}</span>
										</div>
									))}
									{s.posts.length > 3 && <p className="text-tertiary pl-7 text-xs">+{s.posts.length - 3}개 더보기</p>}
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
