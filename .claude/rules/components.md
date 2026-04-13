---
description: React 컴포넌트 작성 규칙
paths: ["src/**/*.tsx"]
---

# 컴포넌트 컨벤션

- Props는 별도 type으로 선언 (인라인 타입 금지)
- 파일당 하나의 컴포넌트만 export (Props 미노출, 외부에서 필요 시 `ComponentProps<typeof C>`로 추론)
  - **예외**: shadcn-wrapped 컴포넌트는 Props type을 external consume 가능 — `.claude/rules/shadcn.md` "import 규칙" 절 참조
- 단, 타입 모듈(`types/index.ts`)처럼 해당 파일이 직접 정의를 포함하는 경우는 허용
- 복합 컴포넌트: `Object.assign` 패턴 — 서브 함수/타입에 부모 prefix 필수
- `"use client"`: hooks/browser API/이벤트 핸들러 직접 사용 시에만
- 무거운 클라이언트 컴포넌트는 `next/dynamic`으로 지연 로딩
- shadcn/ui 컴포넌트 상세 규칙: `.claude/rules/shadcn.md` 참조
