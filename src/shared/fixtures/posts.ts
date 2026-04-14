import type { PostSummary } from "@/shared/types";

/**
 * 더미 PostSummary 13건 — date desc 정렬.
 *
 * 구성:
 * - public 12건 + private 1건
 * - 시리즈: react-19-deep-dive(3) / nextjs-app-router-patterns(3) / typescript-type-system(2)
 * - 스탠드얼론: 4건(public) + 1건(private)
 * - thumbnail: public 12건 중 7건 할당, 6건 null. 실제 기존 포스트 frontmatter 규약과 동일한 평탄 문자열 경로.
 *
 * 주의: M2에서 `PostFrontmatterSchema`(Zod) 파싱 결과와 필드 일치.
 */
export const postsFixture: PostSummary[] = [
	{
		title: "React 19 Form Actions 실전 패턴",
		description:
			"React 19의 <form action={...}>과 useActionState, useFormStatus를 조합해 낙관적 UI·에러 처리까지 선언적으로 구성하는 방법을 정리한다.",
		slug: "react-19-form-actions",
		date: "2026-04-10",
		private: false,
		tags: ["react", "react-19", "forms"],
		thumbnail: "/posts/react-19-form-actions/images/thumbnail.png",
		series: "react-19-deep-dive",
		seriesOrder: 3,
		readingTimeMinutes: 7
	},
	{
		title: "Next.js Server Actions 보안 체크리스트",
		description:
			"Server Actions가 엔드포인트로 노출되는 구조를 이해하고, 인증·인가·입력 검증·rate limit까지 프로덕션 레벨의 방어 패턴을 점검한다.",
		slug: "nextjs-server-actions-security",
		date: "2026-04-05",
		private: false,
		tags: ["nextjs", "security", "server-actions"],
		thumbnail: null,
		series: "nextjs-app-router-patterns",
		seriesOrder: 3,
		readingTimeMinutes: 9
	},
	{
		title: "React Compiler 심층 분석: memo가 사라지는 날",
		description:
			"React 19 Compiler의 자동 메모이제이션 원리, 적용 범위, 수동 최적화가 여전히 필요한 엣지 케이스를 실제 빌드 산출물과 함께 해부한다.",
		slug: "react-19-compiler-deep-dive",
		date: "2026-03-28",
		private: false,
		tags: ["react", "react-19", "performance"],
		thumbnail: "/posts/react-19-compiler-deep-dive/images/thumbnail.png",
		series: "react-19-deep-dive",
		seriesOrder: 2,
		readingTimeMinutes: 14
	},
	{
		title: "TypeScript strict null checks로 런타임 버그 99% 잡기",
		description:
			"strictNullChecks 플래그가 실제로 어떤 코드 경로를 보호하는지, 타입 가드·exhaustive check·branded types와 결합해 런타임 안전성을 극대화하는 법.",
		slug: "typescript-strict-null-checks",
		date: "2026-03-20",
		private: false,
		tags: ["typescript", "type-safety"],
		thumbnail: null,
		series: null,
		seriesOrder: null,
		readingTimeMinutes: 5
	},
	{
		title: "Next.js Partial Prerendering 실전 적용기",
		description:
			"정적 쉘 + 동적 홀(hole)을 조합하는 PPR이 LCP와 CDN 캐시 히트율에 미치는 영향을 측정하고, 라우트별 적용 전략을 제시한다.",
		slug: "nextjs-partial-prerendering",
		date: "2026-03-12",
		private: false,
		tags: ["nextjs", "performance", "rendering"],
		thumbnail: "/posts/nextjs-partial-prerendering/images/thumbnail.png",
		series: "nextjs-app-router-patterns",
		seriesOrder: 2,
		readingTimeMinutes: 10
	},
	{
		title: "Tailwind CSS 4 아키텍처 재설계",
		description:
			"Oxide 엔진과 @theme 블록을 중심으로 Tailwind 4가 바꾼 디자인 토큰 SSOT 전략, 컴포넌트 라이브러리 공존법을 구체적 예시로 풀어본다.",
		slug: "tailwind-4-architecture",
		date: "2026-03-05",
		private: false,
		tags: ["css", "tailwind", "architecture"],
		thumbnail: "/posts/tailwind-4-architecture/images/thumbnail.png",
		series: null,
		seriesOrder: null,
		readingTimeMinutes: 13
	},
	{
		title: "React 19 use() 훅 완벽 이해",
		description:
			"use() 훅이 Suspense·Promise·Context와 어떻게 통합되는지 내부 동작까지 풀어보고, 기존 useEffect 패턴을 어떻게 대체하는지 비교한다.",
		slug: "react-19-use-hook",
		date: "2026-02-26",
		private: false,
		tags: ["react", "react-19", "suspense"],
		thumbnail: "/posts/react-19-use-hook/images/thumbnail.png",
		series: "react-19-deep-dive",
		seriesOrder: 1,
		readingTimeMinutes: 8
	},
	{
		title: "Next.js 16 Cache Components 설계 원리",
		description:
			"fetch·unstable_cache·cacheLife·cacheTag가 만드는 새로운 캐시 계층 구조와, 기존 revalidate 모델이 어떻게 진화했는지 풀어본다.",
		slug: "nextjs-16-cache-components",
		date: "2026-02-18",
		private: false,
		tags: ["nextjs", "cache", "architecture"],
		thumbnail: null,
		series: "nextjs-app-router-patterns",
		seriesOrder: 1,
		readingTimeMinutes: 12
	},
	{
		title: "Playwright 컴포넌트 테스트 실전",
		description:
			"Jest/Vitest + RTL로 커버하기 어려운 실제 렌더 환경의 테스트를 Playwright Component Testing으로 구현하고 CI에 통합하는 전 과정.",
		slug: "playwright-component-testing",
		date: "2026-02-10",
		private: false,
		tags: ["testing", "playwright", "react"],
		thumbnail: "/posts/playwright-component-testing/images/thumbnail.png",
		series: null,
		seriesOrder: null,
		readingTimeMinutes: 8
	},
	{
		title: "TypeScript Conditional Types 완전 정복",
		description:
			"infer·distributive conditional·naked type parameter 규칙을 체계적으로 정리하고, 실제 라이브러리에서 어떻게 조합되는지 케이스 분석.",
		slug: "typescript-conditional-types",
		date: "2026-02-03",
		private: false,
		tags: ["typescript", "type-system"],
		thumbnail: null,
		series: "typescript-type-system",
		seriesOrder: 2,
		readingTimeMinutes: 11
	},
	{
		title: "웹 접근성: 포커스 관리 완벽 가이드",
		description:
			"모달·드로어·동적 콘텐츠에서 포커스를 잃지 않게 관리하는 패턴과, React에서 useRef·FocusTrap·inert를 조합한 구현 전략을 정리한다.",
		slug: "a11y-focus-management",
		date: "2026-01-25",
		private: false,
		tags: ["a11y", "ux", "react"],
		thumbnail: "/posts/a11y-focus-management/images/thumbnail.png",
		series: null,
		seriesOrder: null,
		readingTimeMinutes: 7
	},
	{
		title: "TypeScript Template Literal Types 입문",
		description:
			"문자열 템플릿을 타입 레벨에서 다루는 template literal types의 기본 문법과, API 라우트 타이핑·CSS 유틸 타이핑에 활용하는 예제.",
		slug: "typescript-template-literal-types",
		date: "2026-01-15",
		private: false,
		tags: ["typescript", "type-system"],
		thumbnail: null,
		series: "typescript-type-system",
		seriesOrder: 1,
		readingTimeMinutes: 6
	},
	{
		title: "[INTERNAL] 블로그 개발일지 스케치",
		description:
			"공개 전 단계의 내부 메모. 블로그 구조 결정·실패 사례·리팩토링 후보를 자유 형식으로 기록하는 비공개 포스트 샘플.",
		slug: "internal-devlog-sketch",
		date: "2026-01-08",
		private: true,
		tags: ["meta"],
		thumbnail: null,
		series: null,
		seriesOrder: null,
		readingTimeMinutes: 3
	}
];
