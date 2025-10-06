import matter from "gray-matter";

import type { Frontmatter } from "@/features/blog/schemas";
import { FrontmatterSchema, LegacyFrontmatterSchema, migrateLegacyFrontmatter } from "@/features/blog/schemas";
import type { Metadata } from "@/features/blog/types";

/**
 * MDX 파일 내용 파싱 및 Frontmatter 검증
 * - 새 스키마 우선 검증
 * - 실패 시 레거시 스키마로 fallback 및 마이그레이션
 */
export function parseFrontmatter(fileContent: string) {
	const { data, content } = matter(fileContent);

	// 1. 새 스키마 검증 시도
	const newSchemaResult = FrontmatterSchema.safeParse(data);
	if (newSchemaResult.success) {
		return {
			metadata: newSchemaResult.data,
			content
		};
	}

	// 2. 레거시 스키마 검증 시도
	const legacySchemaResult = LegacyFrontmatterSchema.safeParse(data);
	if (legacySchemaResult.success) {
		console.warn("⚠️  레거시 Frontmatter 형식 감지. 새 형식으로 마이그레이션을 권장합니다.");
		const migrated = migrateLegacyFrontmatter(legacySchemaResult.data);
		return {
			metadata: migrated,
			content
		};
	}

	// 3. 둘 다 실패 시 상세 에러 메시지
	throw new Error(
		`Frontmatter 검증 실패:\n` +
			`새 스키마 에러: ${JSON.stringify(newSchemaResult.error.issues, null, 2)}\n` +
			`레거시 스키마 에러: ${JSON.stringify(legacySchemaResult.error.issues, null, 2)}`
	);
}

/**
 * 레거시 파서 (하위 호환성)
 * @deprecated parseFrontmatter() 사용 권장
 */
export function parseLegacyFrontmatter(fileContent: string): { metadata: Metadata; content: string } {
	const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
	const match = frontmatterRegex.exec(fileContent);

	if (!match) {
		throw new Error("Invalid frontmatter format");
	}

	const frontMatterBlock = match[1];
	const content = fileContent.replace(frontmatterRegex, "").trim();
	const frontMatterLines = frontMatterBlock.trim().split("\n");
	const metadata: Partial<Metadata> = {};

	frontMatterLines.forEach((line) => {
		const [key, ...valueArr] = line.split(": ");
		let value = valueArr.join(": ").trim();
		value = value.replace(/^['"](.*)['"]$/, "$1");
		metadata[key.trim() as keyof Metadata] = value;
	});

	return { metadata: metadata as Metadata, content };
}

/**
 * Frontmatter만 추출 (내용 불필요한 경우)
 */
export function extractFrontmatter(fileContent: string): Frontmatter {
	const { metadata } = parseFrontmatter(fileContent);
	return metadata;
}
