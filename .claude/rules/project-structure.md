---
description: 3-Layer Architecture — 레이어 규칙, 디렉토리 구조, 협업 패턴
paths: ["src/**"]
---

# 3-Layer Architecture (Next.js App Router)

## 1. 핵심 원칙 (The 3 Laws)

```
┌──────────────────────────────────────────────────────────┐
│ Law 1.  의존성은 단방향이다:    app → features → shared   │
│ Law 2.  shared는 features를 모른다 (역방향 import 금지)   │
│ Law 3.  feature는 다른 feature를 모른다 (수평 import 금지)│
└──────────────────────────────────────────────────────────┘
```

### 각 법칙의 근거

| 법칙  | 왜 필요한가                                                                     | 위반 시 증상                                                 |
| ----- | ------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Law 1 | 그래프를 DAG로 유지 → 빌드 순서·테스트 격리·모듈 삭제 가능성 확보               | 순환 의존, 빌드 타임 증가, "A를 고치면 B가 터진다"           |
| Law 2 | shared는 어느 feature가 호출할지 모름. 특정 feature 지식이 들어가면 범용성 상실 | `shared/utils/formatVideoTitle` 같은 이름 등장 → 도메인 누수 |
| Law 3 | feature의 삭제·이동·격리 테스트 가능성 보장                                     | "A feature 때문에 B feature가 컴파일 안 됨"                  |

> 레이어 규칙의 본질은 **삭제 가능성(deletability)** 이다. `rm -rf features/note/`를 해도 나머지 앱이 컴파일되는가? 이 질문이 아키텍처 건강도의 리트머스다. "features는 서로를 모른다"는 규칙은 팀 토폴로지/코드 소유권/점진적 monorepo 이관까지 염두에 둔 설계다.

---

## 2. 표준 디렉토리 구조

```
src/
├── app/                          ← Next.js App Router + 조립
│   ├── layout.tsx
│   ├── providers.tsx             ← 전역 Provider 조립 (Theme, Lightbox 등)
│   ├── (public)/                 ← 라우트 그룹: 공개 페이지
│   ├── (protected)/              ← 라우트 그룹: 인증 필요
│   │   └── layout.tsx            ← AuthGuard는 여기서 features/auth에서 import
│   └── [domain]/
│       └── [id]/
│           ├── page.tsx
│           └── XxxComposition.tsx  ← 멀티 feature 조립 전용 컴포넌트
│
├── features/                     ← 도메인 슬라이스 (이름 = 비즈니스 케이퍼빌리티)
│   └── [feature]/
│       ├── components/           ← UI (React)
│       │   ├── index.ts          ← Public API (barrel)
│       │   └── __tests__/
│       ├── hooks/                ← 커스텀 훅 (useXxx)
│       ├── services/             ← 순수 함수 (콘텐츠 파싱, KV 호출, 비즈니스 로직)
│       ├── schemas/              ← Zod 등 런타임 스키마 (선택)
│       ├── types/                ← 도메인 타입 (공유 가능한 것만)
│       ├── constants/
│       ├── utils/                ← feature 전용 유틸 (validators 등)
│       └── config/               ← feature 설정값
│
└── shared/                       ← 도메인 불가지론 레이어
    ├── components/               ← 범용 UI + 레이아웃. 4개 서브 디렉토리로 완전 분류 (루트 직하에 tsx 금지)
    │   ├── common/               ← 공통 UI 원자 (NavLink, SocialLinks, ScrollReset, ScrollToTopButton, FadeInWhenVisible, PageTransition)
    │   ├── layouts/              ← 구조적 컴포넌트 (Header, Footer, Container, Sidebar, MobileMenu)
    │   ├── mdx/                  ← MDX 렌더 전용 (CustomMDX, MdxHeading, MdxLink, MdxPre 등)
    │   └── ui/                   ← shadcn primitive (Radix wrapper, `shadcn.md` 후처리 5번 대상)
    ├── hooks/                    ← 도메인 무관한 훅 (useDebounce 등)
    ├── utils/                    ← 순수 유틸 (formatDate, clamp 등)
    ├── libs/                     ← 외부 라이브러리 얇은 래퍼
    ├── config/                   ← 환경 설정, 상수
    ├── styles/                   ← globals.css, 디자인 토큰
    ├── test/                     ← 테스트 헬퍼, MSW 핸들러
    └── modules/                  ← 자체 완결 미니 라이브러리
        └── [module]/
            ├── README.md         ← 필수 (공개 API 문서)
            ├── index.ts          ← Public API (leaf barrel)
            ├── types.ts
            ├── XxxPort.ts        ← 인터페이스 (선택)
            ├── Xxx.ts            ← 구현
            └── __tests__/
```

