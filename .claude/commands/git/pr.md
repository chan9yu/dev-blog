---
description: 현재 브랜치의 변경사항으로 Pull Request를 생성해주세요.
---

현재 브랜치의 변경사항으로 Pull Request를 생성해주세요:

## 절차

1. `git status`로 uncommitted 변경사항 확인 (있으면 커밋 먼저 권유)
2. **base 브랜치 확인**: 마일스톤 완료 PR은 **`develop`**, 프로덕션 릴리스는 **`main`**
3. `git log develop..HEAD --oneline`으로 PR에 포함될 커밋 목록 확인
4. `git diff develop...HEAD --stat`으로 변경 파일 요약 확인
5. 현재 브랜치가 원격에 푸시되었는지 확인, 미푸시 시 `git push -u origin <브랜치>` 실행
6. PR 제목과 본문 작성
7. `gh pr create --base develop` 명령으로 PR 생성 (마일스톤 PR 기준)
8. 생성된 PR URL 출력

## PR 제목 규칙

- 커밋 메시지와 동일한 형식: `<타입>: <제목>`
- 한국어로 작성, 70자 이내
- 여러 커밋이 포함된 경우 전체 변경의 목적을 요약
- **마일스톤 완료 PR**: `feat: M{n} {마일스톤명} 완료` (예: `feat: M0 Foundation 완료`)

## PR 본문 템플릿

```markdown
## 변경 사항

- 주요 변경 내용을 bullet point로 정리

## 관련 문서

- PRD Product: `docs/PRD_PRODUCT.md` 기능 ID (예: FEAT-\*, US-\*)
- PRD Technical: `docs/PRD_TECHNICAL.md` 모듈 ID (예: MOD-\*, RT-\*, ADR-\*)
- ROADMAP: `docs/ROADMAP.md` 마일스톤/태스크 (예: M0-01, M1-05)
- TASKS: `docs/TASKS.md` 체크박스 진행 상태

## 테스트

- [ ] `pnpm type:check` 통과
- [ ] `pnpm lint` 통과
- [ ] `pnpm build` 성공
- [ ] 개발 서버에서 동작 확인
```

## 주의사항

- **base 브랜치는 `develop`을 기본으로 한다** (`main`은 프로덕션 릴리스 전용)
- PR 생성 전 `pnpm build && pnpm lint`를 실행하여 CI 실패를 사전 방지한다
- 마일스톤 PR은 `milestone-gate` 스킬 PASS 판정 후에만 생성
- 커밋이 없는 브랜치로는 PR을 생성하지 않는다
- draft PR이 필요하면 `--draft` 플래그를 사용한다
- `main`에 직접 PR을 생성해야 하는 경우(릴리스) 반드시 `--base main`을 명시하고 사용자 재확인
