---
name: garbage-collection
description: "dev-blog 코드·문서·하네스의 주기적 정화·평가·자가진화 워크플로우. 마일스톤 완료 후 또는 사용자가 '`GC`', '`청소해줘`', '`Week N GC`', '`하네스 평가`' 요청 시 반드시 트리거. 5단계(코드 정화→패턴 교정→문서 동기화→하네스 평가→피드백 루프)로 기술 부채를 정화하고, 반복 실수 3회+ 패턴을 `.claude/rules/`에 신규 규칙으로 피드백."
---

# Garbage Collection

AI가 생성한 코드의 기술 부채를 주기적으로 정화하고, 반복 실수를 규칙으로 피드백해 하네스를 자가진화시킨다. `garbage-collector` 에이전트가 주도.

## 실행 시점

| 시점             | 트리거                 | 범위                                   |
| ---------------- | ---------------------- | -------------------------------------- |
| 마일스톤 완료 후 | orchestrator 자동 호출 | 해당 마일스톤의 변경분 + 문서 + 하네스 |
| 수동 요청        | "GC", "청소해줘"       | 사용자 지정 범위 (기본: 직전 GC 이후)  |
| Week 단위        | "Week N GC"            | Week N 변경 코드 + 문서                |
| 하네스만 점검    | "하네스 평가"          | `.claude/` 전체                        |

## 5단계

### 1. 코드 정화

도구:

- `pnpm lint` (ESLint) → 자동 수정 가능한 항목 `eslint --fix`
- `pnpm build` (타입체크 포함, 현재 프로젝트는 별도 typecheck 스크립트 없음)
- Grep 패턴 탐지:
  - `console\.(log|warn|debug)` — 프로덕션 코드에서 제거
  - `:\s*any\b` — any 타입
  - `TODO|FIXME|XXX|HACK` — 미해결 주석
  - 매직 넘버 (숫자 리터럴이 3회+ 반복되는 경우)

자동 수정 → 빌드·테스트 재실행 → 통과 확인.

### 2. 패턴 교정 (15개 규칙 기반)

`.claude/rules/` 15개 파일(a11y·autonomy·components·icons·mdx-content·project-structure·react·review-discipline·seo·shadcn·styling·testing·theme·typescript·workflow)의 핵심 조항을 체크리스트로 변환해 위반 패턴 탐지.

주요 위반 패턴 (상세는 `references/rule-violations.md`):

| 규칙              | 위반 예시                                | 탐지 방법                    |
| ----------------- | ---------------------------------------- | ---------------------------- |
| project-structure | app → shared 경로가 features 거치지 않음 | import 경로 Grep             |
| components        | Props를 interface로 선언                 | `interface\s+\w+Props`       |
| react             | useEffect에서 상태 파생                  | `useEffect.*setState.*props` |
| typescript        | as 단언 사용                             | `\bas\s+[A-Z]`               |
| styling           | 인라인 style 사용                        | `style=\{\{`                 |
| a11y              | 이미지 alt 누락                          | `<img[^>]*(?!alt)`           |
| theme             | enableColorScheme 활성화                 | `enableColorScheme=\{true\}` |
| testing           | 구현 세부 테스트                         | `container\.querySelector`   |
| mdx-content       | frontmatter 필드 누락                    | MDX 파서로 검증              |
| seo               | description 길이 범위 외                 | MDX 파서 + 길이 계산         |
| autonomy          | 자율 범위 위반                           | Git 쓰기 명령 히스토리       |

자동 수정 vs 질의 구분은 `garbage-collector` 에이전트의 "작업 원칙" 참조.

### 3. 문서 동기화

드리프트 탐지:

- **실제 features/ vs PRD_TECHNICAL.md MOD 테이블** — 누락/추가 모듈 감지
- **실제 src/app/ vs TASKS.md 체크박스** — 체크는 되어있는데 파일이 없거나, 반대인 경우
- **실제 .claude/agents/ vs .claude/skills/의 참조** — 스킬이 참조하는 에이전트가 실재하는지
- **CHANGELOG Unreleased vs 실제 커밋 히스토리** — 누락된 변경사항

#### 3.1 일관성 매트릭스 (필수 자동 검증)

`hardcoded SSOT` 위반은 GC에서 가장 빈번한 drift 원인이므로 매 GC마다 다음 매트릭스를 그렙으로 자동 검증한다 (2026-05-03 v1.0.0 GC에서 4건 동시 발견되어 도입):

