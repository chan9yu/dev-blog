---
name: compound-engineering
description: "dev-blog의 태스크 실행 품질 보증 사이클. PLAN→EXECUTE→REVIEW(핑퐁 3회)→VALIDATE(1회 되돌림)→DOCUMENT→SYNTHESIZE 6단계를 강제해 인간 개입 없이 고품질 수렴을 보장한다. `blog-dev` 오케스트레이터가 태스크마다 자동 호출. '컴파운드 사이클', '핑퐁 리뷰', '태스크 품질 게이트' 같은 요청에도 트리거."
---

# Compound Engineering Cycle

하나의 태스크(태스크 ID 1개 또는 MDX 포스트 1편)의 생명주기를 **6단계 상태 기계**로 관리해 품질 수렴을 보장한다. `blog-dev` 오케스트레이터가 팀 구성 후 이 사이클을 반복한다.

## 6단계

```
PLAN → EXECUTE → REVIEW ↻(3회) → VALIDATE ↻(1회) → DOCUMENT → SYNTHESIZE
```

### 1. PLAN

- 대상 태스크의 TASKS.md·ROADMAP.md 항목 읽기
- 의존성 분석: 선행 태스크가 완료되었는가? 공유 타입/모듈은 어디?
- 필요 시 `prd-tech-validator` 에이전트에 설계 검증 요청 (아키텍처 변경·공개 API 변경일 때)
- **산출물**: `_workspace/plan_{task}_analysis.md` — 요구사항·의존성·변경 파일 후보·위험 요소

### 2. EXECUTE

트랙별 실행자:

| 트랙              | 개발자                                              | 병렬 역할                               |
| ----------------- | --------------------------------------------------- | --------------------------------------- |
| Feature (UI+로직) | nextjs-app-router-expert + nextjs-markup-specialist | nextjs-test-engineer가 테스트 병렬 작성 |
| Content (MDX)     | content-engineer                                    | — (검수는 REVIEW에서)                   |
| GC                | garbage-collector                                   | —                                       |
| Docs              | docs-generator                                      | —                                       |

- 개발자는 `src/` 또는 `_workspace/`에 산출물 작성
- **EXECUTE 완료 조건**: 빌드 통과 (`pnpm build`), 린트 통과 (`pnpm lint`)
- 산출물: `_workspace/execute_{task}_{role}.md` — 변경 요약

### 3. REVIEW (핑퐁 3회)

`compound-reviewer`가 주도, 필요 시 `react-nextjs-code-reviewer`·`seo-auditor`·`a11y-auditor`에 위임.

```
iter = 0, MAX = 3
loop:
  reviewer.review() → {PASS | FIX(items) | ESCALATE}
  if PASS: → VALIDATE
  if FIX:
    SendMessage(developer, "FIX: {items}")
    developer.fix()
    SendMessage(reviewer, "수정 완료")
    iter += 1
    if iter == MAX and still FIX: → ESCALATE
  if ESCALATE: → 사용자 보고, 사이클 중단
```

**ESCALATE 즉시 조건**: 보안 위반, 명백한 아키텍처 위반 (3 Laws).

### 4. VALIDATE (1회 되돌림)

`boundary-mismatch-qa`·`a11y-auditor`·`nextjs-test-engineer` 병렬 실행:

- qa: 경계면 교차 비교 (features/posts의 PostSummary 타입이 search/fixtures와 일치하는지 등)
- a11y: WCAG 2.1 AA 검수
- test: 테스트 실행 + 커버리지 확인

판정:

- PASS → DOCUMENT
- FIX (1회 한정) → EXECUTE로 복귀, 다시 REVIEW → VALIDATE. 2회째 FIX면 ESCALATE.

### 5. DOCUMENT

`docs-generator` 호출:

- `docs/TASKS.md`의 대응 ID 체크박스 업데이트
- `docs/CHANGELOG.md`에 항목 추가
- API/아키텍처 변경 시 `docs/PRD_TECHNICAL.md` MOD 테이블 갱신 **제안** (사용자 승인 후에만 수정)

### 6. SYNTHESIZE

- `_workspace/`의 모든 산출물 수집 → 요약 리포트
- 마일스톤 완료 여부 확인 → 완료 시 `milestone-gate` 호출, 통과 시 `garbage-collection` 자동 호출
- 팀원 해체 (TeamDelete) — orchestrator의 Phase 5에서 실행

## 콘텐츠 트랙 전용 조정

MDX 포스트 작성 시 REVIEW 단계 구성이 달라진다:

- **1차 리뷰**: seo-auditor (frontmatter·메타·slug)
- **2차 리뷰**: a11y-auditor (heading 계층·이미지 alt)
- **3차 리뷰**: react-nextjs-code-reviewer (코드블록 기술 정확성)
- 3명 모두 PASS 판정 시 REVIEW 종료. 1명이라도 FIX면 content-engineer가 수정 후 해당 리뷰어에게만 재검수.

## 산출물 경로 컨벤션

```
_workspace/
├── plan_{task}_analysis.md
├── execute_{task}_{role}.md
├── review_{task}_iter{N}.md      (N=1,2,3)
├── qa_{boundary}_report.md
├── test_{module}_report.md
├── content_{slug}_draft.md       (Content 트랙 전용)
└── synthesize_{task}_summary.md
```

## 에러 핸들링

