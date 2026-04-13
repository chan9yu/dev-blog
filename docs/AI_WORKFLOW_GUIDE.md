# AI 워크플로우 가이드

chan9yu 개발 블로그의 Claude Code 멀티 에이전트 하네스가 **어떻게 동작하는지** 단계별로 추적한 문서. 사용자가 `"M0-06 진행해줘"`라고 입력한 순간부터 커밋 직전까지의 내부 이벤트를 시간순으로 재현한다.

---

## 1. 하네스 개요

### 목적

사용자가 **자연어 한 줄**(태스크 ID·마일스톤·기능명·포스트 주제)만 입력하면, 내부에서 전문 에이전트 팀이 자동으로 구성되어 **PLAN → EXECUTE → REVIEW(핑퐁 3회) → VALIDATE(1회 되돌림) → DOCUMENT → SYNTHESIZE** 6단계 품질 사이클을 돌린다. 1인 저자 블로그의 반복 작업을 제거하면서도 **자체 승인 금지·근본 원인 해결·git 쓰기 금지** 원칙을 엄수한다.

> **REVIEW 단계 생략 금지** — EXECUTE 직후 DOCUMENT로 직행하는 회귀를 차단하기 위해 `.claude/rules/review-discipline.md`가 트리거·3-way 병렬 호출 절차·self-check·penalty를 명문화한다. 회고 사례: M0-01~06, M0-09~15에서 REVIEW 누락 → 사후 리뷰에서 13+개 이슈 발견 → 본 룰로 차단.

### 4개 트랙

사용자 요청은 자동으로 4개 트랙 중 하나로 분류된다.

| 트랙        | 트리거 예시                                                 | 주력 팀                                                                                                           |
| ----------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Feature** | `M0-01 진행해줘`, `검색 기능 만들어줘`, `M1 Week 진행`      | nextjs-app-router-expert, nextjs-markup-specialist, compound-reviewer, boundary-mismatch-qa, nextjs-test-engineer |
| **Content** | `React 19 use 훅 포스트 작성`, `이 MDX 교정해줘`            | content-engineer, seo-auditor, a11y-auditor, react-nextjs-code-reviewer                                           |
| **GC**      | `GC`, `청소해줘`, `Week 0 GC`, `하네스 평가`                | garbage-collector                                                                                                 |
| **Docs**    | `TASKS 업데이트`, `ROADMAP 진행률 맞춰줘`, `CHANGELOG 추가` | docs-generator                                                                                                    |

---

## 2. 전체 아키텍처

### 구성 자산

```
.claude/
├── agents/              15개 에이전트 (9 기존 + 6 신규)
│   ├── orchestration/   blog-dev-orchestrator (총괄)
│   ├── developer/       nextjs-app-router-expert, nextjs-markup-specialist
│   ├── planning/        prd-writer, prd-roadmap-architect, prd-tech-validator
│   ├── quality/         react-nextjs-code-reviewer, boundary-mismatch-qa,
│   │                    nextjs-test-engineer, a11y-auditor,
│   │                    compound-reviewer, garbage-collector
│   ├── content/         content-engineer, seo-auditor
│   └── documentation/   docs-generator
│
├── skills/              12개 스킬 (6 기존 + 6 신규)
│   ├── 오케스트레이션:  blog-dev, compound-engineering, milestone-gate
│   ├── 도메인 작업:     content-writing, task-completion, garbage-collection
│   └── 참조 지식:       nextjs-best-practices, vercel-react-best-practices,
│                        frontend-fundamentals, frontend-design,
│                        tailwind-4, typescript-expert
│
├── rules/               15개 규칙 (a11y, autonomy, components, icons, mdx-content, project-structure, react, review-discipline, seo, shadcn, styling, testing, theme, typescript, workflow)
│   ├── 아키텍처:        project-structure, components, react, typescript
│   ├── 스타일·테마:     styling, tailwind, theme, shadcn
│   ├── 품질:            a11y, testing, workflow
│   └── 하네스 신규:     mdx-content, seo, autonomy
│
├── commands/            9개 슬래시 커맨드 (수동 단일 작업용)
│   ├── git/             commit, branch, pr, merge
│   ├── test/            run, e2e, coverage
│   ├── review/          quality
│   └── docs/            update-roadmap
│
├── hooks/               2개 훅 (지연 린팅 자동화)
│   ├── mark-lint-needed.sh    (Edit/Write 시 플래그 생성)
│   └── post-stop-lint.sh      (Stop 시 누적 lint 1회 실행)
│
└── settings.json        MCP 권한·hooks 연결
```

### 3-Layer 실행 구조

