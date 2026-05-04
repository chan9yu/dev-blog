import { readFileSync } from "node:fs";
import { join } from "node:path";

const ABOUT_PATH = join(process.cwd(), "contents", "about", "index.md");

// 파일 누락 시 throw — 빌드 시점에 즉시 감지하여 무음 실패 방지.
export function getAboutContent() {
	return readFileSync(ABOUT_PATH, "utf-8");
}
