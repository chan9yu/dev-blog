import { z } from "zod";

/**
 * MDX frontmatter 검증 스키마 (M2-05).
 *
 * - date: ISO 8601 날짜 또는 날짜+시간
 * - slug: 영문 소문자·숫자·하이픈만 허용 (SEO 규약)
 * - series·seriesOrder: 둘 다 설정되거나 둘 다 null이어야 함
 * - private: 기본값 false
 *
 * M2에서 PostFrontmatter 타입의 단일 진실 공급원.
 * M1에서 정의한 src/shared/types/post.ts의 PostFrontmatter와 동일 구조를 유지해
 * z.infer 교체 시 하위 호환 보장.
 */
export const PostFrontmatterSchema = z
	.object({
		title: z.string().min(1),
		description: z.string().min(1),
		slug: z.string().regex(/^[a-z0-9-]+$/, "slug는 영문 소문자·숫자·하이픈만 허용"),
		date: z.string().regex(/^\d{4}-\d{2}-\d{2}(T.*)?$/, "date는 ISO 8601 형식이어야 합니다"),
		private: z.boolean().default(false),
		tags: z.array(z.string()).default([]),
		thumbnail: z.string().nullable().default(null),
		series: z.string().nullable().default(null),
		seriesOrder: z.number().int().positive().nullable().default(null)
	})
	.refine(
		(data) => {
			const hasSeries = data.series !== null;
			const hasOrder = data.seriesOrder !== null;
			return hasSeries === hasOrder;
		},
		{
			message: "series와 seriesOrder는 함께 설정되거나 함께 null이어야 합니다"
		}
	);

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;
