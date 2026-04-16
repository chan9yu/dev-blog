import { BookOpen, Calendar } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { getPublicPosts } from "@/features/posts";
import { getAllSeries } from "@/features/series";
import { Container } from "@/shared/components/layouts/Container";
import { formatDate } from "@/shared/utils/formatDate";

type SeriesDetailPageProps = {
	params: Promise<{ slug: string }>;
};

/**
 * 렌더 패스 내에서 getAllSeries(getPublicPosts())를 한 번만 계산한다.
 * generateMetadata와 SeriesDetailPage가 같은 렌더 트리 내에서 이 cache를 공유.
 * (generateStaticParams는 렌더 트리 외부 — 별도 호출)
 */
const getSeriesList = cache(() => getAllSeries(getPublicPosts()));

function findSeriesBySlug(rawSlug: string) {
	return getSeriesList().find((s) => s.slug === rawSlug) ?? null;
}

export function generateStaticParams() {
	return getAllSeries(getPublicPosts()).map((series) => ({ slug: series.slug }));
}

export async function generateMetadata({ params }: SeriesDetailPageProps): Promise<Metadata> {
	const { slug } = await params;
	const series = findSeriesBySlug(decodeURIComponent(slug));
	if (!series) return { title: "Series" };

	return {
		title: series.name,
		description: `${series.name} 시리즈 — 총 ${series.posts.length}개의 연재 글로 구성되어 있습니다.`,
		alternates: { canonical: `/series/${encodeURIComponent(series.slug)}` }
	};
}

/**
 * 레거시 /series/[slug] 디자인 참조:
 * - header mb-12: h1 text-4xl sm:text-5xl + 메타(BookOpen + 편수) + hr
 * - 본문: 번호 원 뱃지 + 제목·설명·날짜 카드 (seriesOrder 오름차순, getAllSeries 내부 정렬 완료)
 *
 * series slug는 한글·특수문자를 포함할 수 있어 normalizeSlug 대신 직접 문자열 lookup 사용.
 * generateStaticParams로 생성된 경로 외에는 Next.js SSG가 자연스럽게 404 처리.
 */
export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
	const { slug } = await params;
	const series = findSeriesBySlug(decodeURIComponent(slug));
	if (!series) notFound();

	return (
		<Container>
			<div className="py-8 lg:py-10">
				<header className="mb-12 space-y-6">
					<div className="space-y-4">
						<h1 className="text-foreground text-3xl leading-tight font-bold tracking-tight text-balance break-keep sm:text-4xl md:text-5xl">
							{series.name}
						</h1>
						<div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
							<span className="inline-flex items-center gap-2">
								<BookOpen className="size-4" aria-hidden />총 {series.posts.length}개의 글
							</span>
						</div>
					</div>
					<hr className="border-border" />
				</header>

				<ol className="space-y-4" aria-label="시리즈 포스트">
					{series.posts.map((post) => (
						<li key={post.slug} className="flex gap-4">
							<span
								className="bg-muted text-muted-foreground mt-3 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums"
								aria-hidden
							>
								{post.seriesOrder ?? "—"}
							</span>
							<Link
								href={`/posts/${post.slug}`}
								className="group bg-card border-border-subtle focus-visible:ring-ring block flex-1 rounded-xl border p-5 transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
							>
								<h2 className="text-card-foreground group-hover:text-accent line-clamp-2 text-base leading-snug font-semibold transition-colors sm:text-lg">
									{post.title}
								</h2>
								<p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-relaxed">{post.description}</p>
								<time
									className="text-muted-foreground mt-2 inline-flex items-center gap-1.5 text-xs tabular-nums"
									dateTime={post.date}
								>
									<Calendar className="size-3.5" aria-hidden />
									{formatDate(post.date)}
								</time>
							</Link>
						</li>
					))}
				</ol>
			</div>
		</Container>
	);
}
