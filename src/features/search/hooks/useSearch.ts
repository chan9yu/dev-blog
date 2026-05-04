"use client";

import Fuse, { type IFuseOptions } from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";

import type { PostSummary } from "@/shared/types";

import type { SearchResult } from "../types";

const DEFAULT_THRESHOLD = 0.4;
const DEFAULT_LIMIT = 10;
const DEFAULT_DEBOUNCE_MS = 200;

// PRD §7.4: title:description:tags 가중치 0.5/0.3/0.2. ignoreLocation으로 description 어디서 매칭돼도 동일 점수.
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

	// React Compiler는 외부 라이브러리 객체 생성을 자동 메모하지 않아 수동 useMemo 유지.
	const fuse = useMemo(() => new Fuse(posts, { ...fuseBaseOptions, threshold }), [posts, threshold]);

	const setQuery = (next: string) => {
		setQueryState(next);
		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		// 빈 문자열은 debounce 없이 즉시 반영 — X 버튼/전체 삭제 UX 응답성.
		if (next === "") {
			setDebouncedQuery("");
			return;
		}

		timerRef.current = setTimeout(() => {
			setDebouncedQuery(next);
			timerRef.current = null;
		}, debounceMs);
	};

	useEffect(() => {
		return () => {
			if (timerRef.current !== null) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};
	}, []);

	// React Compiler가 외부 메서드 호출 캡처를 자동 메모하지 못해 수동 useMemo 유지.
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
