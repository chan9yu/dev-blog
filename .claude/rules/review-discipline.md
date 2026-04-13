---
description: 코드 작성 후 REVIEW 단계 자동 강제 — 컴파운드 사이클 무결성 보장
---

# REVIEW Discipline (리뷰 단계 강제)

## Why

`compound-engineering` 스킬은 `PLAN → EXECUTE → REVIEW(핑퐁 3회) → VALIDATE → DOCUMENT → SYNTHESIZE` 6단계를 정의하지만, LLM이 **"단순 작업"**으로 자체 판단하거나 **빠른 진행 압박**으로 REVIEW를 건너뛰는 회귀가 관측됨. 이 룰은 그 회귀를 차단한다.

### 회고 사례

- **M0-01~06 디자인 토큰**: "단순 CSS 변수"로 자체 판단 → REVIEW 생략 → 사용자가 `colors.ts`/`typography.ts` 불필요 지적
- **M0-09~15 레이아웃 컴포넌트 7개**: "shadcn 사용했으니 충분"으로 자체 판단 → REVIEW 생략 → 사용자가 누락 지적 → 사후 3-way 리뷰 결과 13개 이슈 발견 (a11y skip link, MobileMenu 자동 닫기, NavLink `/` 매칭 버그, type export 위반 등)

## When (트리거)

다음 중 **하나라도 해당하면 REVIEW를 반드시 호출**한다:

1. `src/` 아래 신규 파일 1개 이상 작성
2. 기존 컴포넌트 30줄 이상 수정
3. 의존성 추가가 동반된 작업
4. shadcn 컴포넌트 추가
5. 룰 파일 또는 스킬 파일 수정 (자기 자신 포함)
6. 사용자가 "리뷰" 키워드 명시

## How (3-way 병렬)

EXECUTE 완료 직후, DOCUMENT 진입 **전**:

```
병렬 호출 (Agent tool, 한 메시지에 다중 호출):
├── react-nextjs-code-reviewer  — React 19/Next 16 베스트 프랙티스, 룰 위반
├── a11y-auditor                — WCAG 2.1 AA, 키보드/포커스/대비비
└── feature-dev:code-reviewer   — 일반 코드 품질, SOLID, 룰 인용
```

### 트랙별 조합

| 트랙             | 리뷰어 3-way                                                                  |
| ---------------- | ----------------------------------------------------------------------------- |
| Feature(UI+로직) | react-nextjs-code-reviewer + a11y-auditor + feature-dev:code-reviewer         |
| Feature(로직만)  | react-nextjs-code-reviewer + boundary-mismatch-qa + feature-dev:code-reviewer |
| Feature(UI만)    | react-nextjs-code-reviewer + a11y-auditor + feature-dev:code-reviewer         |
| MDX 콘텐츠       | seo-auditor + a11y-auditor + react-nextjs-code-reviewer                       |
| shadcn 통합      | 위 3-way + shadcn 룰 검토                                                     |

### 결과 처리

리뷰 결과를 받은 후:

1. **Tier 분류**:
   - Tier 1 (Critical): 기능 버그·접근성 차단·룰 위반
   - Tier 2 (품질): a11y 향상·UX·일관성
   - Tier 3 (후속): 다른 태스크에서 처리 가능
2. **사용자에게 보고** + AskUserQuestion으로 수정 범위 결정
3. **수정 적용** → 빌드 재검증
4. **CHANGELOG에 리뷰 결과 요약** 필수 기재
5. **DOCUMENT 진입**

## Self-check (DOCUMENT 진입 전)

다음 체크리스트를 모두 만족해야 DOCUMENT로 진입할 수 있다:

- [ ] EXECUTE 산출물(코드)이 disk에 저장됨
- [ ] `pnpm build` 통과
- [ ] **REVIEW 에이전트 호출 결과가 컨텍스트에 존재함** ← 가장 중요
- [ ] FIX 항목이 있다면 모두 처리됨 (Tier 분리 가능)
- [ ] CHANGELOG에 변경 내역 + 리뷰 결과 요약 포함

## Penalty (위반 시)

REVIEW를 건너뛰고 DOCUMENT/SYNTHESIZE로 직행하면 **사이클 무결성 위반**으로 간주:

- 사용자에게 사후 보고 시 "REVIEW 누락 — 사후 리뷰 진행" 명시
- 즉시 3-way REVIEW 호출하여 누락분 회수
- 같은 패턴이 GC에서 3회+ 누적되면 자동 ESCALATE → 하네스 강제 메커니즘 추가 검토 (예: lefthook post-execute hook)

## 예외 (REVIEW 생략 허용)

- 단일 line 수정 (오타·import 순서·alias 추가 등)
- TASKS.md 체크박스 토글
- CHANGELOG 항목 추가
- 의존성 lock 파일 자동 갱신
- import 경로만 변경 (외부화·alias 변경)

이런 변경은 EXECUTE에 해당하지 않으므로 REVIEW 면제. 단, **30줄 이상 수정 또는 신규 파일 1개 이상 생성**이면 면제 무효.

## 관련 룰

- `.claude/rules/autonomy.md` — 자율 실행 vs 사용자 확인 필수 범주 (REVIEW 강제는 자율 범주의 품질 게이트 역할)
- `.claude/skills/compound-engineering/skill.md` — REVIEW Phase 전체 핑퐁 루프 정의
