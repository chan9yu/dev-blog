import type { PostSummary } from "@/shared/types";

const VIEW_KEY_PREFIX = "views:post:";
const DEFAULT_LIMIT = 5;

/**
 * Popular Posts 빌드 타임 스냅샷 (M4-12, ADR-007).
 *
 * 동작:
 * 1. 모든 입력 포스트의 누적 조회수를 KV에서 batch로 페치 (`@vercel/kv`).
 * 2. 조회수 내림차순 + 동률 시 발행일 내림차순 정렬 후 상위 N개 반환.
 * 3. KV 실패 또는 환경 변수 미설정 시 → 입력 순서(date desc 가정) 상위 N개 fallback.
 *    - `fallback: true` 플래그 반환으로 호출자가 TrendingSnapshot에 표기 가능.
 *
 * **빌드를 절대 깨뜨리지 않는다** — KV가 미설정된 PR preview·로컬 빌드에서도 정적 페이지 생성을 보장.
 *
 * private 제외는 호출자(`getPublicPosts`) 책임.
 *
 * @param posts - `getPublicPosts()` 결과 (private 제외, date desc)
 * @param limit - 반환 개수 (default 5)
 * @returns `{ posts, fallback }` — fallback이 true면 KV 미사용 / 최근 발행순 fallback
 */
export async function getTrendingPosts(
	posts: PostSummary[],
	limit = DEFAULT_LIMIT
): Promise<{ posts: PostSummary[]; fallback: boolean }> {
	if (posts.length === 0) {
		return { posts: [], fallback: false };
	}

	if (!hasKvCredentials()) {
		return { posts: pickRecentPosts(posts, limit), fallback: true };
	}

	try {
		const viewsMap = await fetchViewsMap(posts.map((post) => post.slug));
		const sorted = [...posts].sort((a, b) => {
			const viewDiff = (viewsMap[b.slug] ?? 0) - (viewsMap[a.slug] ?? 0);
			if (viewDiff !== 0) return viewDiff;
			return b.date.localeCompare(a.date); // ISO 8601 가정
		});
		return { posts: sorted.slice(0, limit), fallback: false };
	} catch (error) {
		console.warn("[getTrendingPosts] KV fetch failed, falling back to date-desc:", error);
		return { posts: pickRecentPosts(posts, limit), fallback: true };
	}
}

/**
 * fallback 경로 — 입력 순서에 의존하지 않고 자체적으로 date desc로 재정렬한다.
 * `getPublicPosts()` 정렬 계약이 미래에 바뀌어도 fallback 동작이 조용히 깨지지 않도록 방어.
 */
function pickRecentPosts(posts: PostSummary[], limit: number): PostSummary[] {
	return [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

function hasKvCredentials() {
	return Boolean(process.env.KV_REST_API_URL) && Boolean(process.env.KV_REST_API_TOKEN);
}

/**
 * 모든 slug의 조회수를 단일 KV mget 호출로 가져온다.
 *
 * 빌드 안전 보장의 핵심은 호출 직전 `hasKvCredentials()` 분기다 — env 미설정 시 이 함수는 호출되지 않는다.
 * 동적 import는 라이브러리 초기화 타이밍 의존을 줄이는 2차 방어선.
 */
async function fetchViewsMap(slugs: string[]): Promise<Record<string, number>> {
	const { kv } = await import("@vercel/kv");
	const keys = slugs.map((slug) => `${VIEW_KEY_PREFIX}${slug}`);
	// mget의 제네릭 TData는 반환 배열 전체 타입. KV에 number만 저장(route.ts kv.incr/kv.get<number>) 보장됨.
	const values = await kv.mget<Array<number | null>>(...keys);
	return Object.fromEntries(slugs.map((slug, index) => [slug, values[index] ?? 0]));
}
