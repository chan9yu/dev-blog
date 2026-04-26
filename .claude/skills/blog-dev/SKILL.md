---
name: blog-dev
description: "chan9yu 개발 블로그의 메인 오케스트레이터. 사용자가 '`M0-01 진행해줘`', '`M1 마일스톤 작업 다 해줘`', '`검색 기능 만들어줘`', '`React 19 use 훅 포스트 작성`', '`Week 0 GC`', '`M0-05부터 M0-10까지 진행`', '`TASKS 체크 상태 맞춰줘`' 같이 블로그 개발의 어떤 자연어 요청이든 반드시 이 스킬이 진입점. 4개 트랙(Feature·Content·GC·Docs)으로 자동 분류하고 TeamCreate로 전문 팀을 구성해 컴파운드 엔지니어링 사이클을 실행. 단순 질문·문서 조회는 트리거하지 않음."
---

# blog-dev — Orchestrator

dev-blog 프로젝트의 단일 진입점. 자연어 요청을 분석해 4개 트랙으로 분류하고, 전문 팀을 구성해 컴파운드 사이클을 실행한다.

## Phase 0: 브랜치 상태 체크 (Branch Preflight)

Phase 1 직전에 **현재 Git 브랜치가 대상 마일스톤과 일치하는지** 확인한다. 이는 `workflow.md`의 "1 마일스톤 = 1 feature 브랜치" 원칙을 강제한다.

```
현재 브랜치 = $(git rev-parse --abbrev-ref HEAD)
대상 마일스톤 = Phase 1 분석 결과에서 추출 (M{n})
│
├── feature/M{n}-*  (일치)
│   └── 그대로 Phase 1 진행
│
├── feature/M{k}-*  (다른 마일스톤)
│   └── AskUserQuestion:
│       "현재 {k} 브랜치에 있는데 M{n} 태스크 요청입니다.
│        (a) 여기서 진행 (권장 안 함)
│        (b) develop으로 돌아가서 feature/M{n}-* 새로 생성 (Recommended)
│        (c) 중단"
│
├── develop or main
│   └── AskUserQuestion:
│       "새 마일스톤 M{n} 시작입니다. 다음 절차를 실행할까요?
│        1. git checkout develop
│        2. git fetch origin && git pull origin develop
│        3. git checkout -b feature/M{n}-{슬러그}"
│   └── 승인 시 orchestrator가 직접 Bash 실행
│
└── 기타 브랜치
    └── 사용자에게 상황 보고 + 수동 정리 요청 → 중단
```

**실제 `git` 명령은 사용자 승인 후에만 실행** (autonomy.md + workflow.md 교차 적용). 승인 없이 `git checkout`/`git pull`/`git checkout -b`를 호출하지 않는다.

GC·Docs 트랙은 브랜치와 무관하므로 Phase 0 건너뛰기 허용. Content 트랙도 콘텐츠 작성은 브랜치와 독립 (필요 시 `feature/content-{slug}` 권장하나 강제 안 함).

## Phase 1: 입력 분석 (Input Analysis)

사용자 요청을 파싱해 트랙을 결정한다.

### 트랙 분류 규칙

| 트랙        | 트리거 패턴                                                           | 예시                                |
| ----------- | --------------------------------------------------------------------- | ----------------------------------- |
| **Feature** | `M\d-\d+`, `Week \d+`, 9개 feature 도메인명, "구현", "만들어", "추가" | "M0-01 진행", "검색 기능 만들어줘"  |
| **Content** | "포스트", "글", "MDX", "시리즈 N편", "교정", "초안"                   | "React 19 포스트 작성", "use 훅 글" |
| **GC**      | "GC", "청소", "정화", "하네스 평가", "Week N GC"                      | "Week 0 GC", "청소해줘"             |
| **Docs**    | "TASKS 업데이트", "ROADMAP 진행률", "CHANGELOG"                       | "TASKS 체크 맞춰줘"                 |

복합 요청(예: "M0 전체 + 첫 포스트 초안")은 트랙별로 순차 실행한다.

### 입력 소스 참조

