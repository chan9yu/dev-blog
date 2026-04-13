---
description: 아이콘 사용 규칙 — lucide-react 단일화 + 커스텀 브랜드 SVG
---

# 아이콘 규약

## 기본 원칙

**모든 UI 아이콘은 `lucide-react`로 통일한다.** 다른 아이콘 라이브러리(`react-icons`, `heroicons`, `material-icons`, `@radix-ui/react-icons` 등) 도입 금지 — 번들 크기 증가와 시각적 통일성 저해.

## lucide-react 사용 패턴

```tsx
import { Search, Moon, Sun, Menu, Calendar, Clock } from "lucide-react";

<Search className="size-4" aria-hidden />
<Moon className="size-5 text-text-secondary" aria-hidden />
<button aria-label="검색 열기">
  <Search className="size-5" aria-hidden />
</button>
```

- **Import**: named import만 사용 (tree-shaking). default import 금지.
- **크기**: Tailwind `size-N` 유틸 우선. `width`/`height` prop은 지양.
- **색상**: `text-*` 유틸로 `currentColor` 상속. 컴포넌트 외부에서 색 제어.
- **접근성**:
  - 장식용(텍스트 옆에 보조 표시) → `aria-hidden`
  - 단독으로 의미를 갖는 아이콘 버튼 → 부모 `button`에 `aria-label` 필수
  - 링크 내 아이콘만 있는 경우도 마찬가지로 `aria-label` 필수

## 커스텀 SVG (lucide-react 미포함)

### 대상

- `lucide-react`에 **없는 브랜드 마크** (예: X.com 로고, Threads, Substack, 프로젝트 고유 로고)
- lucide에 유사 아이콘이 있어도 **공식 브랜드 가이드를 엄격히 따라야 하는 경우**

### 파일 경로

```
src/shared/assets/icons/
├── x.svg          (X.com 브랜드)
├── threads.svg
└── brand-logo.svg
```

- 파일명: kebab-case + `.svg`.
- 원본 SVG 최적화:
  - `fill="currentColor"` 로 색상 위임 (브랜드 가이드상 고정색 요구 시 예외).
  - 루트 `<svg>`의 `width`/`height` 속성 제거 (컴포넌트에서 `className`으로 제어).
  - 불필요한 `xmlns`·주석·메타데이터 제거 (`svgo` 같은 툴 권장).
- **라이선스 확인**: 브랜드 마크는 공식 브랜드 가이드 준수. 색상 변조 금지 조항 주의.

### Next.js 컴포넌트 import 설정 (지연 도입)

SVG를 React 컴포넌트로 import하려면 `next.config.ts`에 `@svgr/webpack` 로더 추가 필요.

> **M0 단계에서는 설정하지 않는다.** 실제 첫 커스텀 SVG가 추가되는 시점(Footer 소셜 링크 구현 등)에 도입한다. YAGNI 준수.

설정 예시 (미리 적용 금지, 참조용):

```ts
// next.config.ts
const nextConfig: NextConfig = {
	// ...
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: ["@svgr/webpack"]
		});
		return config;
	}
};
```

설정 + `@svgr/webpack` devDependency 설치 후 사용:

```tsx
import XIcon from "@/shared/assets/icons/x.svg";

<XIcon className="text-text-primary size-5" aria-hidden />;
```

TypeScript 타입: `src/next-env.d.ts` 또는 별도 `svg.d.ts`에 모듈 선언 추가 필요.

## 선호 순서 (의사결정 트리)

1. **lucide-react에 해당 아이콘이 존재**하는가? → **lucide 우선 사용**
2. 없거나 브랜드 마크(서비스 로고)인가? → `src/shared/assets/icons/` 에 공식 SVG 배치
3. 모호한 경우(예: "이메일" 아이콘 선택) → lucide의 일반 아이콘(`Mail`)로 대체

## 현 프로젝트 주요 사용 지점

| 지점        | 아이콘                                                                |
| ----------- | --------------------------------------------------------------------- |
| Header 네비 | `Search`, `Menu`, `Moon`, `Sun`                                       |
| Footer 소셜 | `Github`, `Linkedin`, `Mail`, `Rss` + `x.svg` (커스텀, lucide 미포함) |
| Post 메타   | `Calendar`, `Clock`, `Eye`, `Tag`                                     |
| Post 네비   | `ChevronLeft`, `ChevronRight`, `ArrowUp`, `ArrowLeft`                 |
| 코드블록    | `Copy`, `Check`                                                       |
| 검색 모달   | `Search`, `X`, `Command`                                              |
| 공유        | `Share2`, `Link`                                                      |

## 금지 사항

- 다른 아이콘 라이브러리 병용 금지.
- 인라인 `<svg>` 장황 마크업 금지 — 재사용 대상은 반드시 파일 분리.
- lucide 아이콘을 SVG 원본으로 복사해 `assets/icons/`에 두는 행위 금지 (라이브러리 사용 원칙 위반).
