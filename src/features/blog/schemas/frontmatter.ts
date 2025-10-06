import { z } from "zod";

/**
 * Frontmatter 스키마 정의
 * - GitHub 레포의 MDX 파일 메타데이터 검증
 * - 빌드 타임에 타입 안정성 보장
 */
export const FrontmatterSchema = z.object({
	// 필수 필드
	title: z.string().min(1, "제목은 필수입니다"),
	short_description: z.string().min(1, "요약은 필수입니다"),
	url_slug: z.string().min(1, "URL slug는 필수입니다"),
	released_at: z.string().datetime("ISO 8601 형식의 날짜가 필요합니다"),
	updated_at: z.string().datetime("ISO 8601 형식의 날짜가 필요합니다"),
	is_private: z.boolean().default(false),
	tags: z.array(z.string()).min(1, "최소 1개 이상의 태그가 필요합니다"),

	// 선택 필드
	thumbnail: z.string().optional(), // 로컬 경로(/images/...) 또는 URL
	series: z.string().optional(),
	index: z.number().int().positive().optional(),
	id: z.string().uuid().optional()
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;

/**
 * 하위 호환성을 위한 레거시 스키마
 * - 기존 필드명: title, publishedAt, summary, image
 */
export const LegacyFrontmatterSchema = z.object({
	title: z.string().min(1),
	publishedAt: z.string(),
	summary: z.string().min(1),
	image: z.string().optional()
});

export type LegacyFrontmatter = z.infer<typeof LegacyFrontmatterSchema>;

/**
 * 레거시 Frontmatter를 새 스키마로 변환
 */
export function migrateLegacyFrontmatter(legacy: LegacyFrontmatter): Frontmatter {
	return {
		title: legacy.title,
		short_description: legacy.summary,
		url_slug: "", // 파일명에서 추출 필요
		released_at: legacy.publishedAt,
		updated_at: legacy.publishedAt,
		is_private: false,
		tags: [], // 기본값
		thumbnail: legacy.image,
		series: undefined,
		index: undefined,
		id: undefined
	};
}
