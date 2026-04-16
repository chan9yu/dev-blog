import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import matter from "gray-matter";

import type { PostSummary } from "@/shared/types";

import { calculateReadingTime } from "../utils/calculateReadingTime";
import { parseFrontmatter } from "../utils/parseFrontmatter";
import { sortPostsByDateDescending } from "../utils/sortPostsByDateDescending";
import { POSTS_DIR } from "./paths";

type GetAllPostsOptions = {
	/** true면 private 포스트도 포함한다. 기본값: false */
	includePrivate?: boolean;
};

/**
 * contents/posts/ 디렉토리를 스캔해 PostSummary[] 를 반환한다 (M2-13).
 *
 * - @ 로 시작하는 디렉토리(@template 등)는 건너뛴다.
 * - frontmatter 파싱·검증 오류가 있는 포스트는 건너뛴다.
 * - 기본적으로 private: false 포스트만 반환한다.
 * - 결과는 날짜 내림차순 정렬.
 */
export function getAllPosts(options: GetAllPostsOptions = {}): PostSummary[] {
	const { includePrivate = false } = options;

	const slugs = readdirSync(POSTS_DIR, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("@"))
		.map((dirent) => dirent.name);

	const posts: PostSummary[] = [];

	for (const slug of slugs) {
		try {
			const filePath = join(POSTS_DIR, slug, "index.mdx");
			const raw = readFileSync(filePath, "utf-8");
			const frontmatter = parseFrontmatter(raw, slug);

			if (!includePrivate && frontmatter.private) continue;

			const { content } = matter(raw);
			const readingTimeMinutes = calculateReadingTime(content);

			posts.push({ ...frontmatter, readingTimeMinutes });
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			console.warn(`[getAllPosts] "${slug}" 건너뜀: ${message}`);
		}
	}

	return sortPostsByDateDescending(posts);
}
