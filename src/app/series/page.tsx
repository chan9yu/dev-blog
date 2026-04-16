import { Archive, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { getPublicPosts } from "@/features/posts";
import { getAllSeries } from "@/features/series";
import { Container } from "@/shared/components/layouts/Container";

export const metadata: Metadata = {
	title: "시리즈",
	description: "연재 중인 시리즈별로 포스트를 모아보세요. 체계적으로 구성된 학습 콘텐츠를 확인할 수 있습니다.",
	alternates: { canonical: "/series" }
};

/**
 * 레거시 /series 디자인 참조:
 * - 헤더: 시리즈 h1 + subtitle
 * - 그리드 sm:grid-cols-2 lg:grid-cols-3
 * - 카드: rounded-xl border p-6
 *   - BookOpen 아이콘(size-6) bg-muted size-12 rounded-lg
 *   - 시리즈명 text-lg font-bold
 *   - "총 N개의 포스트"
 *   - 상위 3개 포스트 미리보기 (번호 badge + 제목 line-clamp-1)
 *   - +N개 더보기 (3 초과 시)
 */
export default function SeriesHubPage() {
	const series = getAllSeries(getPublicPosts());

	return (
		<Container>
			<div className="space-y-8 py-8 lg:py-10">
				<header className="space-y-3">
					<h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">시리즈</h1>
					<p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
						연재 중인 시리즈별로 포스트를 모아보세요
					</p>
				</header>

				{series.length === 0 ? (
					<div className="text-muted-foreground flex flex-col items-center justify-center py-16 text-center">
						<Archive className="mb-4 size-16" aria-hidden />
						<p className="text-lg font-medium">아직 시리즈가 없습니다</p>
					</div>
				) : (
					<ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="시리즈 목록">
						{series.map((item) => (
							<li key={item.slug}>
								<Link
									href={`/series/${item.slug}`}
									className="group bg-card border-border-subtle focus-visible:ring-ring block rounded-xl border p-6 transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
								>
									<div className="space-y-4">
										<div className="bg-muted flex size-12 items-center justify-center rounded-lg">
											<BookOpen className="text-accent size-6" aria-hidden />
										</div>

										<div className="space-y-2">
											<h2 className="text-card-foreground group-hover:text-accent text-lg leading-snug font-bold tracking-tight transition-colors">
												{item.name}
											</h2>
											<p className="text-muted-foreground text-sm">총 {item.posts.length}개의 포스트</p>
										</div>

										<ol className="space-y-1.5 pt-2">
											{item.posts.slice(0, 3).map((post, index) => (
												<li key={post.slug} className="flex items-start gap-2 text-sm">
													<span
														className="bg-muted text-muted-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded text-xs font-medium tabular-nums"
														aria-hidden
													>
														{index + 1}
													</span>
													<span className="text-muted-foreground line-clamp-1 leading-relaxed">{post.title}</span>
												</li>
											))}
											{item.posts.length > 3 && (
												<li className="text-muted-foreground pl-7 text-xs">+{item.posts.length - 3}개 더보기</li>
											)}
										</ol>
									</div>
								</Link>
							</li>
						))}
					</ul>
				)}
			</div>
		</Container>
	);
}
