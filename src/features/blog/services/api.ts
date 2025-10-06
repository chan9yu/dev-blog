import type { PostDetail, PostSummary } from "@/features/blog/types";
import { parseFrontmatter } from "@/features/blog/utils";
import { getGitHubFileContentRaw, getGitHubMDXFiles } from "@/shared/services";

/**
 * GitHub Repository에서 모든 블로그 포스트를 가져옵니다
 */
export async function getAllPosts(): Promise<PostSummary[]> {
	try {
		// 1. GitHub에서 포스트 디렉토리 목록 가져오기
		const directories = await getGitHubMDXFiles();

		// 2. 각 디렉토리의 index.mdx 내용 가져오기 및 파싱
		const posts = await Promise.all(
			directories.map(async (dir) => {
				const url_slug = dir.name;
				const rawContent = await getGitHubFileContentRaw(url_slug);
				const { metadata } = parseFrontmatter(rawContent);

				// url_slug 검증 (디렉토리명과 일치해야 함)
				if (metadata.url_slug !== url_slug) {
					console.warn(`⚠️  [${dir.name}] url_slug 불일치: frontmatter(${metadata.url_slug}) !== dirname(${url_slug})`);
				}

				return {
					...metadata,
					url_slug // 디렉토리명 우선 사용
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
 * 특정 포스트의 상세 정보를 가져옵니다
 */
export async function getPostDetail(slug: string): Promise<PostDetail | null> {
	try {
		const rawContent = await getGitHubFileContentRaw(slug);
		const { metadata, content } = parseFrontmatter(rawContent);

		return {
			...metadata,
			url_slug: slug,
			content
		};
	} catch (error) {
		console.error(`Failed to fetch post detail for ${slug}:`, error);
		return null;
	}
}
