import type { BlogPost } from "@/features/blog/types";
import { parseFrontmatter } from "@/features/blog/utils";
import { getGitHubFileContentRaw, getGitHubMDXFiles } from "@/shared/services";

/**
 * GitHub Repository에서 블로그 포스트를 가져옵니다.
 */
export async function getBlogPosts() {
	try {
		// 1. GitHub에서 MDX 파일 목록 가져오기
		const files = await getGitHubMDXFiles();

		// 2. 각 파일의 내용 가져오기 및 파싱
		const posts = await Promise.all<BlogPost>(
			files.map(async (file) => {
				const rawContent = await getGitHubFileContentRaw(file.name);
				const { metadata, content } = parseFrontmatter(rawContent);
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