```
docs/TASKS.md       ← M0~M7 태스크 ID 매칭
docs/ROADMAP.md     ← 마일스톤 서술·Exit 기준
docs/PRD_TECHNICAL.md ← MOD·RT·FEAT ID와 파일 경로
.claude/rules/      ← 15개 규칙 (팀 배포용 메타)
```

9개 feature 도메인: `posts`, `tags`, `series`, `search`, `views`, `comments`, `theme`, `lightbox`, `about`

### 모호한 입력 처리

사용자 의도가 불분명하면 `AskUserQuestion` 호출:

- "뭔가 해줘" → 최근 TASKS에서 다음 태스크 3개 제시 후 선택
- "포스트 쓰자" → OUTLINE 단계로 이동 (주제·대상·분량 질의)
- "GC" (범위 모호) → week/all/harness/docs 4개 옵션

## Phase 2: 팀 구성 (Team Composition)

트랙별 팀원 선택. 자세한 조합은 `references/project-context.md` 참조.

### 기본 팀 구성

| 트랙              | 팀원 (최대 5명)                                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| Feature (UI+로직) | nextjs-app-router-expert, nextjs-markup-specialist, compound-reviewer, boundary-mismatch-qa, nextjs-test-engineer |
| Feature (로직만)  | nextjs-app-router-expert, compound-reviewer, nextjs-test-engineer                                                 |
| Feature (UI만)    | nextjs-markup-specialist, compound-reviewer, a11y-auditor                                                         |
| Content           | content-engineer, seo-auditor, a11y-auditor, react-nextjs-code-reviewer                                           |
| GC                | garbage-collector (단독) + 필요 시 docs-generator                                                                 |
| Docs              | docs-generator (단독) + 필요 시 garbage-collector                                                                 |
| Milestone Gate    | 위 트랙 완료 후 milestone-gate 스킬 호출 (팀 재구성 없음)                                                         |

### 팀 생성

```
TeamCreate(
  team_name="blog-dev-{YYYYMMDD-HHmm}-{track}",
  members=[{ name, role }...]
)
TaskCreate(tasks=[...])  # 태스크별 owner 지정
```

## Phase 3: 컴파운드 엔지니어링 사이클

`compound-engineering` 스킬을 로드해 태스크마다 6단계 반복:

```
PLAN → EXECUTE → REVIEW(3회 핑퐁) → VALIDATE(1회 되돌림) → DOCUMENT → SYNTHESIZE
```

### ⚠️ REVIEW 단계 강제 (review-discipline.md)

**EXECUTE 완료 직후 REVIEW를 건너뛰고 DOCUMENT로 직행하는 것은 절대 금지.** `.claude/rules/review-discipline.md` 참조.

자체 판단으로 "단순 작업이라 리뷰 불필요"라고 압축하지 말 것. 회고 결과 그 판단이 빗나가는 사례가 다수 발생함 (M0-01~06, M0-09~15에서 사용자 사후 지적으로 13+개 이슈 발견).

EXECUTE 완료 시 다음을 자동 실행:

1. **트랙별 3-way 리뷰 에이전트 병렬 호출** (한 메시지에 Agent tool 다중 호출):
   - Feature(UI+로직): `react-nextjs-code-reviewer` + `a11y-auditor` + `compound-reviewer`
   - Feature(로직만): `react-nextjs-code-reviewer` + `boundary-mismatch-qa` + `compound-reviewer`
   - Feature(UI만): `react-nextjs-code-reviewer` + `a11y-auditor` + `compound-reviewer`
   - Content: `seo-auditor` + `a11y-auditor` + `react-nextjs-code-reviewer`
2. **결과 종합** → Tier 1(Critical) / Tier 2(품질) / Tier 3(후속) 분류
3. **AskUserQuestion**으로 수정 범위 결정
4. **수정 적용** → 빌드 재검증
5. CHANGELOG에 **리뷰 결과 요약 항목 필수** 기재
6. DOCUMENT 진입

REVIEW 생략은 **사이클 무결성 위반**. 위반 시 즉시 정지하고 누락분 회수.

### 트랙별 사이클 변형

