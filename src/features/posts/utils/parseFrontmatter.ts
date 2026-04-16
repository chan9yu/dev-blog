import matter from "gray-matter";

import type { PostFrontmatter } from "../schemas/frontmatter";
import { PostFrontmatterSchema } from "../schemas/frontmatter";

/**
 * MDX 파일 원문에서 frontmatter를 파싱하고 검증한다 (M2-04).
 *
 * 처리 단계:
 * 1. `--`로 시작하는 구분자를 `---`로 보정 (일부 에디터의 잘못된 출력 대응)
 * 2. gray-matter로 frontmatter 데이터 추출
 * 3. PostFrontmatterSchema(Zod)로 타입·필드 검증
 * 4. frontmatter.slug ↔ 디렉토리명(dirSlug) 일치 검증
 *
 * @param raw     MDX 파일 전체 원문
 * @param dirSlug contents/posts/{dirSlug}/index.mdx의 디렉토리명
 * @throws 스키마 위반·slug 불일치 시 Error
 */
export function parseFrontmatter(raw: string, dirSlug: string): PostFrontmatter {
	// 1. -- → --- 보정 (줄 시작의 --만, ---은 건드리지 않음)
	const normalized = raw.replace(/^--(?!-)/gm, "---");

	// 2. gray-matter 파싱
	const { data } = matter(normalized);

	// 3. Zod 스키마 검증
	const result = PostFrontmatterSchema.safeParse(data);
	if (!result.success) {
		throw new Error(`[parseFrontmatter] slug="${dirSlug}" 스키마 검증 실패:\n${result.error.message}`);
	}

	// 4. slug ↔ 디렉토리명 일치 검증
	if (result.data.slug !== dirSlug) {
		throw new Error(`[parseFrontmatter] slug 불일치: frontmatter.slug="${result.data.slug}" ≠ 디렉토리="${dirSlug}"`);
	}

	return result.data;
}