### 현 프로젝트 feature 목록

- `posts` — 포스트 (목록, 상세, TOC, 관련 포스트, 리딩 보조)
- `tags` — 태그 (허브, 상세, 칩, 트렌딩)
- `series` — 시리즈 (허브, 상세, 네비게이션)
- `search` — 검색 (모달, Fuse.js 인덱스, ⌘K 단축키)
- `views` — 조회수 (Vercel KV, `/api/views`)
- `comments` — 댓글 (Giscus iframe, 지연 마운트)
- `theme` — 테마 (light/dark, View Transitions)
- `lightbox` — 이미지 라이트박스 (MDX 이미지 연동)
- `about` — 소개 (`contents/about/index.md` 렌더)

---

## 3. 명명 규칙

| 대상           | 규칙                                              | 예시                              |
| -------------- | ------------------------------------------------- | --------------------------------- |
| 컴포넌트 파일  | PascalCase                                        | `UserProfile.tsx`                 |
| hook/util 파일 | camelCase                                         | `useDebounce.ts`, `formatDate.ts` |
| 디렉토리       | kebab-case 또는 camelCase                         | `video-player/`, `components/`    |
| 배럴 파일      | `index.ts`만                                      | —                                 |
| 금지 패턴      | `_components/`, `private/` 같은 underscore prefix | —                                 |

> shadcn/ui 컴포넌트 파일 네이밍 및 Compound 패턴은 `.claude/rules/shadcn.md` 참조.

---

## 4. 레이어별 책임 명세

### 4.1 `app/` — 조립과 라우팅

**책임**

- Next.js 라우트 정의 (`page.tsx`, `layout.tsx`)
- 전역 Provider 조립 (`providers.tsx`)
- 여러 feature를 합치는 Composition 컴포넌트 (예: `VideoDetailWithNotes.tsx`)

**금지**

- 비즈니스 로직 직접 구현
- shared 성격의 유틸 함수 작성 → `shared/`로 이동

**`app/` 내부 컴포넌트 허용 조건** (전부 만족해야 함)

1. 파일명이 조립 의도를 드러냄 (`XxxWithYyy.tsx`, `XxxLayout.tsx`)
2. 2개 이상의 feature를 import
3. 해당 라우트에서만 사용됨 (재사용 없음)

> **회고 (2026-04-15)**: `src/app/HomeHero.tsx`가 3요건 중 **2번(feature 2+ import) 미충족** 상태로 배치되어 있다가 사용자 지적으로 `src/features/about/components/HomeHero.tsx`로 이동. 홈 페이지의 "저자 intro 섹션"은 `about` feature 도메인. **`app/`에 신규 tsx를 추가할 때는 이 체크리스트를 통과시키고, 통과 못 하면 `features/<domain>/components/`로 내려라**.

#### Provider 관리 규약 (3-tier progressive)

Provider 개수에 따라 구조를 점진적으로 확장한다. Next.js 공식 패턴(Context Provider를 Client Component로 만들고 `layout`에서 감싸기) + 3 Laws 정렬.

**1-tier — Provider 1개 (현재 M0)**

```
src/app/
├─ layout.tsx          ← <Providers> 호출
└─ providers.tsx       ← 엔트리 + 구현 동거 (ThemeProvider 직접 조립)
```

