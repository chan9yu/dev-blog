import type { PostSummary, TagCount } from "@/shared/types";

import { getTagCounts } from "./getTagCounts";

const DEFAULT_LIMIT = 10;

/**
 * 빌드 타임 태그 트렌딩 스냅샷 (M4-04, ADR-007).
 *
 * - public 포스트 수 내림차순 상위 N개 (기본 10).
 * - 동률 시 tag 알파벳 오름차순.
 * - private 기여분 제외는 호출자(`getPublicPosts`) 책임.
 * - 호출자가 limit > 입력 unique 태그 수면 unique 태그만큼만 반환된다.
 *
 * @param posts - `getPublicPosts()` 결과 (private 제외)
 * @param limit - 반환 개수 (default 10)
 */
export function getTrendingTags(posts: PostSummary[], limit = DEFAULT_LIMIT): TagCount[] {
	return getTagCounts(posts).slice(0, limit);
}
