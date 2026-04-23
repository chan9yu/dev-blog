import type { NextRequest } from "next/server";

import { validateSlug } from "@/shared/utils/slug";

/**
 * RT-/api/views — PRD §7.5 + ROADMAP M3-08.
 *
 * - `GET /api/views?slug=xxx` → 200 `{ views: number }`
 * - `POST /api/views { slug }` → 204 no body
 * - 잘못된 slug / malformed JSON → 400
 * - `Cache-Control: no-store` (GET·POST 공통)
 *
 * **저장소**: 현재는 in-memory `Map`. 프로덕션 배포 전 `@vercel/kv` 어댑터로 스왑 필요
 * (ADR-003, PRD §7 — `incr`/`mget` 파이프라인 사용으로 N+1 방지).
 * HMR 생존을 위해 `globalThis`에 스토어를 걸어둔다 — 개발 중 Next.js fast-refresh로
 * 모듈이 재평가되어도 조회수가 0으로 초기화되지 않도록.
 *
 * **응답 shape 고정**: 테스트(route.test.ts)가 `Object.keys(body) === ["views"]`를 단언.
 * slug 누설 금지 — MSW handlers.ts와 계약 동일.
 */

type GlobalWithViewsStore = typeof globalThis & {
	__devBlogViewsStore?: Map<string, number>;
};

const globalForViews = globalThis as GlobalWithViewsStore;
const viewsStore = globalForViews.__devBlogViewsStore ?? new Map<string, number>();
if (process.env.NODE_ENV !== "production") {
	globalForViews.__devBlogViewsStore = viewsStore;
}

const NO_STORE_HEADERS = { "cache-control": "no-store" } as const;

export async function GET(req: NextRequest) {
	const slug = validateSlug(new URL(req.url).searchParams.get("slug"));
	if (!slug) {
		return Response.json({ error: "invalid slug" }, { status: 400, headers: NO_STORE_HEADERS });
	}

	const views = viewsStore.get(slug) ?? 0;
	return Response.json({ views }, { headers: NO_STORE_HEADERS });
}

export async function POST(req: NextRequest) {
	const raw: unknown = await req.json().catch(() => null);
	if (!raw || typeof raw !== "object") {
		return Response.json({ error: "invalid JSON body" }, { status: 400, headers: NO_STORE_HEADERS });
	}

	const slug = validateSlug((raw as Record<string, unknown>).slug);
	if (!slug) {
		return Response.json({ error: "invalid slug" }, { status: 400, headers: NO_STORE_HEADERS });
	}

	viewsStore.set(slug, (viewsStore.get(slug) ?? 0) + 1);
	return new Response(null, { status: 204, headers: NO_STORE_HEADERS });
}
