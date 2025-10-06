import type { BlogPost, PostSummary } from "@/features/blog/types";
import { parseFrontmatter, parseLegacyFrontmatter } from "@/features/blog/utils";
import { getGitHubFileContentRaw, getGitHubMDXFiles } from "@/shared/services";

/**
 * GitHub Repository에서 블로그 포스트를 가져옵니다 (레거시)
 * @deprecated getAllPosts() 사용 권장
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
	try {
		// 1. GitHub에서 MDX 파일 목록 가져오기
		const files = await getGitHubMDXFiles();

		// 2. 각 파일의 내용 가져오기 및 파싱
		const posts = await Promise.all(
			files.map(async (file) => {
				const rawContent = await getGitHubFileContentRaw(file.name);
				const { metadata, content } = parseLegacyFrontmatter(rawContent);
				const slug = file.name.replace(/\.mdx$/, "");

				return {
					metadata,
					slug,
					content
				};
			})
		);

		return posts;
	} catch (error) {
		console.error("Failed to fetch blog posts from GitHub:", error);
		return [];
	}
}

/**
 * GitHub Repository에서 모든 블로그 포스트를 가져옵니다 (새 API)
 */
export async function getAllPosts(): Promise<PostSummary[]> {
	try {
		// 1. GitHub에서 MDX 파일 목록 가져오기
		const files = await getGitHubMDXFiles();

		// 2. 각 파일의 내용 가져오기 및 파싱
		const posts = await Promise.all(
			files.map(async (file) => {
				const rawContent = await getGitHubFileContentRaw(file.name);
				const { metadata } = parseFrontmatter(rawContent);
				const url_slug = file.name.replace(/\.mdx$/, "");

				// url_slug 검증 (파일명과 일치해야 함)
				if (metadata.url_slug !== url_slug) {
					console.warn(
						`⚠️  [${file.name}] url_slug 불일치: frontmatter(${metadata.url_slug}) !== filename(${url_slug})`
					);
				}

				return {
					...metadata,
					url_slug // 파일명 우선 사용
				};
			})
		);

		return posts;
	} catch (error) {
		console.error("Failed to fetch blog posts from GitHub:", error);
		return [];
	}
}