```
┌─────────────────────────────────────────┐
│  Layer 1: 진입점 (Entry Point)          │
│  ─────────────────────────────────────  │
│  "M0-06 진행해줘" (자연어)              │
│       ↓                                  │
│  blog-dev 스킬 트리거                   │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  Layer 2: 오케스트레이션                │
│  ─────────────────────────────────────  │
│  blog-dev-orchestrator 에이전트         │
│  - Phase 1: 트랙 분류                   │
│  - Phase 2: TeamCreate                  │
│  - Phase 3: compound-engineering 사이클 │
│  - Phase 4: 결과 통합                   │
│  - Phase 5: 정리 & 마일스톤 게이트      │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  Layer 3: 실행자 (Team Members)         │
│  ─────────────────────────────────────  │
│  전문 에이전트 2~5명이                  │
│  TaskCreate + SendMessage로 자체 조율   │
│  산출물은 _workspace/에 축적            │
└─────────────────────────────────────────┘
```

### MCP 서버 활용

| MCP                 | 활용 시점                                           |
| ------------------- | --------------------------------------------------- |
| context7            | React 19·Next.js 16·Tailwind 4 최신 API 실시간 조회 |
| serena              | 심볼 기반 리팩토링·참조 추적                        |
| shadcn              | `src/shared/components/ui/` 컴포넌트 추가           |
| playwright          | `milestone-gate` 자동 검증, E2E                     |
| sequential-thinking | 아키텍처·복잡한 디버깅 단계 분해                    |

---

## 3. 사용법 — 트리거 예시

하네스는 **사용자가 평소처럼 말만 하면** 동작한다. 특별한 슬래시 커맨드가 필요 없다.

| 사용자 입력                   | 자동 동작                                    |
| ----------------------------- | -------------------------------------------- |
| `M0-06 진행해줘`              | Feature 트랙 → 팀 소집 → 6단계 사이클        |
| `M0 마일스톤 작업 다 해줘`    | M0 내 모든 미완료 태스크 순차 실행           |
| `검색 기능 만들어줘`          | Feature 트랙 (`features/search` 도메인 작업) |
| `React 19 use 훅 포스트 초안` | Content 트랙 (OUTLINE 질의부터 시작)         |
| `이 포스트 교정해줘`          | Content 트랙 교정 모드                       |
| `Week 0 GC 실행`              | GC 트랙 (5단계 정화 + 하네스 평가)           |
| `TASKS 체크 상태 맞춰줘`      | Docs 트랙                                    |
| `M0 게이트 확인`              | milestone-gate 스킬 (Playwright 검증)        |

Should-NOT 트리거 (하네스 안 돎):

- `Next.js 공식 문서 찾아줘` → context7 MCP 직접
- `이 타입 에러만 고쳐` → typescript-expert 스킬
- `현재 커밋 로그 보여줘` → git log

---

## 4. 심층 시나리오 — `"M0-06 진행해줘"`

> 이 시나리오는 **가장 짧은 Feature 트랙 예시**다. M0-06은 `cn()` 유틸리티 (clsx + tailwind-merge)이며, 단일 파일 + 테스트로 완결된다. 실제 런타임에서 벌어지는 모든 이벤트를 시간순으로 추적한다.

### Step 0 — 초기 상태

```
User state:
- 현재 브랜치: develop
- TASKS.md: [M0-06]이 [ ] 미착수
- 기존 파일: src/shared/utils/ 비어있음
```

### Step 1 — 자연어 입력 & 스킬 트리거

```
[User → Claude Code]
"M0-06 진행해줘"

[Runtime]
→ Claude Code가 모든 스킬의 description을 스캔
→ blog-dev 스킬의 description에 "M0-01 진행해줘" 같은 트리거 패턴 매칭
→ blog-dev 스킬 자동 활성화
```

내부 매칭 근거: `blog-dev/skill.md`의 description에 명시된 `M\d-\d+` 패턴.

### Step 2 — Phase 1: 입력 분석 (Input Analysis)

```
[blog-dev 스킬 실행]

1. 패턴 매칭: "M0-06" → M\d-\d+ 매칭 → Feature 트랙 확정
2. docs/TASKS.md 읽기 → [M0-06] 라인 발견:
   "[ ] [M0-06] `cn()` 유틸리티 (`clsx` + `tailwind-merge`)"
3. docs/ROADMAP.md에서 M0-06 상세 확인:
   - 파일 경로: src/shared/utils/cn.ts
   - 의존: clsx, tailwind-merge
   - 검증 기준: 반환 타입 string, 중복 클래스 병합
4. docs/PRD_TECHNICAL.md에서 관련 MOD-* 확인
   → MOD-shared-utils 의 cn() 항목
```

