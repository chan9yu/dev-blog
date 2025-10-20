import fs from "fs/promises";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");
const POSTS_DIR = path.join(CONTENT_DIR, "posts");
const ABOUT_DIR = path.join(CONTENT_DIR, "about");

type ContentFile = {
	name: string;
	path: string;
};

/**
 * posts 디렉토리의 포스트 목록을 가져옵니다.
 * posts/{slug}/index.mdx 구조를 가정합니다.
 */
export async function getContentMDXFiles(): Promise<ContentFile[]> {
	try {
		const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });

		// 디렉토리만 필터링 (각 디렉토리가 하나의 포스트)
		// @template 디렉토리는 제외
		return entries
			.filter((entry) => entry.isDirectory() && entry.name !== "@template")
			.map((entry) => ({
				name: entry.name,
				path: `posts/${entry.name}`
			}));
	} catch (error) {
		throw new Error(`Failed to read posts directory: ${error}`);
	}
}

/**
 * 특정 MDX 파일의 내용을 가져옵니다.
 * posts/{slug}/index.mdx 구조를 사용합니다.
 */
export async function getContentFileContentRaw(slug: string): Promise<string> {
	try {
		const filePath = path.join(POSTS_DIR, slug, "index.mdx");
		const content = await fs.readFile(filePath, "utf-8");
		return content;
	} catch (error) {
		throw new Error(`Failed to read post file (${slug}): ${error}`);
	}
}

/**
 * about 페이지 마크다운 컨텐츠를 가져옵니다.
 */
export async function getAboutContent(): Promise<string> {
	try {
		const filePath = path.join(ABOUT_DIR, "index.md");
		const content = await fs.readFile(filePath, "utf-8");
		return content;
	} catch (error) {
		throw new Error(`Failed to read about content: ${error}`);
	}
}
