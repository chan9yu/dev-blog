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