산출물: `_workspace/plan_M0-06_analysis.md` 생성 준비.

### Step 3 — Phase 2: 팀 구성 (Team Composition)

```
[결정]
태스크 유형: 유틸리티 (shared)
→ 팀 구성표 참조: blog-dev/references/project-context.md
→ "유틸리티 (shared)" 조합: nextjs-app-router-expert + compound-reviewer + nextjs-test-engineer

[TeamCreate 호출]
TeamCreate(
  team_name="blog-dev-20260413-1530-feature",
  members=[
    { name: "nextjs-app-router-expert", role: "executor" },
    { name: "compound-reviewer", role: "reviewer" },
    { name: "nextjs-test-engineer", role: "tester" }
  ]
)

[TaskCreate 호출]
TaskCreate(subject="M0-06 cn() 구현", owner="nextjs-app-router-expert")
TaskCreate(subject="M0-06 cn() 테스트 작성", owner="nextjs-test-engineer")
TaskCreate(subject="M0-06 리뷰", owner="compound-reviewer", blockedBy=[위 2개])
```

### Step 4 — Phase 3a: PLAN

유틸리티는 간단하므로 **prd-tech-validator 호출은 생략** (블로그-dev 의사결정 힌트).

```
[nextjs-app-router-expert 에이전트에게 Agent 호출]

Agent({
  model: "opus",
  subagent_type: "general-purpose",
  prompt: `
    [컴파운드 사이클 컨텍스트]

    - 현재 Phase: PLAN
    - 대상 태스크: M0-06
    - 산출물 경로: _workspace/plan_M0-06_analysis.md
    - 완료 후 액션: SendMessage(orchestrator, "plan ready")
    - 판정 형식: N/A (PLAN은 산출물만 생성)
    - 자율 범위: .claude/rules/autonomy.md 엄수

    [원래 작업 요청]
    M0-06 `cn()` 유틸리티 설계 분석을 작성하세요.
    - 위치: src/shared/utils/cn.ts
    - 의존성: clsx, tailwind-merge (package.json 확인 필요)
    - 타입 시그니처: (...inputs: ClassValue[]) => string
    - .claude/rules/project-structure.md의 shared 규약 준수
  `
})
```

에이전트는 `_workspace/plan_M0-06_analysis.md` 작성:

```markdown
# Plan: M0-06 cn() 유틸리티

## 요구사항

- 입력: ClassValue (clsx 표준)
- 출력: 중복 제거된 Tailwind 클래스 문자열
- 파일: src/shared/utils/cn.ts

## 의존성 확인 필요

- package.json에 clsx, tailwind-merge 존재? → 확인 결과: 둘 다 미설치
- **사용자 확인 필요** (autonomy.md: 의존성 추가는 확인 범주)

## 변경 파일 후보

- src/shared/utils/cn.ts (신규)
- src/shared/utils/**tests**/cn.test.ts (신규)
- package.json (의존성 추가 — 사용자 승인 필수)

## 위험 요소

- clsx/tailwind-merge 버전 선택 (Tailwind 4 호환성 확인 필요)
```

**중요 이벤트**: 의존성 미설치 발견 → `autonomy.md` 규칙 발동 → 사용자 확인 필수.

### Step 5 — 중간 질의 (자율 범위 위반 방지)

```
[blog-dev-orchestrator가 사용자에게 AskUserQuestion]

Q: "M0-06 cn() 유틸리티 구현에 clsx와 tailwind-merge가 필요합니다. package.json에 없어서 추가해야 합니다. 진행할까요?"
Options:
1. 네, 둘 다 추가 (Recommended) — pnpm add clsx tailwind-merge
2. 직접 설치하겠다 — 사용자가 설치 후 "계속"
3. 다른 라이브러리 제안 — clsx 대신 classnames

[사용자 응답: 1번 선택]

[orchestrator 실행]
Bash: pnpm add clsx tailwind-merge
```

### Step 6 — Phase 3b: EXECUTE (병렬)

```
[두 에이전트 병렬 호출]

Agent A: nextjs-app-router-expert (실제 구현)
Agent B: nextjs-test-engineer (테스트 병렬 작성)
```

**Agent A 산출물** (`src/shared/utils/cn.ts`):

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
```

**Agent B 산출물** (`src/shared/utils/__tests__/cn.test.ts`):

```typescript
import { describe, it, expect } from "vitest";
import { cn } from "../cn";