단일 파일로 조립·구현이 모두 들어간다. 과한 추상화 회피 (YAGNI).

**2~3-tier — Provider 2개 이상 (M3+)**

```
src/app/
└─ providers.tsx       ← 조립 지점(얇게, Provider를 감싸는 JSX만)

src/features/
├─ theme/components/ThemeWrapper.tsx
└─ lightbox/components/LightboxProvider.tsx
```

**전환 트리거**: Provider가 **2개 이상**이 되는 순간 엔트리(조립)와 구현을 분리. 각 Provider 구현은 다음 규칙으로 배치:

- **feature 도메인이 있는 Provider** (`LightboxProvider`·`ThemeSwitcher` 등 UI/상태가 해당 feature에 종속) → `features/<domain>/components/`에 위치
- **도메인 중립 Provider** (토스트·쿼리 클라이언트 등, 현재 프로젝트엔 없음) → `shared/providers/`에 신규 폴더 생성
- `app/providers.tsx`는 각 Provider를 **import + 중첩**만 수행 (비즈니스 로직 금지)

**금지 패턴**

- `shared/providers/`를 Provider 1~2개 시점에 선행 생성 (과한 추상화)
- `app/providers.tsx` 안에서 state/effect/ref 직접 선언 (구현 누수 — features/shared로 이동)
- feature 간 Provider cross-reference (Law 3 위반 — `app/providers.tsx`가 중재)

**구역 전용 Provider** (옵션): 특정 route group에만 필요하면 `app/(group)/providers.tsx`에 격리. 전역에 올리지 않는다.

### 4.2 `features/` — 도메인 슬라이스

**Feature 식별 기준 (Bounded Context)**

- "이 기능만 분리해서 별도 앱으로 만들 수 있는가?"
- "이것을 지우면 다른 기능은 멀쩡한가?"
- 비즈니스가 이해하는 이름인가? (`auth`, `billing`, `search` ⭕ / `utils`, `helpers` ❌)

**Public API 예시**

```ts
// features/[feature]/components/index.ts
export { FeatureMainComponent } from "./FeatureMainComponent";
export { FeatureSubComponent } from "./FeatureSubComponent";
// 내부 전용 컴포넌트는 export 하지 않음

// features/[feature]/hooks/index.ts
export { useFeatureState } from "./useFeatureState";

// features/[feature]/services/index.ts
export { getAllItems, getItemDetail } from "./getItems";
```

**feature 내부 import 규칙**

- 같은 feature 내부 → 상대 경로 (`./`, `../`)
- 다른 레이어 → 절대 경로 (`@/shared/...`)
- **다른 feature → import 금지** (Law 3)

---

### 배럴 파일(index.ts) 정책 — 서버/클라이언트 경계 고려

Next.js App Router에서 `"use client"`는 **파일 경계**에서 작동한다. 배럴이 `"use client"` 파일을 re-export하면 그 배럴을 import하는 RSC 파일이 **다른 export까지 클라이언트 모듈 그래프에 포함**시킬 위험이 있다. Turbopack(Next.js 16 기본)은 tree shaking이 공격적이라 실제 미사용 export를 제거하지만, 이는 **번들러 구현 디테일이지 공식 보장이 아니다**.

#### 배럴 허용/금지 매트릭스

