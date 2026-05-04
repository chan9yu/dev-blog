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

// 마운트 시 1회 POST +1 → GET fetch. 세션당 dedup.
// slug 가정: ViewCounter 생명주기 동안 불변 — 같은 인스턴스에서 slug가 바뀌면 호출자가 `key={slug}`로 강제 remount.
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
