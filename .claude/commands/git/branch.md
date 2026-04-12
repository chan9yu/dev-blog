---
description: 새 브랜치를 생성하고 전환해주세요.
---

새 브랜치를 생성하고 전환해주세요:

## 절차

1. `git status`로 현재 작업 상태 확인 (uncommitted 변경사항 체크)
2. `git branch -a`로 기존 브랜치 목록 확인 (중복 방지)
3. 변경사항이 있으면 사용자에게 커밋/스태시 여부 확인
4. 사용자가 지정한 이름으로 브랜치 생성, 미지정 시 아래 규칙으로 제안
5. `git checkout -b <브랜치명>` 실행

## 브랜치 네이밍 규칙

- 형식: `<타입>/<간단한-설명>`
- 소문자 영어, 하이픈(`-`)으로 단어 구분
- 50자 이내 권장

### 타입

| 타입     | 설명             | 예시                           |
| -------- | ---------------- | ------------------------------ |
| feat     | 새로운 기능 개발 | `feat/reading-detail-page`     |
| fix      | 버그 수정        | `fix/card-image-fallback`      |
| refactor | 코드 리팩토링    | `refactor/notion-client-cache` |
| style    | UI/스타일링 변경 | `style/dark-mode-redesign`     |
| chore    | 설정/의존성 변경 | `chore/eslint-config-update`   |
| docs     | 문서 작업        | `docs/prd-v2`                  |
| test     | 테스트 추가/수정 | `test/e2e-filter-flow`         |

## 주의사항

- main 브랜치에서 분기하는 것을 기본으로 한다
- 브랜치 생성 전 `git fetch origin`으로 원격 상태를 동기화한다
- 이미 존재하는 브랜치명은 사용하지 않는다
