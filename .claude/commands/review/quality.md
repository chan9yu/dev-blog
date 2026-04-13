---
description: 전체적인 코드 퀄리티 리뷰를 진행해주세요.
arguments:
  - name: target
    description: "리뷰 대상 (feature 이름 또는 파일 경로, 예: video, auth, src/shared/modules/video). 미지정 시 최근 변경 파일 대상"
    required: false
---

# 심층 코드 퀄리티 리뷰

ultrathink

## 스킬 로드

아래 3개 스킬을 순서대로 호출하여 리뷰 기준을 컨텍스트에 로드하세요:

1. `/vercel-react-best-practices` 스킬 호출
2. `/nextjs-best-practices` 스킬 호출
3. `/frontend-fundamentals` 스킬 호출

## 리뷰 대상 결정

$ARGUMENTS가 주어지면:

- feature 이름이면: `src/features/$ARGUMENTS/` 하위 전체
- 파일/디렉토리 경로이면: 해당 경로

$ARGUMENTS가 없으면:

- `git diff --name-only HEAD~5` 또는 최근 변경된 파일들을 대상으로 선정

## 리뷰 진행 방식

**Agent Teams를 구성하여 병렬로 리뷰를 수행합니다.**

### Team 1: React/Next.js Best Practice 리뷰어

- `react-nextjs-code-reviewer` 에이전트 사용
- 중점: React 19 패턴 준수, hooks 규칙, 컴포넌트 설계, 렌더링 최적화
- `/vercel-react-best-practices`와 `/nextjs-best-practices` 기준 적용
- Next.js App Router 활용도, Server/Client Component 분리, 데이터 페칭 패턴

### Team 2: 코드 품질/구조 리뷰어

- `compound-reviewer` 에이전트 사용
- 중점: 가독성, 응집도/결합도, 유지보수성, 네이밍, 확장성
- `/frontend-fundamentals` 기준 적용
- SOLID 원칙, 안티패턴, 코드 스멜
- `.claude/rules/` 13개 규칙 위반 여부 체크

### Team 3: 경계면/아키텍처 리뷰어

- `boundary-mismatch-qa` 에이전트 사용
- 중점: 3 Laws(app→features→shared 단방향) 준수, 모듈 경계, feature 간 직접 import 금지, shared 도메인 누수
- `.claude/rules/project-structure.md` 기준 적용
- 프로젝트 CLAUDE.md의 제약사항(금지 라이브러리, 직접 구현 요건) 준수 여부

## 리뷰 기준 체크리스트

각 팀은 아래 기준으로 코드를 **10~20회 반복 읽기**하며 심층 분석합니다:

### 가독성

- [ ] 코드 흐름이 위에서 아래로 자연스럽게 읽히는가
- [ ] 함수/컴포넌트 길이가 적절한가 (단일 책임)
- [ ] 조건문/분기가 복잡하지 않은가
- [ ] 다른 개발자가 처음 봐도 이해할 수 있는가

### 네이밍

- [ ] 변수/함수/컴포넌트명이 의도를 명확히 전달하는가
- [ ] boolean은 is/has/should 접두사를 사용하는가
- [ ] 이벤트 핸들러는 handle/on 접두사 패턴을 따르는가
- [ ] 약어 사용이 과도하지 않은가

### 응집도와 결합도

- [ ] 관련 로직이 한 곳에 모여있는가 (응집도)
- [ ] 모듈 간 의존이 최소한인가 (결합도)
- [ ] feature 간 순환 의존이 없는가
- [ ] shared → features 역방향 의존이 없는가

### 확장성

- [ ] 새 기능 추가 시 기존 코드 수정이 최소한인가
- [ ] 적절한 추상화 수준인가 (과도하지도, 부족하지도 않은가)
- [ ] 인터페이스/타입 설계가 변경에 유연한가

### 유지보수성

- [ ] 중복 코드가 있는가 (3회 이상 반복이면 추출 고려)
- [ ] 에러 처리가 일관적인가
- [ ] 매직 넘버/스트링 대신 상수를 사용하는가
- [ ] 타입 안전성이 확보되어 있는가 (any, 타입 단언 최소화)

### React Best Practice

- [ ] Server/Client Component 분리가 적절한가
- [ ] "use client" 선언이 필요한 곳에만 있는가
- [ ] hooks 규칙을 준수하는가 (조건부 호출 금지 등)
- [ ] 불필요한 리렌더링이 없는가
- [ ] Effect가 적절하게 사용되는가 (파생 상태는 렌더 중 계산)
- [ ] React 19 API를 올바르게 활용하는가 (use(), ref prop 등)

### Next.js Best Practice

- [ ] App Router 패턴을 올바르게 활용하는가
- [ ] 라우팅 구조가 적절한가 (Route Groups, Dynamic Routes)
- [ ] 데이터 페칭 전략이 적절한가
- [ ] 메타데이터/SEO가 고려되어 있는가

### 프로젝트 규칙 준수

- [ ] 금지 라이브러리를 사용하지 않는가
- [ ] TypeScript strict mode 규칙을 따르는가
- [ ] Import 순서/경로 규칙을 따르는가
- [ ] 컴포넌트/파일 네이밍 컨벤션을 따르는가

## 결과 보고 형식

모든 팀의 리뷰가 완료되면 다음 형식으로 통합 보고합니다:

```
## 코드 퀄리티 리뷰 결과

### 요약
- 리뷰 대상: [파일/feature 목록]
- 전체 평가: [A/B/C/D/F]
- 핵심 발견사항: [1~3줄 요약]

### 카테고리별 평가

| 카테고리 | 등급 | 주요 피드백 |
|----------|------|------------|
| 가독성 | | |
| 네이밍 | | |
| 응집도/결합도 | | |
| 확장성 | | |
| 유지보수성 | | |
| React Best Practice | | |
| Next.js Best Practice | | |
| 프로젝트 규칙 준수 | | |

### 칭찬할 점 (Keep)
- ...

### 개선 제안 (Improve)
- [파일:라인] 설명 — 심각도: High/Medium/Low

### 리팩토링 제안 (Consider)
- ...
```

## 주의사항

- 리뷰만 수행하고 코드 수정은 하지 않는다
- 사소한 스타일 이슈보다 구조적/설계적 문제에 집중한다
- 구체적인 파일명과 라인 번호를 포함하여 피드백한다
- 긍정적인 부분(잘 된 점)도 반드시 포함한다
