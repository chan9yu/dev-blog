import { readFileSync } from "node:fs";
import { join } from "node:path";

const ABOUT_PATH = join(process.cwd(), "contents", "about", "index.md");

/**
 * About 페이지 본문 (M4-20, PRD §7.9).
 *
 * - `contents/about/index.md` 원본을 동기 fs로 읽어 string으로 반환.
 * - frontmatter 없는 단순 마크다운 — 호출자가 `<CustomMDX source={...} />`로 렌더.
 * - 파일 누락 시 throw — 빌드 시점에 즉시 감지하여 무음 실패 방지.
 *
 * 빌드 타임 1회 호출. 런타임 캐시 불필요 (RSC 캐시가 처리).
 */
export function getAboutContent(): string {
	return readFileSync(ABOUT_PATH, "utf-8");
}
