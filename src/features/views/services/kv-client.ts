import { kv } from "@vercel/kv";

/**
 * Vercel KV 클라이언트
 * Redis 기반 키-값 저장소를 사용하여 조회수를 추적합니다.
 */

const VIEW_KEY_PREFIX = "views:post:";

/**
 * 포스트 조회수 키 생성
 */
function getViewKey(slug: string): string {
	return `${VIEW_KEY_PREFIX}${slug}`;
}

/**
 * 포스트 조회수 증가
 * @param slug - 포스트 slug
 * @returns 증가 후 조회수
 */
export async function incrementPostViews(slug: string): Promise<number> {
	const key = getViewKey(slug);
	const views = await kv.incr(key);
	return views;
}

/**
 * 포스트 조회수 조회
 * @param slug - 포스트 slug
 * @returns 현재 조회수
 */
export async function getPostViews(slug: string): Promise<number> {
	const key = getViewKey(slug);
	const views = await kv.get<number>(key);
	return views ?? 0;
}

/**
 * 여러 포스트의 조회수 일괄 조회
 * @param slugs - 포스트 slug 배열
 * @returns slug를 키로 하는 조회수 맵
 */
export async function getBatchPostViews(slugs: string[]): Promise<Record<string, number>> {
	if (slugs.length === 0) {
		return {};
	}

	const keys = slugs.map(getViewKey);
	const pipeline = kv.pipeline();

	keys.forEach((key) => {
		pipeline.get<number>(key);
	});

	const results = await pipeline.exec<(number | null)[]>();

	const viewsMap: Record<string, number> = {};
	slugs.forEach((slug, index) => {
		viewsMap[slug] = results[index] ?? 0;
	});

	return viewsMap;
}
