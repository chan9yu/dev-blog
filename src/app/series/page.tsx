import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/shared/components/Container";
import { seriesFixture } from "@/shared/fixtures/series";

export const metadata: Metadata = {
	title: "Series",
	description:
		"chan9yu 개발 블로그의 시리즈 포스트 허브. 한 주제를 여러 편에 걸쳐 깊이 다루는 연속물을 순서대로 학습할 수 있도록 연결된 글 단위로 구성했습니다.",
	alternates: { canonical: "/series" }
};

export default function SeriesHubPage() {
	return (
		<Container>
			<div className="space-y-10 py-10 lg:py-14">
				<header className="space-y-2">
					<h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">Series</h1>
					<p className="text-muted-foreground text-sm">총 {seriesFixture.length}개의 시리즈</p>
				</header>

				{seriesFixture.length === 0 ? (
					<p className="text-muted-foreground py-12 text-center text-sm">아직 시리즈가 없습니다.</p>
				) : (
					<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{seriesFixture.map((series) => {
							const latest = series.posts[series.posts.length - 1];
							return (
								<li key={series.slug}>
									<Link
										href={`/series/${series.slug}`}
										className="group bg-card border-border focus-visible:ring-ring block space-y-3 rounded-xl border p-5 transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
									>
										<div className="flex items-center justify-between gap-2">
											<h2 className="text-card-foreground group-hover:text-accent text-lg font-bold tracking-tight transition-colors">
												{series.name}
											</h2>
											<span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
												{series.posts.length}편
											</span>
										</div>
										{latest && (
											<p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
												최신 편: {latest.title}
											</p>
										)}
									</Link>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</Container>
	);
}