| 위치                                         | 배럴         | 근거                                                                                                                                                                                                                                       |
| -------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `features/<f>/index.ts`                      | ✅ 유지      | Public API 경계. RSC·Client 혼재하지만 **Turbopack tree shake + feature 외부 호출자 편의성** 트레이드오프로 허용. M2에서 코드량 급증 시 split barrel(`index.ts` + `client.ts`)로 전환 검토                                                 |
| `features/<f>/components/index.ts`           | ✅ 유지      | feature 내부 편의. 외부에서 직접 접근하지 않음 (`features/<f>/index.ts`가 게이트)                                                                                                                                                          |
| `features/<f>/services/index.ts`             | ✅ 유지      | **100% 서버 전용 순수 함수** — 클라이언트 오염 위험 없음                                                                                                                                                                                   |
| `shared/types/index.ts`                      | ✅ 유지      | 타입 전용 — 컴파일 타임만, 런타임 번들 영향 없음                                                                                                                                                                                           |
| `shared/fixtures/index.ts`                   | ✅ 유지      | 서버 전용 데이터 — SSG 빌드 타임 소비, 클라이언트 번들 미포함                                                                                                                                                                              |
| `shared/components/{common,layouts,mdx,ui}/` | ❌ 생성 금지 | **서버 컴포넌트(Container, PostCard 등)와 클라이언트 컴포넌트(Header, MobileMenu 등)가 혼재**. 배럴 생성 시 RSC에서 Container만 import해도 Header의 `"use client"` 모듈이 그래프에 포함될 수 있다. **직접 경로 import가 유일한 안전 보장** |
| `shared/{hooks,utils,config}/`               | ❌ 생성 금지 | 파일 수 적음(1~3개) + 직접 경로로 충분. 불필요한 간접 계층                                                                                                                                                                                 |

#### features 배럴 혼재 인지 규칙

`features/<f>/index.ts`가 서버/클라이언트를 혼재 re-export하는 것은 **현 단계(M1) Turbopack 의존 트레이드오프로 허용**한다. 단:

1. **배럴 파일 자체에 `"use client"` 금지** — 배럴에 directive를 넣으면 모든 re-export가 클라이언트 엔트리가 됨
2. **서비스(services/) re-export는 반드시 별도 줄로 분리** — 시각적으로 서버/클라이언트 경계를 드러냄:
   ```ts
   // features/posts/index.ts
   // Components (서버·클라이언트 혼재 — Turbopack tree shake 의존)
   export { PostCard, PostList, ... } from "./components";
   // Services (100% 서버 전용)
   export { getPublicPosts, getAdjacentPosts, ... } from "./services";
   // Types (컴파일 타임 전용)
   export type { PostSummary, ... } from "@/shared/types";
   ```
3. **M2 전환 트리거**: feature 배럴의 export 수가 **20개를 초과**하거나, 클라이언트 번들에 서버 전용 코드가 포함되는 것이 `next build --debug`로 확인되면 → split barrel(`index.ts` 서버 + `client.ts` 클라이언트)로 분리

#### 회고 (2026-04-15)

- M1 단계에서 `shared/components/` 하위에 배럴을 만들려다 **서버/클라이언트 혼재** 문제 인지 → 생성하지 않기로 결정.
- `features/<f>/index.ts`는 Turbopack 의존 트레이드오프로 유지하되 split 전환 트리거(export 20+)를 명시.
- **배럴 정책을 하나의 문서로 집중** 관리하여 `typescript.md`, `project-structure.md`, `shadcn.md` 간 불일치 방지.

---

### 4.3 `shared/` — 도메인 불가지론

두 가지 하위 분류:

| 구분           | 경로                                   | 예시                                       | 특징                                |
| -------------- | -------------------------------------- | ------------------------------------------ | ----------------------------------- |
| 경량 유틸      | `shared/{components,hooks,utils,libs}` | `Button`, `useDebounce`, `formatDate`      | 단일 파일, 단순 export              |
| 자체 완결 모듈 | `shared/modules/[module]/`             | `form`, `toast`, `storage`, `video-player` | README 필수, Port 제공, 테스트 포함 |

**모듈(module) 승격 기준** — 다음 중 하나라도 해당하면 `shared/modules/`로:

- 상태를 가짐 (Context, 클래스 인스턴스)
- 여러 파일로 분해됨
- 공개 API와 내부 구현을 분리하고 싶음
- 프레임워크 독립(React 없이 동작)으로 설계됨

> `shared/modules/`는 사실상 in-repo npm package. 언제든 `packages/*`로 이동해 monorepo로 전환 가능하도록 설계 (README, leaf barrel, tests, Port 인터페이스 전부 이를 위한 준비). Port 패턴(`VideoPlayerPort`)은 Hexagonal Architecture의 핵심 — 계약을 고정하면 구현 교체 시 소비자(features)는 영향 없음.

