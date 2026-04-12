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
- 배럴 파일(index.ts): leaf 디렉토리에서만 re-export용으로 허용. 중간 레벨 배럴은 금지
  - `@/shared/modules/storage` (leaf → 허용)
  - `@/shared/modules` (중간 → 금지)
- 레이어 간 의존성(`app → features → shared` 단방향, feature cross-import 금지 등): `.claude/rules/project-structure.md` 의 **3 Laws** 참조
