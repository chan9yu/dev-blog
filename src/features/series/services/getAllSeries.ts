import type { PostSummary, Series } from "@/shared/types";

/**
 * series·seriesOrder 불변식이 보장된 포스트를 나타내는 좁혀진 타입.
 * Zod refine 계약: series !== null ⇔ seriesOrder !== null.
 */
type SeriesPost = PostSummary & { series: string; seriesOrder: number };

function isSeriesPost(post: PostSummary): post is SeriesPost {
	return post.series !== null && post.seriesOrder !== null;
}

/**
 * PostSummary[]를 시리즈별로 그룹화해 Series[]를 반환한다 (M2-23).
 *
 * - series 필드가 null인 포스트는 건너뛴다.
 * - name: post.series 원문을 그대로 사용 (한글 포함 인간 가독 이름).
 *   slug: post.series와 동일 (라우팅 key). URL 인코딩은 Next.js가 담당.
 *   M4에서 시리즈 메타데이터 파일(slug + name 분리) 도입 시 교체 예정.
 * - posts: seriesOrder 오름차순 정렬.
 *   Zod refine 보장으로 seriesOrder는 SeriesPost 범위에서 항상 number.
 *
 * @param posts - getPublicPosts() 결과 (private 제외)
 */
export function getAllSeries(posts: PostSummary[]): Series[] {
	const seriesMap = new Map<string, SeriesPost[]>();

	for (const post of posts) {
		if (!isSeriesPost(post)) continue;
		const existing = seriesMap.get(post.series) ?? [];
		existing.push(post);
		seriesMap.set(post.series, existing);
	}

	return Array.from(seriesMap.entries()).map(([seriesId, seriesPosts]) => ({
		name: seriesId,
		slug: seriesId,
		posts: [...seriesPosts].sort((a, b) => a.seriesOrder - b.seriesOrder)
	}));
}
