export type PostFrontmatter = {
	title: string;
	description: string;
	slug: string;
	date: string;
	private: boolean;
	tags: string[];
	thumbnail: string | null;
	series: string | null;
	seriesOrder: number | null;
};

export type PostSummary = PostFrontmatter & {
	readingTimeMinutes: number;
};

export type TocItem = {
	id: string;
	/** MDX 규약: 본문은 ## 부터 시작하므로 level 1은 사용 안 함. h4까지 지원. */
	level: 2 | 3 | 4;
	text: string;
};

export type PostDetail = PostSummary & {
	contentMdx: string;
	toc: TocItem[];
};

/** 포스트 상세 페이지의 이전/다음 포스트. 경계에선 null. */
export type AdjacentPosts = {
	prev: PostSummary | null;
	next: PostSummary | null;
};

/** 관련 포스트 — 태그 겹침 스코어(`overlapScore`)가 높을수록 유사도 큼. */
export type RelatedPost = PostSummary & {
	overlapScore: number;
};
