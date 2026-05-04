#!/usr/bin/env node
// 빌드 타임에 contents/posts/* MDX를 스캔하여 검색 인덱스를 정적 JSON으로 emit한다.
// → app/layout.tsx의 runtime fs.readdirSync(contents/) 의존을 제거 → Vercel lambda contents/ 부재 시 ENOENT 회귀 차단.
//
// schema 검증은 `next build`의 STRICT_FRONTMATTER=1 path가 동일 contents/를 다시 검증하므로 이중 안전판.
// 본 스크립트가 emit한 JSON과 페이지·sitemap이 빌드 타임에 본 결과는 동일한 contents/ 스냅샷을 source로 함.

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const POSTS_DIR = join(ROOT, "contents", "posts");
const OUT_DIR = join(ROOT, "src", "shared", "data");
const OUT_FILE = join(OUT_DIR, "search-index.json");

const CHARS_PER_MINUTE = 500;

function calculateReadingTime(content) {
	const stripped = content
		.replace(/```[\s\S]*?```/g, "")
		.replace(/\$\$[\s\S]*?\$\$/g, "")
		.replace(/\$[^$\n]+\$/g, "")
		.replace(/!\[.*?\]\(.*?\)/g, "")
		.trim();
	return Math.max(1, Math.ceil(stripped.length / CHARS_PER_MINUTE));
}

function buildIndex() {
	const slugs = readdirSync(POSTS_DIR, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("@"))
		.map((dirent) => dirent.name);

	const summaries = [];

	for (const slug of slugs) {
		const filePath = join(POSTS_DIR, slug, "index.mdx");
		const raw = readFileSync(filePath, "utf-8").replace(/^--(?!-)/gm, "---");
		const { data, content } = matter(raw);

		if (data.slug !== slug) {
			throw new Error(`[build-search-index] slug 불일치: frontmatter.slug="${data.slug}" ≠ 디렉토리="${slug}"`);
		}
		if (data.private === true) continue;

		// PostSummary schema(src/shared/types/post.ts) 1:1 mirror — Zod default는 build의 parseFrontmatter가 적용.
		summaries.push({
			title: data.title,
			description: data.description,
			slug: data.slug,
			date: data.date,
			private: false,
			tags: Array.isArray(data.tags) ? data.tags : [],
			thumbnail: typeof data.thumbnail === "string" ? data.thumbnail : null,
			series: typeof data.series === "string" ? data.series : null,
			seriesOrder: typeof data.seriesOrder === "number" ? data.seriesOrder : null,
			readingTimeMinutes: calculateReadingTime(content)
		});
	}

	summaries.sort((a, b) => b.date.localeCompare(a.date));
	return summaries;
}

const index = buildIndex();

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(index, null, 2) + "\n");
console.log(`[build-search-index] ${index.length} posts → src/shared/data/search-index.json`);
