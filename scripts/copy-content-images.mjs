#!/usr/bin/env node
/**
 * M2-18: 컨텐츠 이미지 복사 스크립트 (멱등·prune)
 *
 * contents/posts/{slug}/images/** → public/posts/{slug}/images/**
 * - mtime 비교로 변경된 파일만 복사 (멱등)
 * - 원본에 없는 대상 디렉토리 제거 (prune)
 *
 * 사용: node scripts/copy-content-images.mjs
 */

import { cpSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const CONTENTS_DIR = join(process.cwd(), "contents", "posts");
const PUBLIC_DIR = join(process.cwd(), "public", "posts");

/**
 * 디렉토리에서 모든 파일 경로를 재귀적으로 수집한다.
 * @param {string} dir
 * @returns {string[]}
 */
function collectFiles(dir) {
	const result = [];
	let entries;

	try {
		entries = readdirSync(dir, { withFileTypes: true });
	} catch {
		return result;
	}

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			result.push(...collectFiles(fullPath));
		} else {
			result.push(fullPath);
		}
	}

	return result;
}

/**
 * 디렉토리가 존재하는지 확인한다.
 * @param {string} dir
 * @returns {boolean}
 */
function dirExists(dir) {
	try {
		return statSync(dir).isDirectory();
	} catch {
		return false;
	}
}

function main() {
	let copied = 0;
	let skipped = 0;
	let pruned = 0;

	// --- 1. Source slugs 수집 ---
	let slugDirs;
	try {
		slugDirs = readdirSync(CONTENTS_DIR, { withFileTypes: true }).filter(
			(d) => d.isDirectory() && !d.name.startsWith("@")
		);
	} catch (err) {
		const isNotFound = /** @type {NodeJS.ErrnoException} */ (err).code === "ENOENT";
		if (isNotFound) {
			console.log("[copy-content-images] contents/posts/ 디렉토리 없음, 스킵.");
			return;
		}
		throw err;
	}

	const sourceSlugs = new Set(slugDirs.map((d) => d.name));

	// --- 2. 소스 → 대상 복사 ---
	for (const slugDir of slugDirs) {
		const slug = slugDir.name;
		const srcImagesDir = join(CONTENTS_DIR, slug, "images");
		const destImagesDir = join(PUBLIC_DIR, slug, "images");

		if (!dirExists(srcImagesDir)) continue;

		const srcFiles = collectFiles(srcImagesDir);

		for (const srcFile of srcFiles) {
			const relPath = relative(srcImagesDir, srcFile);
			const destFile = join(destImagesDir, relPath);

			// mtime 비교
			let shouldCopy = true;
			try {
				const srcStat = statSync(srcFile);
				const destStat = statSync(destFile);
				if (destStat.mtimeMs >= srcStat.mtimeMs) {
					shouldCopy = false;
					skipped++;
				}
			} catch (err) {
				// ENOENT: 대상 파일 없음 → 복사 필요. 그 외 에러는 재throw.
				if (/** @type {NodeJS.ErrnoException} */ (err).code !== "ENOENT") throw err;
			}

			if (shouldCopy) {
				mkdirSync(dirname(destFile), { recursive: true });
				cpSync(srcFile, destFile);
				copied++;
				console.log(`  ✓ ${slug}/images/${relPath}`);
			}
		}
	}

	// --- 3. Prune: 소스에 없는 대상 slug의 이미지 디렉토리 제거 ---
	let destSlugs = [];
	try {
		destSlugs = readdirSync(PUBLIC_DIR, { withFileTypes: true })
			.filter((d) => d.isDirectory())
			.map((d) => d.name);
	} catch (err) {
		// ENOENT: public/posts/ 없음 → prune 불필요. 그 외 에러는 재throw.
		if (/** @type {NodeJS.ErrnoException} */ (err).code !== "ENOENT") throw err;
	}

	for (const destSlug of destSlugs) {
		// sourceSlugs에 있는 포스트는 건드리지 않음.
		// sourceSlugs에 없더라도 contents/posts/에서 유래하지 않은 디렉토리
		// (예: public/posts/placeholders)는 images/ 하위가 없으면 skip.
		if (sourceSlugs.has(destSlug)) continue;

		const destImagesDir = join(PUBLIC_DIR, destSlug, "images");
		if (!dirExists(destImagesDir)) continue;

		rmSync(destImagesDir, { recursive: true, force: true });
		pruned++;
		console.log(`  ✗ pruned public/posts/${destSlug}/images`);
	}

	console.log(`\n[copy-content-images] 완료 — 복사: ${copied}개, 스킵: ${skipped}개, 제거: ${pruned}개`);
}

main();
