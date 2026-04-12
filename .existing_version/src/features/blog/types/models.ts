/**
 * 포스트 요약 정보 (목록 표시용)
 */
export interface PostSummary {
	title: string;
	description: string;
	slug: string;
	date: string;
	private: boolean;
	tags: string[];
	thumbnail: string | null;
	series: string | null;
	seriesOrder: number | null;
}

/**
 * 포스트 상세 정보 (상세 페이지용)
 */
export interface PostDetail extends PostSummary {
	content: string;
}
