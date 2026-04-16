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
	/** MDX 작성 기준 레벨. h1(#)·h2(##)·h3(###) 대상. h4 이하는 목차 제외.
	 *  렌더링 시 CustomMDX가 +1 시프트하므로 DOM에서는 h2·h3·h4로 출력됨. */
	level: 1 | 2 | 3;
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