describe("cn", () => {
	it("단일 클래스 문자열을 그대로 반환한다", () => {
		expect(cn("px-4")).toBe("px-4");
	});

	it("여러 클래스를 공백으로 연결한다", () => {
		expect(cn("px-4", "py-2")).toBe("px-4 py-2");
	});

	it("조건부 클래스를 처리한다", () => {
		expect(cn("px-4", { "py-2": true, "bg-red-500": false })).toBe("px-4 py-2");
	});

	it("충돌하는 Tailwind 유틸리티는 후자로 병합한다", () => {
		expect(cn("px-4", "px-6")).toBe("px-6");
	});

	it("배열 입력을 지원한다", () => {
		expect(cn(["px-4", "py-2"], "bg-white")).toBe("px-4 py-2 bg-white");
	});
});
```

**병렬 SendMessage**:

```
Agent A → orchestrator: SendMessage("EXECUTE done: src/shared/utils/cn.ts")
Agent B → orchestrator: SendMessage("TEST done: __tests__/cn.test.ts, 5 cases")

[EXECUTE 완료 조건 확인]
orchestrator: Bash("pnpm build") → 성공 (3.2s)
orchestrator: Bash("pnpm lint") → 0 errors
→ EXECUTE Phase 통과
```

산출물 저장: `_workspace/execute_M0-06_logic.md`, `_workspace/test_M0-06_report.md`.

### Step 7 — Phase 3c: REVIEW (핑퐁)

```
[compound-reviewer 에이전트 호출]

Agent({
  model: "opus",
  prompt: `
    [컴파운드 사이클 컨텍스트]
    - 현재 Phase: REVIEW (iter 1/3)
    - 대상 태스크: M0-06
    - 산출물 경로: _workspace/review_M0-06_iter1.md
    - 판정 형식: PASS | FIX(items) | ESCALATE

    [리뷰 대상]
    - src/shared/utils/cn.ts
    - src/shared/utils/__tests__/cn.test.ts

    [체크리스트]
    - .claude/rules/ 15개 규칙 위반 여부
    - 특히 typescript.md (any 금지), components.md, testing.md
  `
})
```

**리뷰 iter 1 결과** (`_workspace/review_M0-06_iter1.md`):

```markdown
# Review: M0-06 — Iteration 1/3

## 판정

FIX

## FIX 항목

1. [MINOR] testing.md 규약 — cn.test.ts:4
   - 현상: describe 설명이 영어 "cn"
   - 수정: 한국어 "cn() 유틸리티" (프로젝트 테스팅 규약)

2. [MINOR] 코드블록 주석 부재 — cn.ts:4
   - 제안: JSDoc 추가 — "clsx + tailwind-merge 조합으로 Tailwind 유틸리티 충돌을 병합"
   - 단, workflow.md의 "주석 최소화" 원칙과 상충 — 생략해도 무방

## 결론

CRITICAL/MAJOR는 없음. 그러나 testing 규약은 정정 권장 → FIX 판정.
```

```
[compound-reviewer → nextjs-test-engineer]
SendMessage("FIX: describe('cn') → describe('cn() 유틸리티')")

[nextjs-test-engineer 수정]
Edit: describe("cn") → describe("cn() 유틸리티")

[nextjs-test-engineer → compound-reviewer]
SendMessage("수정 완료")

[compound-reviewer 재검수 — iter 2]
→ PASS
```

iter 2 리포트: `_workspace/review_M0-06_iter2.md` (PASS).

### Step 8 — Phase 3d: VALIDATE

```
[병렬 검증]

Agent 1: boundary-mismatch-qa
  프롬프트: "cn() 유틸의 공개 API가 앞으로 소비할 features에서 호환 가능한가?"
  결과: PASS — 타입 시그니처가 범용적, 경계면 문제 없음

Agent 2: nextjs-test-engineer
  프롬프트: "pnpm test 실행, cn.test.ts 5개 케이스 통과 확인"
  결과: FAIL — 프로젝트에 Vitest 미설치 (M2에서 도입 예정)
  대응: WARN으로 등급 변경 — 테스트 파일 존재 + 코드 리뷰 통과로 대체

[판정]
전체 VALIDATE: PASS (WARN 1건: Vitest 미도입)
```

산출물: `_workspace/qa_M0-06_boundary.md`, `_workspace/qa_M0-06_test.md`.

### Step 9 — Phase 3e: DOCUMENT

```
[docs-generator 에이전트 호출]

