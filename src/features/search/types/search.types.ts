import type { PostSummary } from "@/features/blog";

/**
 * 검색 가능한 포스트 정보 (PostSummary와 동일)
 */
export type SearchablePost = PostSummary;

/**
 * 검색 결과 아이템
 */
export interface SearchResult {
	post: SearchablePost;
	/** Fuse.js 매칭 스코어 (0에 가까울수록 정확한 매칭) */
	score?: number;
	/** 매칭된 필드 정보 */
	matches?: SearchMatch[];
}

/**
 * 검색 매칭 정보
 */
export interface SearchMatch {
	/** 매칭된 필드명 (title, description, tags 등) */
	key: string;
	/** 매칭된 텍스트 */
	value: string;
	/** 매칭 인덱스 */
	indices: readonly [number, number][];
}

/**
 * 검색 옵션
 */
export interface SearchOptions {
	/** 최대 검색 결과 수 */
	limit?: number;
	/** 검색 임계값 (0.0 ~ 1.0, 낮을수록 정확한 매칭만 허용) */
	threshold?: number;
}
