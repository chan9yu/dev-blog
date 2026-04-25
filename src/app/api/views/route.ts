import { kv } from "@vercel/kv";
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
 * **저장소**: `@vercel/kv` (ADR-003). 환경 변수(`KV_REST_API_URL`·`KV_REST_API_TOKEN`)는
 * Vercel 대시보드 또는 `.env`로 주입. 쓰기 토큰은 본 라우트 내부에서만 사용되며
 * 클라이언트 번들 노출 금지(PRD §보안).
 *
 * **응답 shape 고정**: 테스트(route.test.ts)가 `Object.keys(body) === ["views"]`를 단언.
 * slug 누설 금지 — MSW handlers.ts와 계약 동일.
 *
 * **에러 정책**: KV 장애 시 GET은 0 fallback, POST는 silent fail. 조회수는 부가 기능이므로
 * KV 실패가 포스트 페이지 자체를 500으로 내리지 않도록 보호한다.
 *
 * **runtime**: 명시하지 않음. `next.config.ts`의 `cacheComponents: true`(PPR)가 활성화되어
 * 있어 Route segment `runtime` export가 빌드 에러로 차단된다. 기본 Node.js 런타임으로 충분.
 */

const NO_STORE_HEADERS = { "cache-control": "no-store" } as const;

/**
 * KV 키 네임스페이스. 운영 KV(main 브랜치 시절부터 누적)에 이미 저장된 키 패턴과 호환을 위해
 * `views:post:` prefix를 사용한다. 변경 시 기존 카운트가 모두 0으로 초기화됨에 주의.
 */
const VIEW_KEY_PREFIX = "views:post:";

function viewsKey(slug: string) {
	return `${VIEW_KEY_PREFIX}${slug}`;
}

export async function GET(req: NextRequest) {
	const slug = validateSlug(new URL(req.url).searchParams.get("slug"));
	if (!slug) {
		return Response.json({ error: "invalid slug" }, { status: 400, headers: NO_STORE_HEADERS });
	}

	const stored = await kv.get<number>(viewsKey(slug)).catch(() => null);
	const views = stored ?? 0;
	return Response.json({ views }, { headers: NO_STORE_HEADERS });
}

export async function POST(req: NextRequest) {
	const raw: unknown = await req.json().catch(() => null);
	if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
		return Response.json({ error: "invalid JSON body" }, { status: 400, headers: NO_STORE_HEADERS });
	}

	const slug = "slug" in raw ? validateSlug(raw.slug) : null;
	if (!slug) {
		return Response.json({ error: "invalid slug" }, { status: 400, headers: NO_STORE_HEADERS });
	}

	// fire-and-forget: incr 반환값(증가 후 카운트)은 사용하지 않음. KV가 원자적으로 카운트 관리.
	await kv.incr(viewsKey(slug)).catch(() => undefined);
	return new Response(null, { status: 204, headers: NO_STORE_HEADERS });
}
