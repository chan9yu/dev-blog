#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENTS_DIR = path.join(__dirname, "..", "contents", "posts");
const PUBLIC_DIR = path.join(__dirname, "..", "public", "posts");

async function copyImages() {
	try {
		await fs.mkdir(PUBLIC_DIR, { recursive: true });
		const postDirs = await fs.readdir(CONTENTS_DIR, { withFileTypes: true });

		for (const postDir of postDirs) {
			if (!postDir.isDirectory() || postDir.name === "@template") {
				continue;
			}

			const imagesSourceDir = path.join(CONTENTS_DIR, postDir.name, "images");
			const imagesTargetDir = path.join(PUBLIC_DIR, postDir.name, "images");

			try {
				await fs.access(imagesSourceDir);
			} catch {
				continue;
			}

			await fs.mkdir(imagesTargetDir, { recursive: true });
			const imageFiles = await fs.readdir(imagesSourceDir);

			for (const imageFile of imageFiles) {
				const sourcePath = path.join(imagesSourceDir, imageFile);
				const targetPath = path.join(imagesTargetDir, imageFile);
				const stat = await fs.stat(sourcePath);

				if (stat.isFile()) {
					await fs.copyFile(sourcePath, targetPath);
				}
			}
		}
	} catch (error) {
		console.error("Error copying images:", error);
		process.exit(1);
	}
}

copyImages();