Agent({
  model: "opus",
  prompt: `
    [task-completion 스킬 실행]
    - task_id: M0-06
    - category: Added
    - summary: "clsx + tailwind-merge 조합 유틸"
    - changed_files: [src/shared/utils/cn.ts, src/shared/utils/__tests__/cn.test.ts]
  `
})
```

**docs-generator가 수정하는 파일**:

1. `docs/TASKS.md`:

   ```diff
   - - [ ] [M0-06] `cn()` 유틸리티 (`clsx` + `tailwind-merge`)
   + - [x] [M0-06] `cn()` 유틸리티 (`clsx` + `tailwind-merge`)
   ```

2. `docs/CHANGELOG.md` (없으면 Keep a Changelog 템플릿으로 신규 생성):

   ```markdown
   ## [Unreleased]

   ### Added

   - [M0-06] clsx + tailwind-merge 조합 유틸 (`src/shared/utils/cn.ts`)
   ```

3. `_workspace/docs_update_2026-04-13.md` — 변경 요약 리포트.

### Step 10 — Phase 3f: SYNTHESIZE

```
[_workspace/ 산출물 수집]

_workspace/
├── plan_M0-06_analysis.md
├── execute_M0-06_logic.md
├── execute_M0-06_test.md
├── review_M0-06_iter1.md
├── review_M0-06_iter2.md
├── qa_M0-06_boundary.md
├── qa_M0-06_test.md
├── docs_update_2026-04-13.md
└── synthesize_M0-06_summary.md  ← 신규 생성

[synthesize_M0-06_summary.md 내용]
- REVIEW 반복: 2회 (iter 1 FIX → iter 2 PASS)
- VALIDATE: PASS (WARN 1건: Vitest 미설치)
- 총 소요: ~8분
- 변경 파일: cn.ts, cn.test.ts, TASKS.md, CHANGELOG.md, package.json
```

### Step 11 — Phase 4: 결과 통합 & 사용자 보고

```markdown
## 🎯 작업 완료 — Feature 트랙

### 완료 태스크

- [M0-06] `cn()` 유틸리티 — `src/shared/utils/cn.ts`

### 사이클 통계

- REVIEW 반복: 2회 (iter 1 FIX → iter 2 PASS)
- VALIDATE FIX: 0회
- 총 소요 시간: ~8분

### 검증 결과

- ✅ `pnpm build` (3.2s)
- ✅ `pnpm lint` (0 errors)
- ⚠️ 테스트 미설치 (M2에서 Vitest 도입 예정) — 테스트 파일은 작성 완료

### 변경 파일

- src/shared/utils/cn.ts (신규, 6줄)
- src/shared/utils/**tests**/cn.test.ts (신규, 28줄)
- package.json (clsx, tailwind-merge 추가)
- docs/TASKS.md ([M0-06] [x] 체크)
- docs/CHANGELOG.md (신규 생성, Added 항목)

### 후속 조치

- 다음 추천 태스크: M0-07 (Pretendard Variable 폰트 설정)

### 산출물 (감사 추적용)

- `_workspace/plan_M0-06_analysis.md` 외 8개 파일 보존
```

### Step 12 — Phase 5: 정리

```
[마일스톤 완료 감지]
M0 태스크 33개 중 1개 완료 ([M0-06]) → M0 미완료
→ milestone-gate 스킬 호출 안 함
→ garbage-collection 자동 호출 안 함

[TeamDelete 호출]
TeamDelete("blog-dev-20260413-1530-feature")

[오케스트레이터 종료]
사용자에게 보고 완료 + 대기 상태로 전환
```

**Git 작업은 하지 않음** (`.claude/rules/workflow.md`: 사용자 명시 요청 시에만).
현재 브랜치는 `feature/M0-foundation` 상태로 유지 — 다음 M0 태스크(M0-07 등)는 **같은 브랜치에서 이어서 진행**.

### Step 13 — (미래) 마일스톤 완료 시점

M0 전체 33개 태스크가 `[x]`가 되면:

```
[milestone-gate 스킬 자동 호출]
- pnpm build 성공
- RT-* 14종 404 없이 렌더 (Playwright 검증)
- 판정: PASS

[garbage-collection 자동 호출]
- 코드 정화, 문서 동기화, 하네스 평가
- 완료

[AskUserQuestion]
"M0 완료! 다음 절차를 실행할까요?

 1. 최종 커밋: git commit -m 'feat(M0): Foundation 마일스톤 완료'
 2. 원격 푸시: git push -u origin feature/M0-foundation
 3. PR 생성: gh pr create --base develop
                        --head feature/M0-foundation
                        --title 'feat: M0 Foundation 완료'"

[사용자 승인 후 실행]
→ PR URL 출력

[머지 후]
→ 사용자가 gh pr merge 실행 (squash merge)
→ git checkout develop && git pull origin develop
→ git branch -d feature/M0-foundation
→ M1 첫 태스크 진입 시 Phase 0에서 feature/M1-ui-skeleton 새로 생성 제안
```

---

## 4-1. Git 브랜치 전략

하네스는 **Git Flow Lite**를 따른다.

```
main        ← 프로덕션 릴리스 (보호 브랜치)
  ↑
