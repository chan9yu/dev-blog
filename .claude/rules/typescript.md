---
description: TypeScript 및 Import/Export 규칙
paths: ["src/**/*.ts", "src/**/*.tsx"]
---

# TypeScript 컨벤션

- strict mode 필수
- 리턴 타입 자동 추론 가능하면 명시 금지 (함수, 메서드 모두)
- 인터페이스에 `I` prefix 금지 (`IStorageAdapter` → `StorageAdapterPort` 또는 `StorageAdapter`)
- `@deprecated` 표시된 API 사용 지양, 최신 지원 API로 대체
- Non-null assertion (`!`) 사용 금지 — 타입 가드, props 전달 등으로 타입을 좁힐 것

## Import/Export

- Named exports 우선 (프레임워크 요구사항 예외: page.tsx, layout.tsx 등)
- Import 순서: external → internal (`@/*`) → relative (`./`, `../`)
- 모듈 간 import: `@/*` 절대 경로 (예: `@/shared/components/Button`)
- 같은 feature 내부: `./`, `../` 상대 경로
- 배럴 파일(index.ts): **서버/클라이언트 경계를 고려한 정책** (상세: `project-structure.md` §배럴 정책)
  - leaf 디렉토리에서만 re-export용으로 허용. 중간 레벨 배럴은 금지
  - `@/shared/modules/storage` (leaf → 허용)
  - `@/shared/modules` (중간 → 금지)
  - **서버/클라이언트 혼재 배럴 주의**: `"use client"` 컴포넌트와 서버 전용 코드를 같은 배럴에서 re-export하면 클라이언트 모듈 그래프가 오염될 수 있다. Turbopack이 tree shake하지만 번들러 보장이 아닌 구현 디테일. 상세 정책은 `project-structure.md` 참조.
- 레이어 간 의존성(`app → features → shared` 단방향, feature cross-import 금지 등): `.claude/rules/project-structure.md` 의 **3 Laws** 참조