---

## 5. Feature 간 협업 패턴 (cross-import 금지 해결법)

"feature A가 feature B의 데이터를 필요로 한다"는 매우 흔한 요구다. 다음 패턴 중 하나를 사용.

### 패턴 1: Composition via Slot (`app` 레이어에서 조립) — 가장 빈도 높음

feature는 `children` 또는 slot prop을 노출.

```tsx
// features/video/components/VideoDetail.tsx
type VideoDetailProps = {
	videoId: number;
	children?: ReactNode; // ← slot
};

// app/videos/[id]/VideoDetailWithNotes.tsx (조립)
import { VideoDetail } from "@/features/video/components";
import { NoteSection } from "@/features/note/components";

<VideoDetail videoId={id}>
	<NoteSection videoId={id} />
</VideoDetail>;
```

### 패턴 2: Ref Broker (`app`이 공유 상태를 중개)

두 feature가 실시간 통신할 때, `app`이 상태를 보유하고 ref/callback을 주입.

```tsx
// app/xxx/Composition.tsx
const currentTimeRef = useRef(0);
const seekRef = useRef<(t: number) => void>(null);

<VideoPlayer currentTimeRef={currentTimeRef} seekRef={seekRef} />
<NotePanel
  currentTimeRef={currentTimeRef}
  onSeek={(t) => seekRef.current?.(t)}
/>;
```

### 패턴 3: 공통 타입 공유는 shared로 승격

두 feature가 같은 타입을 참조해야 한다면 그 타입은 도메인 공통 개념.

```ts
// ❌ feature/order가 feature/product에서 import
import type { Product } from "@/features/product/types";

// ✅ shared/types로 승격
import type { Product } from "@/shared/types/product";
```

단, **도메인 타입 누수 위험**. 대안은 feature 별 자체 타입(`OrderLineItem`)을 정의해 **중복 허용**.

### 패턴 4: 이벤트 버스 / Pub-Sub (매우 제한적)

`shared/modules/event-bus` 같은 중립 인프라를 두고 feature끼리 이벤트로만 통신. **남용 주의** — 암묵적 결합을 만듦.

### 결정 매트릭스

| 상황                              | 추천 패턴                          |
| --------------------------------- | ---------------------------------- |
| "A 안에 B를 렌더링"               | 패턴 1 (Slot)                      |
| "A의 상태 변경을 B가 실시간 관찰" | 패턴 2 (Ref Broker) 또는 4         |
| "같은 엔티티 타입 공유"           | 패턴 3 (신중히)                    |
| "A 액션 후 B 트리거"              | `app/` 페이지/액션 핸들러에서 조립 |

---

## 6. Import 경로 규칙

```ts
// ✅ 같은 feature 내부 — 상대 경로
import { VideoControls } from "./VideoControls";
import type { Video } from "../types";

// ✅ 다른 레이어 — 절대 경로 (@/*)
import { Button } from "@/shared/components";
import { useToast } from "@/shared/modules/toast";

// ✅ app에서 features 호출
import { LoginForm } from "@/features/auth/components";

// ❌ features끼리 (Law 3 위반)
import { useAuth } from "@/features/auth/hooks";

// ❌ shared에서 features (Law 2 위반)
import type { Note } from "@/features/note/types";

// ❌ 중간 배럴
import { useToast } from "@/shared/modules";
// ✅ leaf 배럴만
import { useToast } from "@/shared/modules/toast";
```

**tsconfig.json**

```json
{
	"compilerOptions": {
		"baseUrl": ".",
		"paths": { "@/*": ["./src/*"] }
	}
}
```

> Import 순서(external → internal → relative) 등 언어 차원 규칙은 `.claude/rules/typescript.md` 참조.

---

## 7. ESLint 자동 강제 (권장)

문서로만 관리하면 시간이 지나며 무너진다. `eslint-plugin-boundaries` 또는 `no-restricted-imports`로 기계화.