- Content 트랙은 REVIEW가 3-way(SEO·a11y·코드) 병렬
- GC 트랙은 REVIEW·VALIDATE 생략, PLAN→EXECUTE→DOCUMENT만
- Docs 트랙은 EXECUTE→VALIDATE(빌드 확인)→DOCUMENT
- **단일 line/체크박스/CHANGELOG 추가**는 EXECUTE 아님 → REVIEW 면제 (review-discipline.md "예외" 섹션)

## Phase 4: 결과 통합 (Integration)

모든 태스크 완료 후:

- `_workspace/`의 모든 산출물 수집
- 리뷰 반복 횟수·테스트 결과·경계면 리포트 요약
- `docs/CHANGELOG.md` Unreleased 섹션 최종 점검

## Phase 5: 정리 & 자동 후속 (Cleanup & Auto Follow-up)

- 마일스톤 완료 감지 → `milestone-gate` 자동 호출
- 게이트 PASS → `garbage-collection` 자동 호출 (해당 마일스톤 범위)
- `TeamDelete` — 팀 해체
- 사용자에게 최종 보고 (Output 섹션 참조)

## Output (사용자 보고 포맷)

```markdown
## 🎯 작업 완료 — {track}

### 완료 태스크

- [M0-06] `cn()` 유틸리티 — `src/shared/utils/cn.ts`
- [M0-09] Header 컴포넌트 — `src/shared/components/common/Header.tsx`

### 사이클 통계

- REVIEW 평균 반복: 1.5회
- VALIDATE FIX: 0회
- 총 소요 시간: ~18분

### 검증 결과

- ✅ `pnpm build` (3.2s)
- ✅ `pnpm lint` (0 errors)
- ⚠️ 테스트 미설치 (M2에서 Vitest 도입 예정)

### 변경 파일

- src/shared/utils/cn.ts (신규)
- src/shared/utils/**tests**/cn.test.ts (신규)
- docs/TASKS.md (체크박스 갱신)
- docs/CHANGELOG.md (Added 항목)

### 후속 조치

- 다음 추천 태스크: M0-07 (Pretendard 폰트 설정)
```

## 테스트 시나리오

### Should-trigger (이 스킬 활성화)

1. "M0-01 진행해줘" → Feature 트랙, M0-01 태스크 실행
2. "검색 기능 구현" → Feature 트랙, features/search 작업
3. "React 19 포스트 초안" → Content 트랙, OUTLINE 시작
4. "Week 0 GC 실행" → GC 트랙
5. "TASKS 체크 상태 맞춰줘" → Docs 트랙
6. "M1 전체 진행" → 마일스톤 단위, 태스크 순차

### Should-NOT-trigger (다른 도구·스킬이 적합)

1. "Next.js 공식 문서에서 App Router 찾아줘" → context7 MCP 직접
2. "이 타입 에러만 빠르게 고쳐" → typescript-expert 스킬
3. "shadcn Button 추가만 해줘" → shadcn MCP
4. "현재 커밋 로그 보여줘" → git log 직접
5. "CLAUDE.md 내용 설명해줘" → 단순 읽기

## 에러 처리

| 상황                     | 대응                                                      |
| ------------------------ | --------------------------------------------------------- |
| 트랙 분류 실패           | `AskUserQuestion`으로 4개 트랙 제시, 사용자 선택          |
| TASKS.md에 요청 ID 없음  | 유사 ID 제안 후 재확인                                    |
| 컴파운드 사이클 ESCALATE | 즉시 사용자 보고, 후속 진행 중단                          |
| 팀원 스폰 실패           | 1회 재시도, 지속 시 해당 팀원 역할을 다른 에이전트로 폴백 |
| 마일스톤 게이트 FAIL     | 원인 태스크를 `[ ]`로 되돌리고 후속 조치 제시             |

## 참고

- 프로젝트 컨텍스트: `references/project-context.md`
- 사이클 정의: `.claude/skills/compound-engineering/SKILL.md`
- 콘텐츠 전용: `.claude/skills/content-writing/SKILL.md`
- GC: `.claude/skills/garbage-collection/SKILL.md`
- 게이트: `.claude/skills/milestone-gate/SKILL.md`
- 문서 동기화: `.claude/skills/task-completion/SKILL.md`