develop     ← 기본 통합 브랜치 (모든 feature PR의 base)
  ↑
feature/M{n}-{슬러그}   ← 마일스톤 단위 개발
  예: feature/M0-foundation
      feature/M1-ui-skeleton
      feature/M2-content-pipeline
```

### 1 마일스톤 = 1 feature 브랜치

- 마일스톤의 **모든 태스크**가 한 브랜치 위에서 순차 커밋된다 (태스크마다 브랜치 X)
- 커밋 단위: 태스크당 1 커밋 (`feat(M0-06): cn() 유틸리티 추가`)
- 머지 전략: **squash merge** — 마일스톤 단위 커밋 1개로 압축

### 새 마일스톤 진입 시 (orchestrator Phase 0 자동 처리)

```bash
# 1. 리모트 최신 develop 기반 보장
git checkout develop
git fetch origin
git pull origin develop

# 2. 마일스톤 브랜치 생성
git checkout -b feature/M{n}-{슬러그}
```

**반드시 리모트 기준 최신 develop에서 분기**. 로컬이 뒤처진 상태에서 브랜치를 따면 나중에 PR 머지 충돌이 누적된다.

### 마일스톤 완료 시

1. `milestone-gate` 스킬이 PASS 판정
2. `garbage-collection` 스킬 완료
3. orchestrator가 PR 생성 제안 (AskUserQuestion)
4. 사용자 승인 → `gh pr create --base develop` 실행
5. 머지 후 `git checkout develop && git pull origin develop`
6. 다음 마일스톤 첫 태스크 진입 시 Phase 0이 새 브랜치 생성 제안

### 예외 상황

- **GC 트랙**: 브랜치 체크 생략 (어느 브랜치에서든 실행 가능)
- **Docs 트랙**: 브랜치 체크 생략 (단순 문서 동기화)
- **Content 트랙**: 선택적 — 대형 포스트는 `feature/content-{slug}` 권장
- **긴급 버그픽스**: `fix/...` 브랜치로 develop에서 직접 분기 가능

---

## 5. 트랙별 상세

### Feature 트랙

- **진입점**: 태스크 ID, 마일스톤 키워드, 기능명
- **팀 구성** (태스크 유형별, `blog-dev/references/project-context.md` 참조):
  - UI 컴포넌트: nextjs-markup-specialist + compound-reviewer + a11y-auditor
  - 페이지 라우팅: nextjs-app-router-expert + compound-reviewer + boundary-mismatch-qa
  - 서비스·유틸: nextjs-app-router-expert + compound-reviewer + nextjs-test-engineer
  - 디자인 토큰: nextjs-markup-specialist + compound-reviewer
- **사이클**: 위 M0-06 예시와 동일한 6단계

### Content 트랙

- **진입점**: "포스트", "글", "MDX", "시리즈 N편", "교정", "초안"
- **5단계 사이클**: OUTLINE → DRAFT → REVIEW(3-way) → VALIDATE → DOCUMENT
- **REVIEW가 특별**: 3명이 병렬 검수 (seo-auditor, a11y-auditor, react-nextjs-code-reviewer)
- **산출물**: `contents/posts/{slug}/index.mdx` (draft: false 로 최종 이동 시)

### GC 트랙

- **진입점**: "GC", "청소", "Week N GC", "하네스 평가"
- **5단계 워크플로우**:
  1. 코드 정화 (`pnpm lint`, any 탐지, 데드 코드 제거)
  2. 패턴 교정 (15개 규칙 위반 탐지)
  3. 문서 동기화 (코드-문서 드리프트 수정)
  4. 하네스 평가 (100점 채점)
  5. 피드백 루프 (3회+ 반복 실수 → 신규 규칙 제안)
- **자가진화**: 동일 실수 3회+ → `.claude/rules/`에 신규 규칙 제안 → 사용자 승인 후 반영

### Docs 트랙

- **진입점**: "TASKS 업데이트", "ROADMAP 진행률", "CHANGELOG 작성"
- **작업**: TASKS.md 체크박스 동기화 + CHANGELOG 추가 + README 갱신
- **PRD_PRODUCT/PRD_TECHNICAL 수정은 자율 범위 밖** → 반드시 AskUserQuestion

---

## 6. 산출물 경로 (`_workspace/`)

모든 중간 산출물은 `_workspace/`에 저장된다 (`.gitignore` 대상).

```
_workspace/
├── plan_{task}_analysis.md           Phase 1: 요구사항·의존성 분석
├── execute_{task}_{role}.md          Phase 2: 변경 요약 (role: logic/markup/test)
├── review_{task}_iter{N}.md          Phase 3: 리뷰 iter별 판정 (N=1,2,3)
├── qa_{boundary}_report.md           Phase 4: 경계면 검증
├── qa_{task}_a11y.md                 Phase 4: 접근성 검증
├── test_{task}_report.md             Phase 4: 테스트 결과
├── content_{slug}_draft.md           Content 트랙: MDX 초안
├── content_{slug}_outline.md         Content 트랙: OUTLINE
├── docs_update_{date}.md             Phase 5: 문서 변경 요약
├── gc_{scope}_{date}_report.md       GC 트랙: 통합 리포트
├── harness_eval_{date}.md            GC 트랙: 하네스 점수표
├── milestone_{m}_gate_{date}.md      milestone-gate: 게이트 판정
└── synthesize_{task}_summary.md      Phase 5: 태스크 완료 요약
```

파일 보존 정책: 30일 경과 파일은 GC에서 자동 정리 검토.

---

## 7. 에러 처리 & ESCALATE

### 사이클 내부 에러

| 상황              | 내부 대응                | 사용자 영향           |
| ----------------- | ------------------------ | --------------------- |
| EXECUTE 빌드 실패 | 2회 재시도               | 3회째 ESCALATE        |
| REVIEW 3회 FIX    | 자동 ESCALATE            | 잔존 이슈 보고        |
| VALIDATE 2회 FIX  | 자동 ESCALATE            | 경계면 근본 문제 시사 |
| 팀원 응답 지연    | 1회 핑 후 Phase 건너뛰기 | 보고서에 기록         |
| MCP 서버 실패     | 로컬 Read/Grep 폴백      | 품질 저하 명시        |

### 보안·자율 범위 위반

`.claude/rules/autonomy.md`의 **확인 필수 범주**에 해당하는 작업이 필요하면 즉시 `AskUserQuestion`:

- 의존성 추가/제거 (`package.json`)
- 설정 변경 (`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`)
- PRD_PRODUCT/PRD_TECHNICAL 수정
- 아키텍처 변경 (새 feature 도메인, 3 Laws 경계 조정)
- Git 쓰기 작업 (`commit`, `push`, `pr create`, `reset`)
- `contents/` 발행 포스트 수정

### ESCALATE 프로토콜

```
1. 사이클 중단 (후속 Phase 진행 안 함)
2. _workspace/에 상세 기록:
   - review_{task}_escalated.md
   - 현재 상태, 미해결 이슈, 권장 액션
