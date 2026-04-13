---
description: 개발 워크플로우 및 문제 해결 원칙
---

# 개발 워크플로우

- Pre-commit: lefthook + Lint-staged (자동 린팅/포매팅)
- 커밋: 명시적 요청 시에만, 작은 단위로

## 브랜치 전략 (Git Flow Lite)

**기본 통합 브랜치는 `develop`**. `main`은 프로덕션 릴리스 전용이다.

```
main       ← 프로덕션 릴리스 (보호 브랜치)
  ↑
develop    ← 기본 통합 브랜치, 모든 feature PR의 base
  ↑
feature/M{n}-{slug}  ← 마일스톤 단위 개발 브랜치
```

### 마일스톤 단위 브랜치 규칙

1. **1 마일스톤 = 1 feature 브랜치**
   - 브랜치 이름: `feature/M{n}-{슬러그}` (예: `feature/M0-foundation`, `feature/M1-ui-skeleton`)
   - 해당 마일스톤의 **모든 태스크**가 이 브랜치 위에서 순차 커밋된다
   - 태스크마다 브랜치를 새로 파지 않는다 (과도한 PR 방지)

2. **새 마일스톤의 첫 태스크 진입 시** 브랜치 생성 절차 (반드시 이 순서):

   ```bash
   git checkout develop
   git fetch origin
   git pull origin develop         # 리모트 최신 develop 동기화 필수
   git checkout -b feature/M{n}-{슬러그}
   ```

   - **리모트 최신 develop 기반**이 아니면 진행하지 않는다. 로컬 develop이 뒤처진 상태에서 브랜치를 따면 나중에 PR 머지 충돌 누적.

3. **마일스톤 완료 시** PR 생성:
   - 대상 마일스톤의 모든 TASKS 항목이 `[x]`
   - `milestone-gate` 스킬이 PASS 판정
   - `garbage-collection` 스킬 완료
   - **사용자 명시 요청 시**에만 `gh pr create --base develop --head feature/M{n}-*` 실행
   - PR 제목: `feat: M{n} {마일스톤명} 완료` (예: `feat: M0 Foundation 완료`)

4. **PR 머지 후 정리**:
   - 머지 전략: **squash merge** 기본 (마일스톤 단위 커밋 1개로 압축)
   - 로컬에서 `git checkout develop && git pull origin develop && git branch -d feature/M{n}-*`
   - 원격 브랜치는 GitHub 머지 시 자동 삭제

### 오케스트레이터의 브랜치 체크 로직

`blog-dev` 오케스트레이터는 태스크 실행 **Phase 1 직후**에 브랜치 상태를 확인한다:

```
현재 브랜치 확인 (git rev-parse --abbrev-ref HEAD)
│
├── feature/M{n}-*  (태스크의 마일스톤과 일치)
│   └── 그대로 진행
│
├── feature/M{k}-*  (다른 마일스톤 브랜치)
│   └── 경고: "지금 {k} 브랜치에 있는데 {n} 태스크 요청입니다. 확인?"
│   └── AskUserQuestion
│
├── develop or main
│   └── "새 마일스톤 시작. feature/M{n}-* 생성 필요. 실행?"
│   └── AskUserQuestion → 승인 시 위 "브랜치 생성 절차" 실행
│
└── 기타 (예: 기존 다른 feature 브랜치)
    └── 사용자에게 상황 보고 후 중단
```

**실제 `git checkout`/`git pull`은 사용자 승인 후에만 실행** (아래 "커밋/PR 절대 금지 규칙" 참조).

### 커밋 단위 규칙

- 마일스톤 브랜치 안에서는 **태스크 단위 커밋** (한 태스크 = 한 커밋 원칙)
- 커밋 메시지: `feat(M{n}-{nn}): {요약}` (예: `feat(M0-06): cn() 유틸리티 추가`)
- 여러 태스크를 묶어 커밋하지 않는다 — `git log`로 태스크 이력을 역추적 가능해야 한다

## ⛔ 커밋/PR 절대 금지 규칙

**코드 수정 후 절대로 자의적으로 커밋하거나 PR을 생성하지 않는다.**

- `git commit`, `git push`, `gh pr create`, `git checkout -b`, `git pull` 등 모든 git 쓰기 작업은 사용자의 **명시적 요청** 시에만 실행한다
- "커밋해줘", "/git:commit", "/git:pr", "/git:branch" 등 직접 요청 없이는 코드만 수정하고 대기한다
- **오케스트레이터의 브랜치 체크 로직도 예외 없음** — "새 마일스톤 시작이니 브랜치 만들까요?" 같은 `AskUserQuestion`으로만 제안하고, 실제 명령은 승인 후 실행
- 대화가 재시작(context 압축 후 재개)되어도 이 규칙은 동일하게 적용된다
- 이전 대화에서 커밋을 진행했다고 해서 현재 대화에서도 자동으로 커밋하는 것은 금지된다

# 문제 해결 원칙

- 근본 원인 분석 후 해결
- 의미 없는 타이머(setTimeout/setInterval)로 이슈 우회 금지
- 임시 플래그 변수 선언으로 이슈 우회 금지
