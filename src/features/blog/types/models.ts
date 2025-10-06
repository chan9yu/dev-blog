/**
 * 포스트 요약 정보 (목록 표시용)
 */
export interface PostSummary {
	title: string;
	short_description: string;
	url_slug: string;
	released_at: string;
	updated_at: string;
	is_private: boolean;
	tags: string[];
	thumbnail?: string;
	series?: string;
	index?: number;
}

/**
 * 포스트 상세 정보 (상세 페이지용)
 */
export interface PostDetail extends PostSummary {
	content: string;
	// 시리즈 네비게이션용
	prev?: PostSummary;
	next?: PostSummary;
}

/**
 * 시리즈 그룹 정보
 */
export interface SeriesBucket {
	name: string;
	url_slug: string;
	updated_at: string;
	posts: PostSummary[];
}

/**
 * 태그 집계 정보
 */
export interface TagCount {
	tag: string;
	count: number;
}
