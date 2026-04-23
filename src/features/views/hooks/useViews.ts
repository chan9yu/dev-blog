"use client";

import { useEffect, useState } from "react";

import { fetchPostViewsOrNull, incrementPostViews } from "../services/kv-client";

const SESSION_KEY_PREFIX = "views:incremented:";

function sessionKey(slug: string) {
	return `${SESSION_KEY_PREFIX}${slug}`;
}

function wasIncrementedThisSession(slug: string) {
	try {
		return typeof sessionStorage !== "undefined" && sessionStorage.getItem(sessionKey(slug)) === "1";
	} catch {
		return false;
	}
}

function markIncrementedThisSession(slug: string) {
	try {
		sessionStorage.setItem(sessionKey(slug), "1");
	} catch {
		// sessionStorage 차단(시크릿 모드 등) — dedup best-effort로 포기.
	}
}

type UseViewsState = {
	views: number | null;
	failed: boolean;
};

const INITIAL_STATE: UseViewsState = { views: null, failed: false };

/**
 * 포스트 조회수를 KV에서 가져오고, 마운트 시 1회 +1 POST. 세션당 dedup.
 *
 * - `views: null, failed: false` — 초기 로딩 (placeholder)
 * - `views: number, failed: false` — 성공
 * - `views: null, failed: true` — GET 실패 (UI는 `— 회`)
 *
 * POST는 best-effort이며 실패해도 GET은 시도한다. UI 블록 금지.
 *
 * **슬러그 가정**: Next.js App Router에서 `/posts/[slug]` 페이지 세그먼트는 slug 변경 시
 * 언마운트/재마운트되므로 ViewCounter 인스턴스 생명주기 동안 slug는 불변이라 가정한다.
 * 이 가정이 깨지면 호출자는 `<ViewCounter key={slug} slug={slug} />`로 강제 remount하면 된다.
 */
export function useViews(slug: string) {
	const [state, setState] = useState<UseViewsState>(INITIAL_STATE);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			if (!wasIncrementedThisSession(slug)) {
				markIncrementedThisSession(slug);
				await incrementPostViews(slug);
			}

			const value = await fetchPostViewsOrNull(slug);
			if (cancelled) return;

			setState(value === null ? { views: null, failed: true } : { views: value, failed: false });
		};

		void load();

		return () => {
			cancelled = true;
		};
	}, [slug]);

	return state;
}
