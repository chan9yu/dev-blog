import type { PostSummary } from "@/shared/types";

const VIEW_KEY_PREFIX = "views:post:";
const DEFAULT_LIMIT = 5;

// KV 미설정 PR preview·로컬 빌드를 깨지 않도록 fallback. `fallback: true` 플래그로 호출자가 UI 분기 가능.
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
			return b.date.localeCompare(a.date);
		});
		return { posts: sorted.slice(0, limit), fallback: false };
	} catch (error) {
		console.warn("[getTrendingPosts] KV fetch failed, falling back to date-desc:", error);
		return { posts: pickRecentPosts(posts, limit), fallback: true };
	}
}

// 호출자 정렬 계약에 의존하지 않도록 자체 date desc 재정렬 — fallback 동작이 조용히 깨지지 않도록 방어.
function pickRecentPosts(posts: PostSummary[], limit: number): PostSummary[] {
	return [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

function hasKvCredentials() {
	return Boolean(process.env.KV_REST_API_URL) && Boolean(process.env.KV_REST_API_TOKEN);
}

// 동적 import는 KV 미설정 빌드에서 @vercel/kv 초기화를 회피하기 위한 2차 방어선 (1차는 hasKvCredentials).
async function fetchViewsMap(slugs: string[]): Promise<Record<string, number>> {
	const { kv } = await import("@vercel/kv");
	const keys = slugs.map((slug) => `${VIEW_KEY_PREFIX}${slug}`);
	const values = await kv.mget<Array<number | null>>(...keys);
	return Object.fromEntries(slugs.map((slug, index) => [slug, values[index] ?? 0]));
}
