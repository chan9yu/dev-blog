import { createHighlighter } from "shiki";

// 모듈 레벨 싱글톤 — React.cache()는 요청당 1회라 동시 요청마다 새 인스턴스가 생성되어
// WASM 전역 메모리 공유 충돌(double free) 위험. reject 시 null로 초기화해 HMR 환경에서 재시도 가능.
let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

export async function getShikiHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
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
		}).catch((error: unknown) => {
			highlighterPromise = null;
			throw error;
		});
	}

	return highlighterPromise;
}
