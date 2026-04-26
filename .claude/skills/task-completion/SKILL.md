---
name: task-completion
description: "태스크 완료 시 문서(TASKS·CHANGELOG·README)를 일관되게 갱신하는 스킬. 컴파운드 사이클 DOCUMENT Phase에서 `docs-generator` 에이전트가 자동 호출. '`태스크 완료`', '`M0-06 완료`', '`CHANGELOG 추가`' 같은 요청에도 트리거. 태스크 ID와 변경 파일 diff를 입력받아 문서를 in-place 수정."
---

# Task Completion

태스크 1개가 VALIDATE를 통과했을 때 실행되는 문서 동기화 절차.

## 입력

```yaml
task_id: "M0-06"                          # TASKS.md의 대괄호 ID
changed_files:                            # git diff --name-only 결과
  - "src/shared/utils/cn.ts"
  - "src/shared/utils/__tests__/cn.test.ts"
category: "Added" | "Changed" | "Fixed" | "Removed"
summary: "clsx + tailwind-merge 조합 유틸"  # 1문장, 50자 이내
breaking: false                           # true면 BREAKING CHANGE 섹션에 추가
```

## 워크플로우

### 1. TASKS.md 갱신

- 파일을 Read, `[task_id]` 패턴으로 라인 검색
- `[ ]` → `[x]` 또는 `[~]` → `[x]` (정확한 ID 매칭, 부분 매칭 금지)
- 파일에 해당 ID가 없으면 CRITICAL 보고 (잘못된 ID)
- Edit 툴의 `replace_all: false`로 단일 치환

### 2. CHANGELOG.md 갱신

파일이 존재하지 않으면 Keep a Changelog 템플릿으로 신규 생성:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- [M0-06] clsx + tailwind-merge 조합 유틸 (`src/shared/utils/cn.ts`)
```

기존 CHANGELOG가 있으면 `## [Unreleased]` 섹션의 해당 카테고리에 추가:

```markdown
## [Unreleased]

### Added

- [M0-06] clsx + tailwind-merge 조합 유틸 (`src/shared/utils/cn.ts`)
- (기존 항목은 아래에)
```

**포맷 규칙:**

- 카테고리 순서: Added → Changed → Deprecated → Removed → Fixed → Security
- 각 항목은 `[태스크ID]`로 시작, 대표 파일 경로를 parentheses로
- Breaking change는 `### Changed` 카테고리에 `**BREAKING:**` 접두사

### 3. README.md 갱신 (선택적)

다음 경우에만 업데이트:

- `package.json`의 `scripts` 변경 → README의 Commands 섹션 갱신
- 주요 의존성 추가/제거 → Stack 섹션 갱신
- 그 외는 README 수정하지 않음

### 4. PRD_TECHNICAL.md 갱신 제안 (승인 필수)

아래 경우 `AskUserQuestion`으로 사용자 확인:

- 공개 API(`features/*/index.ts` export) 변경
- 새 feature 도메인 추가
- 아키텍처 패턴 변경

승인 시 MOD 테이블 수정, 미승인 시 `_workspace/docs_update_{date}.md`에 "사용자 보류" 기록.

## 출력

- **in-place 수정**: `docs/TASKS.md`, `docs/CHANGELOG.md`, `README.md`
- **리포트**: `_workspace/docs_update_{date}.md`

```markdown
# Docs Update Report: {date}

## 갱신된 파일

- docs/TASKS.md: [M0-06] [x] 체크
- docs/CHANGELOG.md: Unreleased/Added에 항목 추가

## 보류 항목 (사용자 승인 대기)

- docs/PRD_TECHNICAL.md: MOD 테이블의 shared/utils 섹션 갱신 필요
```

## 에러 처리

| 상황                      | 대응                                              |
| ------------------------- | ------------------------------------------------- |
| task_id가 TASKS.md에 없음 | CRITICAL — orchestrator에 재확인 요청, 체크 안 함 |
| CHANGELOG.md 없음         | 신규 생성 (템플릿)                                |
| 이미 `[x]` 상태인 ID      | 중복 완료 경고, CHANGELOG 갱신만 진행             |
| category 값이 잘못됨      | 기본 `Changed`로 폴백, 경고 로그                  |

## 주의사항

- **Git 작업 금지** (`.claude/rules/workflow.md`): 커밋·푸시·PR 생성은 사용자 명시 요청 시에만.
- **PRD 자율 수정 금지** (`.claude/rules/autonomy.md`): 반드시 AskUserQuestion 경유.
- 다중 task_id 입력 시 배치 처리 가능 — 각각 TASKS 갱신 + CHANGELOG에 한 라운드로 모아서 추가.

## Should-NOT-trigger (이 스킬을 직접 호출하지 않는 경우)

- **코드 작성·수정**: Feature 구현은 `blog-dev` 오케스트레이터 → `compound-engineering` 사이클
- **마일스톤 완료 검증**: `milestone-gate` 스킬이 담당 (태스크 완료와 마일스톤 게이트는 별개)
- **GC·하네스 평가**: `garbage-collection` 스킬
- **MDX 포스트 작성**: `content-writing` 스킬
- **PRD·ROADMAP 갱신**: `autonomy.md` 상 사용자 승인 필수 — 이 스킬의 자율 범위 밖

이 스킬은 `compound-engineering` DOCUMENT Phase에서 `docs-generator` 에이전트가 자동 호출하는 것이 표준 경로. 사용자가 직접 "TASKS 체크해줘", "CHANGELOG 추가해줘" 요청 시에도 트리거.
