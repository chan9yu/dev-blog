/**
 * CommentsSection Integration 테스트 — ROADMAP M3-11 Red.
 *
 * 계약:
 * - `isPrivate=true` → 섹션 비렌더 (Giscus 로드 금지, 개인정보 유출 방지)
 * - 환경변수(`NEXT_PUBLIC_GISCUS_*`) 누락 → placeholder + 설정 안내 메시지
 * - 환경변수 OK + `IntersectionObserver.isIntersecting=true` → Giscus client.js script 주입
 * - 언마운트 시 script 정리
 *
 * Red: 현재 구현은 "스크롤하면 댓글이 로드됩니다" placeholder만 표시. Giscus 주입·privacy 미구현.
 */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CommentsSection } from "../CommentsSection";

type IntersectionCb = (entries: Array<{ isIntersecting: boolean }>) => void;

let observeCallbacks: Array<IntersectionCb> = [];

class MockIntersectionObserver {
	constructor(cb: IntersectionCb) {
		observeCallbacks.push(cb);
	}
	observe() {
		// 즉시 교차 발동
		const cb = observeCallbacks[observeCallbacks.length - 1];
		cb?.([{ isIntersecting: true }]);
	}
	disconnect() {}
	unobserve() {}
}

const giscusEnv = {
	NEXT_PUBLIC_GISCUS_REPO: "chan9yu/dev-blog",
	NEXT_PUBLIC_GISCUS_REPO_ID: "R_kgDO_test",
	NEXT_PUBLIC_GISCUS_CATEGORY: "Comments",
	NEXT_PUBLIC_GISCUS_CATEGORY_ID: "DIC_kwDO_test"
};

beforeEach(() => {
	observeCallbacks = [];
	vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
	vi.unstubAllEnvs();
});

describe("CommentsSection", () => {
	it("isPrivate=true면 섹션 비렌더 (댓글 제목도 없음)", () => {
		for (const [k, v] of Object.entries(giscusEnv)) vi.stubEnv(k, v);
		const { container } = render(<CommentsSection slug="private-post" isPrivate />);
		expect(container.firstChild).toBeNull();
		expect(screen.queryByText("댓글")).not.toBeInTheDocument();
	});

	it("환경변수 누락 시 config 안내 placeholder 렌더", () => {
		// env 설정 안 함
		render(<CommentsSection slug="react-19-use" />);
		expect(screen.getByRole("heading", { name: "댓글" })).toBeInTheDocument();
		expect(screen.getByText(/Giscus 환경변수.*설정/)).toBeInTheDocument();
	});

	it("환경변수 + intersection 후 giscus.app/client.js script 주입", () => {
		for (const [k, v] of Object.entries(giscusEnv)) vi.stubEnv(k, v);
		const { container } = render(<CommentsSection slug="react-19-use" />);

		const script = container.querySelector<HTMLScriptElement>('script[src="https://giscus.app/client.js"]');
		expect(script).not.toBeNull();
		expect(script?.dataset.repo).toBe(giscusEnv.NEXT_PUBLIC_GISCUS_REPO);
		expect(script?.dataset.repoId).toBe(giscusEnv.NEXT_PUBLIC_GISCUS_REPO_ID);
		expect(script?.dataset.category).toBe(giscusEnv.NEXT_PUBLIC_GISCUS_CATEGORY);
		expect(script?.dataset.categoryId).toBe(giscusEnv.NEXT_PUBLIC_GISCUS_CATEGORY_ID);
		expect(script?.dataset.term).toBe("posts/react-19-use");
		expect(script?.dataset.mapping).toBe("specific");
		expect(script?.crossOrigin).toBe("anonymous");
		expect(script?.async).toBe(true);
	});

	it("서로 다른 slug는 서로 다른 data-term으로 스크립트 주입", () => {
		for (const [k, v] of Object.entries(giscusEnv)) vi.stubEnv(k, v);

		const { container: c1 } = render(<CommentsSection slug="post-a" />);
		expect(c1.querySelector<HTMLScriptElement>('script[src*="giscus.app"]')?.dataset.term).toBe("posts/post-a");
		cleanup();

		const { container: c2 } = render(<CommentsSection slug="post-b" />);
		expect(c2.querySelector<HTMLScriptElement>('script[src*="giscus.app"]')?.dataset.term).toBe("posts/post-b");
	});

	it("언마운트 시 script 정리 (메모리 누수 방지)", () => {
		for (const [k, v] of Object.entries(giscusEnv)) vi.stubEnv(k, v);
		const { container, unmount } = render(<CommentsSection slug="react-19-use" />);

		expect(container.querySelector('script[src*="giscus.app"]')).not.toBeNull();
		unmount();
		// 언마운트 후 script 요소는 React가 해당 node 트리에서 제거해야 함
		expect(document.querySelector('script[src*="giscus.app"]')).toBeNull();
	});
});
