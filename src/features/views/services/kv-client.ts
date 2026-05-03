// 조회수는 부가 기능 — KV 실패가 UI를 throw로 중단하지 않도록 모든 함수가 silent fail + console.warn.

const VIEWS_ENDPOINT = "/api/views";

type ViewsResponse = {
	views: number;
};

function isViewsResponse(value: unknown): value is ViewsResponse {
	return typeof value === "object" && value !== null && typeof (value as { views?: unknown }).views === "number";
}

export async function fetchPostViewsOrNull(slug: string): Promise<number | null> {
	try {
		const res = await fetch(`${VIEWS_ENDPOINT}?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
		if (!res.ok) {
			console.warn(`[views] GET ${slug} failed: ${res.status}`);
			return null;
		}

		const data: unknown = await res.json();
		if (!isViewsResponse(data)) {
			console.warn(`[views] GET ${slug} returned malformed payload`);
			return null;
		}

		return data.views;
	} catch (error) {
		console.warn(`[views] GET ${slug} network error`, error);
		return null;
	}
}

export async function getPostViews(slug: string) {
	const value = await fetchPostViewsOrNull(slug);
	return value ?? 0;
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

// 중복 slug 자동 dedup. 반환 키 순회 순서는 보장 안 함 — 호출자는 slug로 직접 lookup할 것.
export async function getBatchPostViews(slugs: ReadonlyArray<string>): Promise<Record<string, number>> {
	if (slugs.length === 0) return {};

	const unique = Array.from(new Set(slugs));
	const entries = await Promise.all(unique.map(async (slug) => [slug, await getPostViews(slug)] as const));

	return Object.fromEntries(entries);
}
