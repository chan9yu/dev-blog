import { createHighlighter } from "shiki";

/**
 * Shiki 싱글톤 highlighter (M2-20, ADR-001).
 * 모듈 레벨 Promise로 프로세스당 단 1개의 인스턴스만 생성한다.
 *
 * React.cache()는 요청당 1회이므로 동시 요청마다 새 인스턴스가 생성되어
 * WASM 전역 메모리 공유 충돌(double free) 위험이 있음 → 모듈 레벨 싱글턴으로 교체.
 * CustomMDX.tsx의 "use cache" 디렉티브가 Date.now() prerender 오류를 차단한다.
 *
 * 테마: github-light / github-dark (듀얼 테마 CSS 변수 방식)
 * 언어: 기술 블로그 필수 언어 서브셋 (전체 번들 방지)
 */
const _highlighterPromise = createHighlighter({
	themes: ["github-light", "github-dark"],
	langs: [
		"javascript",
		"typescript",
		"jsx",
		"tsx",
		"bash",
		"sh",
		"shell",
		"json",
		"yaml",
		"html",
		"css",
		"markdown",
		"python",
		"sql",
		"text"
	]
});

export async function getShikiHighlighter() {
	return _highlighterPromise;
}
