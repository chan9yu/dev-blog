#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * 빌드 시 contents 서브모듈의 이미지를 public 폴더로 복사
 * contents/posts/[slug]/images/ → public/posts/[slug]/images/
 *
 * Next.js Image 컴포넌트가 Sharp를 사용하여 자동으로 최적화합니다.
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENTS_DIR = path.join(__dirname, "..", "contents", "posts");
const PUBLIC_DIR = path.join(__dirname, "..", "public", "posts");

async function copyImages() {
	try {
		console.log("📸 Starting image copy process...");

		// public/posts 디렉토리 생성
		await fs.mkdir(PUBLIC_DIR, { recursive: true });

		// contents/posts의 모든 포스트 디렉토리 읽기
		const postDirs = await fs.readdir(CONTENTS_DIR, { withFileTypes: true });

		let copiedCount = 0;

		for (const postDir of postDirs) {
			if (!postDir.isDirectory() || postDir.name === "@template") {
				continue;
			}

			const imagesSourceDir = path.join(CONTENTS_DIR, postDir.name, "images");
			const imagesTargetDir = path.join(PUBLIC_DIR, postDir.name, "images");

			// images 폴더가 있는지 확인
			try {
				await fs.access(imagesSourceDir);
			} catch {
				// images 폴더가 없으면 스킵
				continue;
			}

			// 타겟 디렉토리 생성
			await fs.mkdir(imagesTargetDir, { recursive: true });

			// 이미지 파일들 복사
			const imageFiles = await fs.readdir(imagesSourceDir);

			for (const imageFile of imageFiles) {
				const sourcePath = path.join(imagesSourceDir, imageFile);
				const targetPath = path.join(imagesTargetDir, imageFile);

				const stat = await fs.stat(sourcePath);
				if (stat.isFile()) {
					await fs.copyFile(sourcePath, targetPath);
					copiedCount++;
				}
			}
		}

		console.log(`✅ Image copy completed!`);
		console.log(`   Copied: ${copiedCount} images`);
		console.log(`   From: ${CONTENTS_DIR}`);
		console.log(`   To: ${PUBLIC_DIR}`);
	} catch (error) {
		console.error("❌ Error copying images:", error);
		process.exit(1);
	}
}

copyImages();
