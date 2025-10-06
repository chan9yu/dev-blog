import type { SeriesBucket } from "@/features/series";

/**
 * URL slug와 파일명 일치 검증
 * @throws {Error} slug 불일치 시 에러 발생
 */
export function validateSlugConsistency(filename: string, urlSlug: string): void {
	const fileSlug = filename.replace(".mdx", "");

	if (fileSlug !== urlSlug) {
		throw new Error(`[${filename}] 파일명과 url_slug 불일치: ${fileSlug} !== ${urlSlug}`);
	}
}

/**
 * 시리즈 index 중복 검증
 * @throws {Error} index 중복 시 에러 발생
 */
export function validateSeriesIndex(series: SeriesBucket): void {
	const indices = series.posts
		.map((p) => p.index)
		.filter((i): i is number => i !== undefined)
		.sort((a, b) => a - b);

	// 중복 검사
	const duplicates = indices.filter((v: number, i: number, arr: number[]) => arr.indexOf(v) !== i);

	if (duplicates.length > 0) {
		throw new Error(`[시리즈: ${series.name}] index 중복: ${duplicates.join(", ")}`);
	}

	// 연속성 경고 (빌드는 통과)
	if (indices.length > 0) {
		const hasGaps = indices.some((v: number, i: number) => v !== i + 1);
		if (hasGaps) {
			console.warn(`⚠️  [시리즈: ${series.name}] index가 연속적이지 않습니다`);
		}
	}
}

/**
 * 예약 발행 여부 확인
 */
export function isScheduled(releasedAt: string): boolean {
	return new Date(releasedAt) > new Date();
}

/**
 * 공개 여부 확인
 */
export function isPublic(isPrivate: boolean, releasedAt: string): boolean {
	return !isPrivate && !isScheduled(releasedAt);
}