### 옵션 A: `eslint-plugin-boundaries` (권장)

```bash
pnpm add -D eslint-plugin-boundaries
```

```js
// eslint.config.mjs
import boundaries from "eslint-plugin-boundaries";

export default [
	{
		plugins: { boundaries },
		settings: {
			"boundaries/elements": [
				{ type: "app", pattern: "src/app/**" },
				{ type: "feature", pattern: "src/features/*", mode: "folder", capture: ["name"] },
				{ type: "shared", pattern: "src/shared/**" }
			]
		},
		rules: {
			"boundaries/element-types": [
				"error",
				{
					default: "disallow",
					rules: [
						{ from: "app", allow: ["app", "feature", "shared"] },
						{ from: "feature", allow: ["shared", ["feature", { name: "${from.name}" }]] },
						{ from: "shared", allow: ["shared"] }
					]
				}
			]
		}
	}
];
```

### 옵션 B: `no-restricted-imports` (zero-dependency)

```js
{
  files: ["src/shared/**"],
  rules: {
    "no-restricted-imports": ["error", {
      patterns: [{
        group: ["@/features/*"],
        message: "shared는 features를 참조할 수 없습니다 (Law 2)",
      }],
    }],
  },
},
{
  files: ["src/features/*/**"],
  rules: {
    "no-restricted-imports": ["error", {
      patterns: [{
        group: ["@/features/*"],
        message: "feature 간 cross-import 금지. app 레이어에서 조립하세요 (Law 3)",
      }],
    }],
  },
},
```

> `no-restricted-imports`는 "같은 feature 내부 import"까지 차단하므로 feature별 override 또는 `eslint-plugin-boundaries`의 `${from.name}` capture가 필요. CI는 `--max-warnings=0` + `eslint --cache` 추천. **문서 + 코드 리뷰 + ESLint 3중 방어선**이 이상적.

---

## 8. 데이터 접근 레이어 (`services/`)

이 프로젝트는 **SSG-first**다 (PRD G-1). 콘텐츠 페이지는 빌드 타임에 RSC가 `services/`의 순수 함수를 직접 호출해 정적 생성된다. **TanStack Query·SWR 같은 클라이언트 캐시 레이어는 도입하지 않는다** — 런타임 서버 상태가 사실상 존재하지 않기 때문 (`/api/views` 단 하나 예외).

```
features/[feature]/
├── services/          ← 순수 함수 (MDX 파싱, KV 호출, fetch)
│   └── getXxx.ts      ← (args) => Promise<Xxx>
├── schemas/           ← Zod 스키마 (선택)
└── components/        ← RSC는 services 직접 호출, Client는 hooks 경유
```

```ts
// features/posts/services/getAllPosts.ts — 빌드 타임 콘텐츠 파싱
import { parseFrontmatter } from "./_internal/parseFrontmatter";

export async function getAllPosts(options?: { includePrivate?: boolean }): Promise<PostSummary[]> {
	// contents/posts/**/index.mdx를 읽어 PostSummary로 정규화, date desc
}

// app/posts/page.tsx — RSC에서 직접 호출
import { getAllPosts } from "@/features/posts";

export default async function PostsPage() {
	const posts = await getAllPosts();
	return <PostList posts={posts} />;
}
```

### 런타임 데이터 — 얇게 유지

유일한 런타임 API는 `/api/views` (Vercel KV 조회수). `fetch()` 직접 호출로 충분하며, 실패 시 조용히 `0` 또는 `"—"` fallback. 재시도·캐시·dedup 같은 고급 기능이 필요해지기 전까지 라이브러리를 추가하지 않는다.

```ts
// features/views/services/kv-client.ts
export async function getPostViews(slug: string): Promise<number> {
	const res = await fetch(`/api/views?slug=${encodeURIComponent(slug)}`);
	if (!res.ok) return 0;
	const { views } = (await res.json()) as { views: number };
	return views ?? 0;
}
```

**원칙**

