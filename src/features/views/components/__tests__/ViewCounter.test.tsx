/**
 * ViewCounter Integration 테스트 — ROADMAP M3-09 Red.
 *
 * 계약:
 * - 초기 렌더는 로딩 placeholder 표시 (`조회수 불러오는 중`)
 * - 마운트 직후 POST `/api/views` +1 → GET으로 최종값 수신 → 숫자 렌더
 * - 동일 세션에서 같은 slug 재마운트 시 POST 재호출 금지 (sessionStorage dedup)
 * - 서버 500 → `— 회` fallback, aria-label은 `조회수 정보 없음`
 *
 * Red 단계: 현재 ViewCounter는 `views` prop 기반 server 컴포넌트로 slug fetch 미수행.
 * M3-10 Green에서 `useViews(slug)` 훅 + sessionStorage dedup 도입 시 녹색 전환.
 */

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetMockViews, seedMockView } from "@/shared/test/msw/handlers";
import { server } from "@/shared/test/msw/server";

import { ViewCounter } from "../ViewCounter";

beforeEach(() => {
	vi.spyOn(console, "warn").mockImplementation(() => {});
	sessionStorage.clear();
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	resetMockViews();
});

describe("ViewCounter", () => {
	it("초기 렌더는 로딩 placeholder 표시", () => {
		render(<ViewCounter slug="react-19-use" />);
		expect(screen.getByLabelText("조회수 불러오는 중")).toBeInTheDocument();
	});

	it("마운트 후 POST +1 + GET으로 실 숫자 표시 (seeded 42 → 43)", async () => {
		seedMockView("react-19-use", 42);
		render(<ViewCounter slug="react-19-use" />);

		await waitFor(() => {
			expect(screen.getByLabelText("조회수 43회")).toBeInTheDocument();
		});
		expect(screen.getByText("43회")).toBeInTheDocument();
	});

	it("3자리 이상 숫자는 toLocaleString(ko-KR) 포맷", async () => {
		seedMockView("popular", 1233); // POST +1 → 1234
		render(<ViewCounter slug="popular" />);

		await waitFor(() => {
			expect(screen.getByLabelText("조회수 1234회")).toBeInTheDocument();
		});
		expect(screen.getByText("1,234회")).toBeInTheDocument();
	});

	it("동일 세션에서 같은 slug 재마운트 시 POST 재호출 금지 (sessionStorage dedup)", async () => {
		seedMockView("dedup-post", 10);

		const { unmount } = render(<ViewCounter slug="dedup-post" />);
		await waitFor(() => {
			expect(screen.getByLabelText("조회수 11회")).toBeInTheDocument();
		});
		unmount();

		// 재마운트: POST가 다시 일어나면 12가 될 것. dedup이 있으면 11 유지.
		render(<ViewCounter slug="dedup-post" />);
		await waitFor(() => {
			expect(screen.getByLabelText("조회수 11회")).toBeInTheDocument();
		});
	});

	it("서로 다른 slug는 각각 POST (dedup은 slug별)", async () => {
		seedMockView("post-a", 5);
		seedMockView("post-b", 20);

		render(<ViewCounter slug="post-a" />);
		await waitFor(() => {
			expect(screen.getByLabelText("조회수 6회")).toBeInTheDocument();
		});
		cleanup();

		render(<ViewCounter slug="post-b" />);
		await waitFor(() => {
			expect(screen.getByLabelText("조회수 21회")).toBeInTheDocument();
		});
	});

	it("GET 500 실패 시 `— 회` fallback + 정보 없음 aria-label", async () => {
		server.use(http.get("/api/views", () => HttpResponse.json({ error: "boom" }, { status: 500 })));

		render(<ViewCounter slug="broken" />);
		await waitFor(() => {
			expect(screen.getByLabelText("조회수 정보 없음")).toBeInTheDocument();
		});
		expect(screen.getByText("— 회")).toBeInTheDocument();
	});

	it("POST 실패도 UI 블록 없이 GET 결과 표시 (POST는 best-effort)", async () => {
		seedMockView("post-c", 99);
		server.use(http.post("/api/views", () => HttpResponse.error()));

		render(<ViewCounter slug="post-c" />);
		await waitFor(() => {
			// POST 실패했으므로 값이 증가하지 않고 99 유지
			expect(screen.getByLabelText("조회수 99회")).toBeInTheDocument();
		});
	});
});
