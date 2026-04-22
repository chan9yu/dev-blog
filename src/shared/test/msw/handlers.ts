/**
 * MSW 기본 핸들러 — `/api/views` 계약 **PRD §7.5**의 machine-readable reference.
 *
 * - `GET /api/views?slug=xxx` → `{ views: number }`
 * - `POST /api/views { slug }` → 204 (no body)
 * - 유효하지 않은 slug는 400
 *
 * 이 파일은 "테스트 더블"을 넘어 PRD 계약의 단일 진실 공급원 역할을 겸한다.
 * Route Handler(`src/app/api/views/route.ts`) 수정 시 **여기서 벗어나면 안 된다**.
 * slug 검증은 서버와 동일하게 `validateSlug`를 재사용해 drift를 차단.
 *
 * 테스트별 특수 시나리오는 `server.use(...)`로 오버라이드.
 */

import { http, HttpResponse } from "msw";

import { validateSlug } from "@/shared/utils/slug";

const viewsStore = new Map<string, number>();

export const viewsHandlers = [
	http.get("/api/views", ({ request }) => {
		const slug = validateSlug(new URL(request.url).searchParams.get("slug"));
		return slug
			? HttpResponse.json({ views: viewsStore.get(slug) ?? 0 })
			: HttpResponse.json({ error: "invalid slug" }, { status: 400 });
	}),

	http.post("/api/views", async ({ request }) => {
		let raw: unknown;

		try {
			raw = await request.json();
		} catch {
			return HttpResponse.json({ error: "invalid JSON body" }, { status: 400 });
		}

		if (typeof raw !== "object" || raw === null) {
			return HttpResponse.json({ error: "invalid JSON body" }, { status: 400 });
		}

		const slug = validateSlug((raw as Record<string, unknown>).slug);
		if (!slug) {
			return HttpResponse.json({ error: "invalid slug" }, { status: 400 });
		}

		viewsStore.set(slug, (viewsStore.get(slug) ?? 0) + 1);

		return new HttpResponse(null, { status: 204 });
	})
];

export const handlers = [...viewsHandlers];

/** 테스트에서 특정 slug의 초기 조회수를 지정. */
export function seedMockView(slug: string, count: number) {
	viewsStore.set(slug, count);
}

/** 테스트 간 store 격리용 — `setup.ts`의 afterEach에서 단일 호출. */
export function resetMockViews() {
	viewsStore.clear();
}
