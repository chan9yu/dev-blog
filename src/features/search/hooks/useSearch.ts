"use client";

import Fuse from "fuse.js";
import { useMemo, useState } from "react";

import type { SearchablePost, SearchOptions, SearchResult } from "@/features/search/types";

/**
 * Fuse.js 기반 블로그 포스트 검색 훅
 */
export function useSearch(posts: SearchablePost[], options: SearchOptions = {}) {
	const { limit = 10, threshold = 0.4 } = options;
	const [query, setQuery] = useState("");

	// Fuse.js 인스턴스 생성 (posts가 변경될 때만 재생성)
	const fuse = useMemo(() => {
		return new Fuse(posts, {
			keys: [
				{ name: "title", weight: 0.5 }, // 제목에 가장 높은 가중치
				{ name: "description", weight: 0.3 },
				{ name: "tags", weight: 0.2 }
			],
			threshold, // 매칭 임계값 (0.0 = 완전 일치, 1.0 = 모든 것 매칭)
			includeScore: true,
			includeMatches: true,
			minMatchCharLength: 2, // 최소 매칭 문자 길이
			ignoreLocation: true // 위치 무시 (전체 텍스트 검색)
		});
	}, [posts, threshold]);

	// 검색 결과 계산
	const results = useMemo<SearchResult[]>(() => {
		if (!query.trim()) {
			return [];
		}

		const fuseResults = fuse.search(query, { limit });

		return fuseResults.map((result) => ({
			post: result.item,
			score: result.score,
			matches: result.matches?.map((match) => ({
				key: match.key || "",
				value: match.value || "",
				indices: match.indices || []
			}))
		}));
	}, [query, fuse, limit]);

	return {
		query,
		setQuery,
		results,
		hasResults: results.length > 0,
		isEmpty: query.trim() !== "" && results.length === 0
	};
}
