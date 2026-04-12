/**
 * Lightbox 이미지 정보
 */
export interface LightboxImage {
	/** 이미지 URL */
	src: string;
	/** 이미지 alt 텍스트 */
	alt?: string;
	/** 이미지 너비 */
	width?: number;
	/** 이미지 높이 */
	height?: number;
}