- `services/`는 프레임워크 독립 — Node.js 스크립트·RSC·Client Component 어디서든 재사용
- Client에서 상태/로딩이 필요하면 같은 feature `hooks/`에 `useXxx` 훅을 만들어 `services` 함수를 감싼다 (캐시 라이브러리 없이 `useState` + `useEffect` 또는 `useSyncExternalStore`로 충분)
- 서버 상태 캐시가 절실해지면 그때 TanStack Query·SWR 도입을 ADR로 결정 (현재는 YAGNI)

---

## 9. 안티 패턴 레퍼런스

| 안티 패턴                                  | 왜 나쁜가                               | 올바른 방식                         |
| ------------------------------------------ | --------------------------------------- | ----------------------------------- |
| `shared/utils/formatUserName.ts`           | 도메인 누수 (User 지식이 shared에 침투) | `features/user/utils/`              |
| `features/auth/components/OrderCard.tsx`   | feature 범위 오염                       | `features/order/components/`로 이동 |
| `features/a/hooks/ → @/features/b/`        | Law 3 위반                              | `app/`에서 composition              |
| `@/shared/modules` (중간 배럴)             | tree-shaking 방해, API 경계 모호        | `@/shared/modules/toast` (leaf)     |
| `app/utils/formatDate.ts`                  | `app`은 유틸 정의 장소 아님             | `shared/utils/`                     |
| `features/a/types`를 `features/b`가 import | Law 3 위반                              | 타입 중복 또는 shared 승격          |
| feature 내부에 `page.tsx`                  | Next.js 라우팅 책임 누수                | `page.tsx`는 반드시 `app/`에        |
| `_components/` 같은 underscore 디렉토리    | 표준 네이밍 위반                        | `components/`                       |

---

## 10. 부트스트랩 체크리스트

- [ ] `src/{app,features,shared}` 3개 폴더 존재
- [ ] `tsconfig.json`에 `"@/*": ["./src/*"]` 추가
- [ ] `eslint-plugin-boundaries` 설치 및 경계 룰 설정
- [ ] `shared/modules/<module>/README.md` 템플릿 작성
- [ ] 신규 feature 생성 시 `{components,hooks,services,types}` 구조 기본 채택, feature 루트 `index.ts` Public API barrel 작성
- [ ] `app/providers.tsx`에 Theme / Lightbox 등 필요한 Provider 조립
- [ ] 조립 컴포넌트는 `app/<route>/XxxWithYyy.tsx` 네이밍 컨벤션
- [ ] PR 템플릿에 "레이어 규칙 준수 여부" 체크박스
- [ ] CI: `eslint` + 타입체크 필수

---

## 11. 모듈 문서화 규약

`src/shared/modules/<module>/` 하위 모듈은 반드시 `README.md`를 포함한다. 필수 항목:

- **What** — 이 모듈이 해결하는 문제 한 줄
- **Public API** — `index.ts`에서 export 되는 식별자 목록과 시그니처
- **Usage** — 최소 실행 가능 예시
- **Configuration** — 주입 가능한 의존성 / 환경 변수
- **Port (선택)** — 교체 가능한 인터페이스 계약
- **Non-goals** — 의도적으로 지원하지 않는 것

---

## 12. 현 프로젝트에서의 적용 근거

본 프로젝트(chan9yu 개발 블로그)는 9개 feature(`posts`·`tags`·`series`·`search`·`views`·`comments`·`theme`·`lightbox`·`about`)를 가지며, 각 feature의 삭제·교체가 독립적으로 가능해야 하므로 Feature-First Architecture의 적용 대상이다.

일반적으로 이 아키텍처가 **불필요**한 경우:

- 페이지 5개 미만의 단순 프로젝트 → `src/components`, `src/lib`만으로 충분
- feature가 2개 이하이고 상호 결합이 본질적 → route-colocation 중심 구조가 낫다

> 이 설계는 **FSD(Feature-Sliced Design)의 간소화 버전**이다. 필요해지면 `widgets`/`entities` 레이어만 추가하는 점진적 확장이 가능하다.
