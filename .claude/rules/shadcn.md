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

## CVA (class-variance-authority)

- variant가 있는 컴포넌트는 CVA 사용
- `cva()` 반환값은 컴포넌트 파일 내부에서만 사용 (외부 export 금지)
- Props에 `VariantProps<typeof xxxVariants>` 교차 타입 적용

## import 규칙

- 배럴 파일(index.ts) 사용 금지 — 직접 경로로 import (`from "@/shared/ui/Badge"`)
- 외부에서 Props 접근 시 `ComponentProps<typeof Badge>` 사용
