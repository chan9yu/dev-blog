---
description: shadcn/ui 컴포넌트 커스터마이징 규칙
paths: ["src/shared/ui/**"]
---

# shadcn 컴포넌트 컨벤션

## 파일명

- PascalCase 사용 (예: `Badge.tsx`, `Card.tsx`)
- shadcn CLI는 kebab-case로 생성하므로, 추가 후 PascalCase로 리네이밍 필수
- `index.ts` 배럴 파일의 import 경로도 PascalCase와 일치시킬 것

## 단일 컴포넌트 패턴

- Props는 별도 type으로 선언
- `ComponentProps`는 `react`에서 직접 type import
- 하나의 named export function만 사용 (`export default` 금지)

```tsx
import type { ComponentProps } from "react";

type BadgeProps = ComponentProps<"span"> & { variant?: "default" | "secondary" };

export function Badge({ className, variant = "default", ...rest }: BadgeProps) {
	return <span {...rest} />;
}
```

## 복합(Compound) 컴포넌트 패턴

- `Object.assign`으로 서브컴포넌트를 루트에 병합
- 서브컴포넌트 함수명에 부모 prefix 필수 (예: `CardHeader`, `CardTitle`)
- 각 서브컴포넌트도 Props type 별도 선언

```tsx
type CardRootProps = ComponentProps<"div">;

function CardRoot({ className, ...props }: CardRootProps) { ... }

type CardHeaderProps = ComponentProps<"div">;

function CardHeader({ className, ...props }: CardHeaderProps) { ... }

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
});
```

호출자는 점 네임스페이스로 사용:

```tsx
import { Card } from "@/shared/ui/Card";

<Card>
	<Card.Header>...</Card.Header>
</Card>;
```

## CVA (class-variance-authority)

- variant가 있는 컴포넌트는 CVA 사용
- `cva()` 반환값은 컴포넌트 파일 내부에서만 사용 (외부 export 금지)
- Props에 `VariantProps<typeof xxxVariants>` 교차 타입 적용

## import 규칙

- 배럴 파일(index.ts) 사용 금지 — 직접 경로로 import (`from "@/shared/ui/Badge"`)
- 외부에서 Props 접근 시 `ComponentProps<typeof Badge>` 사용

## shadcn add 후 후처리 절차 (필수)

shadcn CLI가 생성한 컴포넌트는 표준 패턴(`import * as React from "react"`, `React.ComponentProps<typeof X>`, 다수 named export)을 사용한다. 이는 위 룰과 충돌하므로 **추가 직후 다음 절차로 반드시 정리**한다:

1. **파일명 PascalCase 리네이밍** — `sheet.tsx` → `Sheet.tsx`
2. **React 네임스페이스 import 제거**:
   - `import * as React from "react"` → `import type { ComponentProps } from "react"` (또는 필요한 named import만)
   - `React.ComponentProps<typeof X>` → `ComponentProps<typeof X>`
   - 다른 React API(`React.useState` 등)도 named import로 분리
3. **인라인 type 분리** — Props는 별도 `type` 선언 (위 "단일 컴포넌트 패턴" 섹션)
4. **Compound 패턴 적용** — 서브컴포넌트가 있는 primitive(Sheet, Dialog, DropdownMenu, Tooltip, Accordion 등):
   - 개별 함수는 `XxxRoot`, `XxxTrigger`, `XxxContent` 등 부모 prefix 유지
   - 다수 named export 대신 `export const Xxx = Object.assign(XxxRoot, { Trigger: XxxTrigger, ... })` 단일 export
   - 호출자는 `<Xxx>`, `<Xxx.Trigger>`, `<Xxx.Content>` 점 네임스페이스 사용
5. **arbitrary Tailwind 유틸 canonical 교체** — shadcn 원본은 `ring-[3px]`·`top-[50%]`·`translate-x-[-50%]`·`min-w-[8rem]` 같은 arbitrary value를 즐겨 사용. `.claude/rules/styling.md`의 `suggestCanonicalClasses` 금지 원칙에 위배되므로 **반드시 canonical 유틸로 치환** (예: `ring-2`·`top-1/2`·`-translate-x-1/2`·`min-w-32`). 예외: `max-w-[calc(...)]`처럼 calc 표현식은 `styling.md`의 1회성 허용 범주.
6. `pnpm build`로 타입 검증

회고:

- **M0-13 Sheet** 도입 시 표준 그대로 둠 → 사용자 직접 리뷰에서 지적 → 절차 1~4로 명문화.
- **M1-61 shadcn 5종(Dialog·DropdownMenu·Badge·Accordion·Sonner)** 추가 시 arbitrary value(`ring-[3px]`·`top-[50%]`·`min-w-[8rem]` 등)를 놓침 → 사용자 VSCode Tailwind 경고로 지적 → 본 5번 단계 추가. 이 단계는 `styling.md`와 `shadcn.md`의 교차 지점이므로 shadcn add 직후 필수 체크포인트로 고정.

룰 cleanup 작업이므로 `review-discipline.md` "예외" 적용 (REVIEW 에이전트 면제, 빌드 검증만).