3. 사용자에게 직접 보고:
   - "3회 반복 후 미해결"
   - "보안 위반 발견: [구체 이슈]"
4. 수동 개입 대기 (자동 재시도 없음)
```

---

## 8. 하네스 자가진화 (GC 피드백 루프)

GC가 **동일 실수 3회 이상** 발견 시 자동으로 규칙 개선을 제안한다.

### 예시 시나리오

```
GC 실행 히스토리 (3회)
- 2026-03-01: cn.ts 수정 시 테스트 한국어 describe 누락
- 2026-03-15: Button.tsx 수정 시 테스트 한국어 describe 누락
- 2026-03-30: useDebounce.ts 수정 시 테스트 한국어 describe 누락

[garbage-collector 분석]
→ 패턴 감지: "테스트 describe 한국어 규칙 위반 3회+"
→ 현재 testing.md에 관련 조항 있으나 약함

[제안 생성]
"testing.md에 다음 강조 조항 추가 제안:
'describe/it은 **반드시** 한국어로 작성. 영어 설명은 compound-reviewer가 FIX로 판정.'"

[사용자 승인 대기 (autonomy.md: 규칙 변경은 확인 필수)]
```

승인 시 `.claude/rules/testing.md` 수정 → 이후 작업부터 예방.

---

## 9. 마일스톤 게이트

마일스톤 내 모든 태스크가 `[x]`가 되면 `milestone-gate` 스킬이 자동 호출된다.

### M0 게이트 (Foundation)

**Exit 기준**: `pnpm dev`에서 RT-\* 14종 라우트가 404 없이 렌더.

**자동 검증 절차**:

1. `pnpm install --frozen-lockfile`
2. `pnpm build`, `pnpm lint` 통과
3. `pnpm dev --port 3100` (background)
4. Playwright MCP로 14개 라우트 순회 → 상태 코드 200 확인
5. 콘솔 에러/워닝 수집
6. 각 페이지 스크린샷 → `_workspace/m0_screenshots/`

**판정 3단계**:

- **PASS**: `garbage-collection` 자동 호출 → 다음 마일스톤 대기
- **FAIL**: 실패 태스크를 `[ ]`로 되돌리고 후속 조치 제안
- **WARN**: 통과하되 품질 이슈 기록 (예: 렌더 지연)

---

## 10. 하네스 사용 시 주의사항

### 자동으로 하지 않는 것

- **Git 쓰기 작업** — `commit`, `push`, `pr create`, `reset`은 반드시 사용자 명시 요청.
- **package.json 변경** — 의존성 추가·제거는 승인 필수.
- **PRD\_\*.md 수정** — 서술 변경은 승인 필수.
- **contents/ 발행 포스트 덮어쓰기** — 교정 모드에서도 diff 제시 후 승인.
- **`.claude/rules/` 수정** — GC 피드백 루프에서도 승인 후에만.

### 자동으로 하는 것

- `src/`, `contents/` 작업용 파일 수정 (단, 발행 포스트 제외)
- 신규 테스트 작성·수정
- `docs/TASKS.md` 체크박스 업데이트
- `docs/CHANGELOG.md` 항목 추가
- `_workspace/` 관리 (생성·삭제)
- `pnpm build`, `pnpm lint`, `pnpm test`, dev 서버 실행
- context7·serena·shadcn·playwright MCP 호출

### 컨트롤 탈출

원하지 않는 방향으로 가면:

- `"중단해"` → orchestrator가 현재 태스크에서 ESCALATE 처리, 대기 상태로 전환
- `"자율 실행 범위를 줄여줘"` → `autonomy.md`에 일시 규칙 추가 제안
- `"이 태스크는 내가 직접 할게"` → 해당 태스크 `[ ]`로 되돌리고 팀 해체

---

## 11. 하네스 구성 파일 레퍼런스

사용자 관점의 학습 순서:

1. **`CLAUDE.md`** (루트) — 프로젝트 전체 맥락
2. **`docs/TASKS.md` / `docs/ROADMAP.md`** — 태스크·마일스톤 정의
3. **이 문서** — 하네스 동작 원리
4. **`.claude/skills/blog-dev/skill.md`** — 오케스트레이터 스킬
5. **`.claude/skills/compound-engineering/skill.md`** — 6단계 사이클 상세
6. **`.claude/skills/blog-dev/references/project-context.md`** — 팀 구성 매트릭스

개발자 관점:

1. **`.claude/agents/**/\*.md`\*\* — 15개 에이전트 정의
2. **`.claude/rules/*.md`** — 15개 코딩 규약
3. **`.claude/skills/*/skill.md`** — 12개 스킬
4. **`.claude/commands/**/\*.md`\*\* — 9개 슬래시 커맨드
5. **`.claude/hooks/*.sh`** — 지연 린팅 스크립트
6. **`.claude/settings.json`** — MCP 권한·훅 연결

---

## 12. 자주 묻는 질문

### Q. 태스크 ID를 몰라도 쓸 수 있나요?

네. `"헤더 만들어줘"`라고 하면 orchestrator가 TASKS.md에서 유사 태스크 3개를 제시하고 `AskUserQuestion`으로 확인합니다.

### Q. 여러 태스크를 동시에 할 수 있나요?

순차만 가능합니다. `"M0-06부터 M0-10까지"`라고 하면 5개 태스크를 하나씩 사이클로 돌립니다 (팀 모드 1팀 제약).

### Q. 사이클 중간에 코드를 수동으로 고치면 어떻게 되나요?

orchestrator는 VALIDATE Phase에서 파일 상태를 다시 확인하므로 수동 변경은 감지됩니다. 단, REVIEW iter 중이라면 먼저 `"잠깐 내가 고칠게"`라고 알려주세요.

### Q. GC가 멋대로 내 코드를 지우면 어떡하죠?

GC는 **자동 수정 범주**(lint fix, prettier, 미사용 import)만 스스로 수정합니다. 아키텍처 위반·any 타입 교체 등 판단 필요한 항목은 반드시 사용자 질의입니다 (`autonomy.md`).

### Q. 커밋은 언제 되나요?

**한 번도 자동으로 되지 않습니다.** 사이클 종료 후 `"커밋해줘"` 또는 `/git:commit`을 직접 요청해야 합니다 (`.claude/rules/workflow.md` 절대 금지 규칙).

### Q. 하네스를 끄고 싶어요.

`"하네스 쓰지 말고 그냥 M0-06 해줘"`라고 하면 Claude Code가 직접 작업합니다. 이 경우 사이클·리뷰·검증은 자동 실행되지 않습니다.

---

## 13. 이력 & 업데이트

- **2026-04-13**: 최초 작성 (M0-06 예시 중심)
- 하네스 구성 변경 시 이 문서도 함께 갱신합니다. `garbage-collection` 스킬이 Week N GC에서 문서-코드 드리프트를 감지하면 업데이트를 제안합니다.