| 상황                                 | 대응                                                                               |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| EXECUTE 빌드 실패                    | 개발자가 수정 후 재실행 (최대 2회), 3회 실패 시 ESCALATE                           |
| REVIEW 3회 FIX                       | ESCALATE: 잔존 이슈를 사용자에게 명시                                              |
| VALIDATE 2회 FIX                     | ESCALATE: 경계면 근본 문제 시사                                                    |
| 팀원 응답 지연                       | orchestrator가 `SendMessage("status?")` 1회 핑, 무응답 시 해당 Phase 건너뛰고 기록 |
| 외부 도구 실패 (context7, serena 등) | 폴백: 로컬 Read/Grep으로 대체, 결과 품질 저하를 리포트에 명시                      |

## 테스트 시나리오

**정상 흐름 (Feature 트랙, M0-06 `cn()` 유틸):**

```
PLAN: prd-tech-validator → "shared/utils에 위치, clsx+tailwind-merge 조합"
EXECUTE: nextjs-app-router-expert가 cn.ts 작성, nextjs-test-engineer가 cn.test.ts 병렬
REVIEW iter 1: compound-reviewer → PASS (간단한 유틸이므로 1회 통과)
VALIDATE: boundary-mismatch-qa → 사용처 경계 확인, nextjs-test-engineer → 테스트 통과
DOCUMENT: docs-generator → TASKS.md의 [M0-06] 체크, CHANGELOG 추가
SYNTHESIZE: 3분 완료, 다음 태스크로
```

**에러 흐름 (VALIDATE 실패):**

```
EXECUTE: features/search/services/search.ts 구현
REVIEW: PASS (내부 로직만 검토)
VALIDATE: qa → features/posts의 PostSummary와 search/types/SearchItem의 slug 필드명 불일치 발견
  → FIX: EXECUTE로 복귀 → 타입 통합 → 재 REVIEW → 재 VALIDATE → PASS
DOCUMENT: 정상 진행
```

## 기존 에이전트 호출 브릿지

기존 9개 에이전트(`nextjs-app-router-expert`, `nextjs-markup-specialist`, `boundary-mismatch-qa`, `a11y-auditor`, `nextjs-test-engineer`, `react-nextjs-code-reviewer`, `prd-writer`, `prd-tech-validator`, `prd-roadmap-architect`)는 **컴파운드 사이클 개념을 모른다**. 이들의 정의 파일에는 PLAN/EXECUTE/REVIEW Phase나 SendMessage 프로토콜이 없다.

오케스트레이터가 이들을 팀에 투입할 때는 Agent 호출 프롬프트 **첫 줄에** 다음 컨텍스트를 주입해 사이클에 편입시킨다:

```markdown
[컴파운드 사이클 컨텍스트]

- 현재 Phase: {PLAN | EXECUTE | REVIEW | VALIDATE | DOCUMENT}
- 대상 태스크: {M0-06 등 TASKS.md ID 또는 포스트 slug}
- 산출물 경로: {\_workspace/execute_M0-06_app-router-expert.md 등}
- 완료 후 액션: {SendMessage(to, body) 또는 파일 저장}
- 판정 형식: PASS | FIX(items) | ESCALATE (REVIEW·VALIDATE Phase만)
- 자율 범위: `.claude/rules/autonomy.md` 엄수 (git 작업·PRD 수정·아키텍처 변경은 사용자 확인 필수)

[원래 작업 요청]
... 여기에 실제 작업 내용 ...
```

**Why:** 기존 에이전트의 정의 파일을 수정하면 비-하네스 사용(직접 Agent 호출)이 깨진다. 대신 호출 시점에 컨텍스트 헤더를 주입해 **원래 전문성은 유지 + 사이클 규약은 준수**를 양립시킨다.

### 역할 매핑 (기존 에이전트 → 컴파운드 Phase)

| Phase                | 투입 에이전트                                              | 호출 시 헤더에 명시할 산출물 위치                                              |
| -------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------ |
| PLAN                 | `prd-tech-validator` (아키텍처 영향 태스크만)              | `_workspace/plan_{task}_analysis.md`                                           |
| EXECUTE (UI)         | `nextjs-markup-specialist`                                 | `src/**/*.tsx` + `_workspace/execute_{task}_markup.md`                         |
| EXECUTE (로직)       | `nextjs-app-router-expert`                                 | `src/**/*.ts` + `_workspace/execute_{task}_logic.md`                           |
| EXECUTE (테스트)     | `nextjs-test-engineer`                                     | `src/**/__tests__/*.test.ts` + `_workspace/test_{task}_report.md`              |
| REVIEW (1차)         | `compound-reviewer` (신규) — 핑퐁 운영                     | `_workspace/review_{task}_iter{N}.md`                                          |
| REVIEW (도메인 심층) | `react-nextjs-code-reviewer` (compound-reviewer가 위임 시) | iter 리포트에 병합                                                             |
| VALIDATE (경계)      | `boundary-mismatch-qa`                                     | `_workspace/qa_{boundary}_report.md`                                           |
| VALIDATE (a11y)      | `a11y-auditor`                                             | `_workspace/qa_{task}_a11y.md`                                                 |
| DOCUMENT             | `docs-generator` (신규)                                    | `docs/TASKS.md`, `docs/CHANGELOG.md` 수정 + `_workspace/docs_update_{date}.md` |

기존 에이전트들이 각자 정의한 "자체 승인 금지", "근본 원인 해결", "git 쓰기 금지" 규칙은 모두 `autonomy.md`/`workflow.md`와 정렬되어 있으므로 충돌 없음.

## 참고

- 실행 주체별 프로토콜: `.claude/agents/quality/compound-reviewer.md`
- 콘텐츠 트랙 디테일: `.claude/skills/content-writing/skill.md`
- 문서 동기화: `.claude/skills/task-completion/skill.md`