| 항목                        | 진실 공급원 (SSOT)                       | 검증 대상                                                                                                                      |
| --------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 프로젝트 버전               | `package.json` `version`                 | `CHANGELOG.md` 최신 헤더, `docs/TASKS.md` Exit, `docs/ROADMAP.md` 진행률                                                       |
| TypeScript 버전             | `package.json` `dependencies.typescript` | `CLAUDE.md`, `README.md`, `docs/PRD_TECHNICAL.md`, `.claude/agents/**/*.md`, `.claude/rules/**/*.md`, `.claude/skills/**/*.md` |
| Next.js·React·Tailwind 버전 | `package.json` `dependencies`            | 위와 동일                                                                                                                      |
| features 개수               | `ls src/features/` 실제 카운트           | `CLAUDE.md` "9개 도메인 모듈", `docs/PRD_TECHNICAL.md` 모듈 매트릭스                                                           |
| agents·skills·rules 카운트  | `ls .claude/{agents,skills,rules}/`      | `CLAUDE.md`, `docs/AI_WORKFLOW_GUIDE.md`                                                                                       |
| 사이트 메타·소셜 링크       | `src/shared/config/site.ts`              | `src/app/**/page.tsx`의 `metadata` (페이지 specific description은 예외)                                                        |

**탐지 명령** (예시):

```bash
# 버전 카운트 매트릭스
diff <(grep '"version"' package.json | head -1) <(grep -E "## \[[0-9]" CHANGELOG.md | head -1)
# TypeScript 버전 텍스트 매트릭스
grep -rn "TypeScript [0-9]" CLAUDE.md docs/ .claude/ README.md
# 카운트 매트릭스
expr $(ls -1 src/features/ | wc -l) - 9   # 0이 아니면 drift
```

드리프트 건당 제안:

- 문서가 뒤처진 경우: 문서 수정 제안 (자율 범위 내)
- 코드가 문서와 다른 경우: 사용자 질의 (의도적인지 실수인지 판단 불가)
- **SSOT 외 hardcoded 버전 발견** 시: 해당 텍스트 일괄 수정 (자율) + GC 리포트의 트래킹 ID 발급

### 4. 하네스 평가 (100점)

| 영역                   | 점수 | 채점 기준                                                                  |
| ---------------------- | ---- | -------------------------------------------------------------------------- |
| 에이전트 정의 완전성   | 20   | frontmatter(name, description, model:opus) + 필수 섹션(역할·프로토콜·에러) |
| 스킬 description pushy | 20   | 트리거 키워드·should-NOT-trigger 명시 여부                                 |
| 규칙 일관성            | 20   | 규칙 간 모순 0건, 중복 0건                                                 |
| 팀 통신 프로토콜       | 20   | SendMessage 대상이 실재, 사이클 일관성                                     |
| 에러 핸들링 완결성     | 20   | ESCALATE 조건 명시, 각 실패 케이스 대응책 존재                             |

산출물: `_workspace/harness_eval_{date}.md`

- 총점 + 영역별 상세
- 80점 미만 시 구체적 개선 액션
- 60점 미만 시 CRITICAL 알림

### 5. 피드백 루프 (자가진화)

**3회 이상 반복된 실수 패턴**을 분석:

- 동일 위반이 각기 다른 작업에서 3회 이상 발생
- GC 리포트 히스토리(`_workspace/gc_*_report.md`)를 누적 분석
- 패턴 식별 → 기존 규칙으로 예방 불가 → 신규 규칙 또는 기존 규칙 보강 제안

제안 포맷:

```markdown
## 신규 규칙 제안

### 패턴

- 최근 3회 GC에서 "shared/styles/ 직접 수정 + Tailwind @theme 업데이트 누락" 패턴 발견
  - GC 2026-03-01: commit abc123
  - GC 2026-03-15: commit def456
  - GC 2026-03-30: commit ghi789

### 제안

- `.claude/rules/styling.md`에 조항 추가:
  > `shared/styles/tokens.css` 수정 시 반드시 `globals.css`의 `@theme inline` 블록 동시 점검 (shadcn alias 매핑 무결성)

### 승인 필요 (autonomy.md)
```

사용자가 승인하면 `.claude/rules/` 수정, 거부하면 패턴만 기록하고 다음 GC 때 재평가.

## 산출물

- `_workspace/gc_{scope}_{date}_report.md` — 5단계 통합 리포트
- `_workspace/harness_eval_{date}.md` — 하네스 점수표 (4번 결과 분리 저장)
- 자동 수정된 파일들 — 빌드 통과 확인 완료 상태

## 에러 처리

| 상황                      | 대응                                            |
| ------------------------- | ----------------------------------------------- |
| 자동 수정 후 빌드 실패    | 해당 변경만 롤백, 사용자 질의                   |
| 규칙 간 모순 발견         | CRITICAL 즉시 보고                              |
| 하네스 60점 미만          | CRITICAL — orchestrator에 전체 리빌드 검토 요청 |
| 피드백 규칙이 기존과 충돌 | 통합 제안 (merge) 우선                          |
| Git 쓰기 필요한 수정 제안 | `workflow.md` 금지, 반드시 사용자 요청 대기     |

## 참고

- 규칙 위반 탐지 상세: `references/rule-violations.md`
- 에이전트: `.claude/agents/quality/garbage-collector.md`
