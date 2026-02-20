# Create PR

현재 브랜치의 변경사항으로 Pull Request를 생성한다.

## 절차

1. `git log main..HEAD --oneline`으로 커밋 이력 확인
2. `git diff main...HEAD`로 전체 변경사항 파악
3. PR 제목과 본문 작성
4. `gh pr create`로 PR 생성

## 브랜치 컨벤션

```
{type}/{description}
```

- `feat/` - 새 기능
- `fix/` - 버그 수정
- `refactor/` - 리팩토링
- `chore/` - 설정/빌드
- `docs/` - 문서

예: `feat/timeline-page`, `fix/search-filter`

## PR 형식

```markdown
## Summary

- 변경사항 1~3줄 요약

## Changes

- 주요 변경 항목 나열

## Test Plan

- [ ] 검증 항목
```

## 규칙

- PR 제목은 70자 이내
- base 브랜치는 `main`
- push 전 `pnpm lint && pnpm type:check && pnpm format:check` 확인
