import type { PostDetail, TocItem } from "@/shared/types";

import { postsFixture } from "./posts";

type DetailBody = {
	slug: string;
	contentMdx: string;
	toc: TocItem[];
};

/**
 * module-level throw — 이 파일을 import하는 시점에 평가된다.
 * `DETAIL_BODIES`에 postsFixture에 없는 slug가 추가되면 import 에러로 표면화되므로
 * M2 실데이터 교체 전까지의 fixture 단계에서 경계 불일치를 조기에 잡는 가드 역할.
 */
const findSummary = (slug: string) => {
	const summary = postsFixture.find((post) => post.slug === slug);
	if (!summary) {
		throw new Error(`postsFixture에 slug "${slug}"가 없습니다. post-details.ts 작성 전 posts.ts를 확인하세요.`);
	}
	return summary;
};

/**
 * 본문 샘플은 실제 MDX 파싱 대체용 문자열 리터럴.
 * M2에서 `next-mdx-remote/rsc`로 실제 MDX 파일에서 읽어온 값이 이 자리에 들어간다.
 * 본문 heading은 `##`부터 (title은 frontmatter에서 자동 렌더).
 */
const DETAIL_BODIES: DetailBody[] = [
	{
		slug: "react-19-use-hook",
		contentMdx: `첫 단락은 이 글이 왜·누구를 위해·무엇을 다루는지 150자 내로 소개한다.

## use() 훅이 등장한 맥락

React 19 이전에는 Promise를 컴포넌트에서 바로 unwrap하려면 \`useEffect\` + 상태 관리 조합이 필요했다.

### 기존 방식의 한계

- 로딩·에러 상태를 수동 관리
- Suspense와 자연스럽게 결합되지 않음

## use() 훅 시그니처와 동작

\`\`\`tsx title="app/posts/[slug]/page.tsx"
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <article data-slug={slug} />;
}
\`\`\`

### Promise vs Context unwrap

\`use()\`는 Promise뿐 아니라 Context도 조건부로 읽을 수 있다.

## 마이그레이션 체크리스트

기존 \`useEffect\` 기반 데이터 패칭을 서서히 \`use()\`로 전환할 때 고려할 점.`,
		toc: [
			{ id: "use-훅이-등장한-맥락", level: 2, text: "use() 훅이 등장한 맥락" },
			{ id: "기존-방식의-한계", level: 3, text: "기존 방식의 한계" },
			{ id: "use-훅-시그니처와-동작", level: 2, text: "use() 훅 시그니처와 동작" },
			{ id: "promise-vs-context-unwrap", level: 3, text: "Promise vs Context unwrap" },
			{ id: "마이그레이션-체크리스트", level: 2, text: "마이그레이션 체크리스트" }
		]
	},
	{
		slug: "typescript-strict-null-checks",
		contentMdx: `strictNullChecks는 활성화해두면 타입 시스템이 \`null\`·\`undefined\`를 명시적으로 분리해 추적한다.

## 보호되는 코드 경로

\`\`\`ts
function greet(name: string | null) {
  return name.toUpperCase();
}
\`\`\`

위 코드는 strict 모드에서 컴파일 실패한다. 가드가 필요한 이유를 설명한다.

## 실전 패턴

타입 가드 + exhaustive check + branded types를 결합하면 런타임 안전성을 극대화할 수 있다.`,
		toc: [
			{ id: "보호되는-코드-경로", level: 2, text: "보호되는 코드 경로" },
			{ id: "실전-패턴", level: 2, text: "실전 패턴" }
		]
	},
	{
		slug: "internal-devlog-sketch",
		contentMdx: `비공개 상태의 러프 메모. 배포되지 않아야 한다.

## 현재 고민 중인 것

- 시리즈 네비게이션 UX
- RSS 본문 포함 여부`,
		toc: [{ id: "현재-고민-중인-것", level: 2, text: "현재 고민 중인 것" }]
	}
];

/**
 * 더미 PostDetail 3건 — `postsFixture` 중 대표 케이스(시리즈·스탠드얼론·private) 선정.
 *
 * - `react-19-use-hook`: 시리즈 포스트 + thumbnail + 5개 TOC 항목(h2/h3 혼합)
 * - `typescript-strict-null-checks`: 스탠드얼론 + thumbnail 없음 + 짧은 TOC
 * - `internal-devlog-sketch`: private + 최소 TOC (1개)
 *
 * M1 UI에서 PostDetail 렌더 시 fallback 로직(details에 없으면 summary만으로 부분 렌더)이 필요하다.
 * M2에서 `getPostDetail(slug)`이 모든 slug에 대해 실 데이터를 반환하게 되면 이 fixture는 제거된다.
 */
export const postDetailsFixture: PostDetail[] = DETAIL_BODIES.map(({ slug, contentMdx, toc }) => ({
	...findSummary(slug),
	contentMdx,
	toc
}));
