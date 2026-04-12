import { z } from "zod";

/**
 * Frontmatter 스키마 정의
 * - GitHub 레포의 MDX 파일 메타데이터 검증
 * - 빌드 타임에 타입 안정성 보장
 */
export const FrontmatterSchema = z.object({
	// 필수 필드
	title: z.string().min(1, "제목은 필수입니다"),
	description: z.string().min(1, "설명은 필수입니다"),
	slug: z.string().min(1, "Slug는 필수입니다"),
	date: z.string().datetime("ISO 8601 형식의 날짜가 필요합니다"),
	private: z.boolean().default(false),

	// 선택 필드
	tags: z.array(z.string()).default([]),
	thumbnail: z.string().nullable().default(null),
	series: z.string().nullable().default(null),
	seriesOrder: z.number().int().positive().nullable().default(null)
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;
