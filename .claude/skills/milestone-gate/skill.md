---
name: milestone-gate
description: "마일스톤 Exit 기준 자동 검증 스킬. 마일스톤 내 모든 태스크가 완료되었을 때 orchestrator가 자동 호출하거나, 사용자가 '`M0 게이트 확인`', '`M1 완료 검증`' 요청 시 트리거. TASKS.md·ROADMAP.md의 Exit 조건을 파싱하고 빌드·테스트·Playwright를 실행해 마일스톤 통과 여부를 판정."
---

# Milestone Gate

M0~M7 각 마일스톤의 Exit 조건을 자동 검증. `blog-dev` 오케스트레이터가 마일스톤 내 모든 태스크 `[x]` 달성 시 자동 호출.

## 마일스톤별 Exit 기준

### M0: Foundation

**문자 기준**: "`pnpm dev`에서 모든 RT-\* 14종이 404 없이 빈 페이지 렌더"

**자동 검증:**

1. 개발 서버 기동: `pnpm dev --port 3100` (background)
2. playwright MCP로 14개 라우트 순회:
   - `/`, `/posts`, `/posts/[mock-slug]`, `/tags`, `/tags/[mock-tag]`
   - `/series`, `/series/[mock-slug]`, `/about`
   - `/rss`, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/og?title=test`, `/api/views`
3. 각 응답 상태 코드 200 확인 (또는 RSS 같이 text/xml 200)

### M1: UI Skeleton — All Pages

**문자 기준**: "더미 데이터 기준 모든 FEAT-\* UI 통과, 네비게이션으로 UX 흐름 완결"

**자동 검증:**

1. `pnpm build` 성공
2. Playwright로 주요 네비게이션 흐름:
   - 홈 → 포스트 목록 → 포스트 상세 → 태그 클릭 → 태그 상세
   - 헤더 검색 트리거 → 모달 오픈 → 결과 렌더
   - 테마 토글 → light/dark 전환 확인
3. 각 페이지 스크린샷 캡처 → `_workspace/m1_screenshots/`

### M2~M7

ROADMAP.md의 각 마일스톤 섹션에서 "Exit" 항목을 파싱해 동적으로 검증 로직 생성.
ROADMAP 형식이 표준화된 Exit 체크리스트를 갖는지 먼저 확인, 없으면 `AskUserQuestion`으로 기준 확인.

## 입력

- 대상 마일스톤: `M0`, `M1`, ...
- (선택) 범위 제한: 특정 RT-\* 또는 FEAT-\* 재검증

## 출력

`_workspace/milestone_{m}_gate_{date}.md`:

```markdown
# Milestone Gate: M0 — 2026-04-13

## Exit 기준

- RT-\* 14종 404 없이 렌더

## 검증 결과

| RT               | 경로         | 상태 | 응답 |
| ---------------- | ------------ | ---- | ---- |
| RT-/             | /            | ✅   | 200  |
| RT-/posts        | /posts       | ✅   | 200  |
| RT-/posts/[slug] | /posts/dummy | ❌   | 404  |

...

## 판정

FAIL — 1건 미통과 (RT-/posts/[slug])

## 후속 조치

- features/posts/services/getPost.ts의 더미 데이터 fallback 누락 검토
```

**판정 3단계:**

- **PASS**: 모든 Exit 기준 통과 → orchestrator에 마일스톤 완료 보고 → `garbage-collection` 자동 호출
- **FAIL**: 미통과 항목 존재 → 해당 태스크를 `[ ]`로 되돌리고 후속 조치 제안
- **WARN**: 통과했으나 관찰된 품질 이슈 (예: 렌더 시간 느림) — 마일스톤은 통과, 개선 태스크 신규 제안

## 검증 절차 (공통)

### 1. 전제 조건 확인

- 해당 마일스톤의 모든 TASKS 체크박스가 `[x]`인지 확인
- 미완료 태스크 있으면 즉시 FAIL (`[ ]` 잔존 목록 보고)

### 2. 빌드 검증

- `pnpm install --frozen-lockfile` (lockfile 정합성)
- `pnpm build` (타입체크 포함)
- `pnpm lint`
- 실패 로그는 `_workspace/milestone_{m}_build_log.txt`

### 3. 런타임 검증 (Playwright MCP)

- dev 서버 기동 (M0) 또는 프로덕션 빌드 기동 (M1+)
- 라우트별 방문 + 상태코드 + 스크린샷
- 콘솔 에러/워닝 수집 (`mcp__playwright__browser_console_messages`)

### 4. 테스트 커버리지 (M2+)

- `pnpm test` (Vitest, 설치 후)
- 커버리지 리포트 요약

### 5. 리포트 생성 & 판정

## 에러 처리

| 상황                      | 대응                                             |
| ------------------------- | ------------------------------------------------ |
| 개발 서버 기동 실패       | 즉시 FAIL, 로그 첨부                             |
| Playwright MCP 호출 실패  | 재시도 1회, 지속 시 해당 검증은 "SKIP" 표기      |
| 마일스톤 Exit 기준이 모호 | `AskUserQuestion`으로 세부 기준 확인             |
| 신규 규칙이 실패 유발     | 규칙 최근 변경 이력 확인 후 사용자에게 롤백 질의 |

## PASS 후 자동 액션

1. `garbage-collection` 자동 호출 (해당 마일스톤 범위)
2. GC 통과 시 → **마일스톤 PR 생성 제안** (AskUserQuestion):

   ```
   "M{n} 완료! 다음 절차를 실행할까요?

   ┌── 1. 최종 커밋 (미커밋 변경 있을 시)
   │     git commit -m 'feat(M{n}-nn): ...' — 사용자 확인 후
   │
   ├── 2. 원격 푸시
   │     git push -u origin feature/M{n}-{슬러그}
   │
   └── 3. PR 생성
         gh pr create --base develop \
                      --head feature/M{n}-{슬러그} \
                      --title 'feat: M{n} {마일스톤명} 완료'"
   ```

   **사용자 명시 승인 후에만 실행** (workflow.md 커밋/PR 절대 금지 규칙).

3. `docs/CHANGELOG.md`에 `## [{milestone}]` 섹션 추가 제안
4. PR 머지 후 다음 마일스톤 첫 태스크 진입 시, `blog-dev` Phase 0에서 새 `feature/M{n+1}-*` 브랜치 생성 절차 트리거

## 트리거 예시

- "M0 완료 검증" → 자동 실행
- orchestrator 내부 호출: 모든 M0 태스크 `[x]` 달성 감지 → 자동 호출
- "M1 게이트 확인" → M1 검증
- "다음 마일스톤 가능해?" → 직전 마일스톤 게이트 재확인

## 참고

- 마일스톤 정의: `docs/ROADMAP.md`, `docs/TASKS.md`
- 후속 스킬: `garbage-collection`
