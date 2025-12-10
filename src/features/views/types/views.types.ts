/**
 * 조회수 정보
 */
export interface ViewCount {
	/** 포스트 slug */
	slug: string;
	/** 조회수 */
	views: number;
}

/**
 * 조회수 증가 응답
 */
export interface IncrementViewResponse {
	/** 증가 후 조회수 */
	views: number;
	/** 성공 여부 */
	success: boolean;
}
