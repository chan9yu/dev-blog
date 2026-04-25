"use client";

import Fuse, { type IFuseOptions } from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";

import type { PostSummary } from "@/shared/types";

import type { SearchResult } from "../types";

/** PRD_TECHNICAL §7.4 기본값 — 필요 시 호출 측에서 override. */
const DEFAULT_THRESHOLD = 0.4;
const DEFAULT_LIMIT = 10;
const DEFAULT_DEBOUNCE_MS = 200;

/**
 * Fuse 공통 옵션.
 * - keys 가중치: title 0.5 / description 0.3 / tags 0.2 (PRD §7.4)
 * - ignoreLocation: 긴 description 내부 어디서 매칭되든 점수 동일
 * - includeScore/includeMatches: 정렬·하이라이트에 사용
 */
const fuseBaseOptions: IFuseOptions<PostSummary> = {
	keys: [
		{ name: "title", weight: 0.5 },
		{ name: "description", weight: 0.3 },
		{ name: "tags", weight: 0.2 }
	],
	includeScore: true,
	includeMatches: true,
	ignoreLocation: true,
	minMatchCharLength: 2
};

type UseSearchOptions = {
	posts: PostSummary[];
	threshold?: number;
	limit?: number;
	debounceMs?: number;
};

type UseSearchReturn = {
	query: string;
	debouncedQuery: string;
	setQuery: (next: string) => void;
	results: SearchResult[];
};

export function useSearch({
	posts,
	threshold = DEFAULT_THRESHOLD,
	limit = DEFAULT_LIMIT,
	debounceMs = DEFAULT_DEBOUNCE_MS
}: UseSearchOptions): UseSearchReturn {
	const [query, setQueryState] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");

	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Fuse 인스턴스는 posts 전체 인덱싱 — 매 렌더 재생성 비용이 크므로 수동 메모 유지.
	// React Compiler가 외부 라이브러리 객체 생성까지 자동 메모하지 않는다.
	const fuse = useMemo(() => new Fuse(posts, { ...fuseBaseOptions, threshold }), [posts, threshold]);

	// 이벤트 핸들러 내부 setState는 React 정상 패턴.
	// Effect body setState(react-hooks/set-state-in-effect) 룰 회피.
	// setTimeout 콜백은 호출 시점의 `debounceMs`를 클로저로 캡처 —
	// prop이 바뀌면 다음 keystroke에서 새 타이머가 새 값으로 예약되므로 stale 문제 없음.
	const setQuery = (next: string) => {
		setQueryState(next);
		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		// 빈 문자열은 debounce 없이 즉시 반영 — X 버튼/전체 삭제 UX
		if (next === "") {
			setDebouncedQuery("");
			return;
		}

		timerRef.current = setTimeout(() => {
			setDebouncedQuery(next);
			timerRef.current = null;
		}, debounceMs);
	};

	// 언마운트 시 타이머 정리 (Effect 내 setState 없음 → 룰 준수)
	useEffect(() => {
		return () => {
			if (timerRef.current !== null) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};
	}, []);

	// Fuse.search 호출·결과 매핑은 참조 안정성이 중요 — Compiler가 외부 메서드 호출 캡처를 자동 메모하지 못할 수 있어 수동 유지
	const results = useMemo<SearchResult[]>(() => {
		const trimmed = debouncedQuery.trim();
		if (trimmed === "") return [];

		return fuse.search(trimmed, { limit }).map(({ item, score, matches }) => ({
			post: item,
			score: score ?? 1,
			matches
		}));
	}, [debouncedQuery, fuse, limit]);

	return {
		query,
		debouncedQuery,
		setQuery,
		results
	};
}
