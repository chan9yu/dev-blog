/**
 * MOD-views KV 클라이언트 — PRD §7.5 계약.
 *
 * - `GET /api/views?slug=xxx` → `{ views: number }`
 * - `POST /api/views { slug }` → 204
 *
 * KV 실패 시 조용히 0 fallback + console.warn. UI는 절대 throw로 중단하지 않는다.
 */

const VIEWS_ENDPOINT = "/api/views";

type ViewsResponse = {
	views: number;
};

function isViewsResponse(value: unknown): value is ViewsResponse {
	return typeof value === "object" && value !== null && typeof (value as { views?: unknown }).views === "number";
}

export async function getPostViews(slug: string) {
	try {
		const res = await fetch(`${VIEWS_ENDPOINT}?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
		if (!res.ok) {
			console.warn(`[views] GET ${slug} failed: ${res.status}`);
			return 0;
		}

		const data: unknown = await res.json();
		if (!isViewsResponse(data)) {
			console.warn(`[views] GET ${slug} returned malformed payload`);
			return 0;
		}

		return data.views;
	} catch (error) {
		console.warn(`[views] GET ${slug} network error`, error);
		return 0;
	}
}

export async function incrementPostViews(slug: string) {
	try {
		const res = await fetch(VIEWS_ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ slug })
		});

		if (!res.ok) {
			console.warn(`[views] POST ${slug} failed: ${res.status}`);
		}
	} catch (error) {
		console.warn(`[views] POST ${slug} network error`, error);
	}
}

/**
 * 여러 slug의 조회수를 병렬(Promise.all) 조회.
 *
 * - 중복 slug는 자동 dedup (동일 slug를 두 번 fetch하지 않음)
 * - 반환 객체의 키 순회 순서는 보장하지 않음 — 호출자는 slug로 직접 lookup할 것
 * - 개별 실패는 조용히 0으로 대체 (getPostViews 자체가 throw 대신 0을 반환)
 */
export async function getBatchPostViews(slugs: ReadonlyArray<string>) {
	if (slugs.length === 0) {
		return {} as Record<string, number>;
	}

	const unique = Array.from(new Set(slugs));
	const entries = await Promise.all(unique.map(async (slug) => [slug, await getPostViews(slug)] as const));

	return Object.fromEntries(entries);
}
