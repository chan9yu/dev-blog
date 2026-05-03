import { kv } from "@vercel/kv";
import type { NextRequest } from "next/server";

import { validateSlug } from "@/shared/utils/slug";

// 응답 shape `{ views }` 고정 — slug 누설 금지(테스트가 Object.keys === ["views"] 단언) + MSW handlers와 계약 동일.
// runtime 명시 금지: cacheComponents=true(PPR)가 Route segment runtime export를 빌드 에러로 차단.
// KV 장애 시 GET=0 fallback, POST=silent fail — 조회수 실패가 페이지 500을 일으키지 않도록 보호.

const NO_STORE_HEADERS = { "cache-control": "no-store" } as const;

// 운영 KV에 이미 저장된 키 패턴 호환 — 변경 시 기존 카운트가 모두 0으로 초기화됨.
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

	// fire-and-forget — incr 반환값 미사용(KV가 원자적 카운트 관리).
	await kv.incr(viewsKey(slug)).catch(() => undefined);
	return new Response(null, { status: 204, headers: NO_STORE_HEADERS });
}
