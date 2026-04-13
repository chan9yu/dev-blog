# Rule Violation Patterns

15개 규칙 파일별 자주 발생하는 위반 패턴과 탐지·수정 방법. garbage-collector 에이전트가 이 문서를 체크리스트로 사용.

## project-structure.md

### 위반: feature 간 직접 import

- **탐지**: `from "@/features/{other}/..."` — 한 feature가 다른 feature의 내부 모듈 import
- **수정 제안**: public API(`features/{name}/index.ts`)로 제한, 필요 시 shared로 승격

### 위반: shared가 features를 참조

- **탐지**: `src/shared/**`에서 `@/features/` import
- **수정**: 역전된 의존성 — 타입이나 계약을 shared로 이동, features가 shared를 참조하도록 재배치

## components.md

### 위반: Props를 interface로 선언

- **탐지 정규식**: `interface\s+\w+Props\s*\{`
- **수정**: `type ButtonProps = { ... }` (components.md는 type 사용 권장)

### 위반: 파일당 다중 export

- **탐지**: `.tsx` 파일에 `export`가 2회 이상 (Object.assign 서브 컴포넌트 제외)
- **수정**: 파일 분리 또는 Object.assign 패턴 적용

## react.md

### 위반: useEffect로 상태 파생

- **탐지**: `useEffect` 내부에 `set*` 호출이 있고, 의존성이 모두 props/state
- **수정**: `useMemo`로 교체

### 위반: 명명되지 않은 인라인 함수 Props

- **탐지**: `onClick={() => ...}` 인라인 화살표가 memo된 자식에 전달
- **수정**: `const handleClick = useCallback(...)` 추출

## typescript.md

### 위반: any 타입

- **탐지**: `:\s*any\b` 또는 `<any>`
- **수정**: 명시적 타입 또는 `unknown` + narrowing

### 위반: 불필요한 as 단언

- **탐지**: `\bas\s+[A-Z]\w+` (as const 제외)
- **수정**: 타입 가드 함수나 satisfies 연산자

### 위반: I prefix 인터페이스

- **탐지**: `interface\s+I[A-Z]`
- **수정**: 접두사 제거, 가능하면 type으로 전환

## styling.md

### 위반: 인라인 style 사용

- **탐지**: `style=\{\{`
- **수정**: Tailwind 클래스 또는 CSS 변수

### 위반: 전역 CSS 경로 오용

- **탐지**: `globals.css` import가 `app/layout.tsx` 이외 파일에서
- **수정**: layout.tsx 한 곳에서만 import

## shadcn.md

### 위반: shadcn 컴포넌트 barrel import

- **탐지**: `from "@/shared/components/ui"` (디렉토리)
- **수정**: 직접 경로 import (`from "@/shared/components/ui/button"`)

### 위반: shadcn 컴포넌트 파일명이 kebab-case

- **탐지**: `src/shared/components/ui/*.tsx` 중 소문자-하이픈 파일명
- **수정**: PascalCase.tsx로 리네임 (shadcn.md 규약)

## a11y.md

### 위반: 이미지 alt 누락

- **탐지**: `<img[^>]*(?!alt=)` 또는 `<Image[^>]*(?!alt=)`
- **수정**: alt 속성 추가, 장식용은 `alt=""`

### 위반: 커스텀 버튼에 role 누락

- **탐지**: `<div[^>]*onClick` (시맨틱 button 대신 div에 핸들러)
- **수정**: `<button>` 사용, 불가 시 `role="button"` + `tabIndex={0}` + keydown 핸들러

### 위반: 폼 에러에 aria-describedby 누락

- **탐지**: `<input[^>]*(?!aria-describedby)` + 근처에 error 메시지
- **수정**: 에러 엘리먼트 id와 aria-describedby 연결

## theme.md

### 위반: next-themes enableColorScheme 활성화

- **탐지**: `enableColorScheme=\{true\}` 또는 속성 누락 (기본값 true)
- **수정**: `enableColorScheme={false}` 명시

### 위반: color-scheme을 inline style로

- **탐지**: `style=\{.*colorScheme.*\}`
- **수정**: globals.css의 `.dark` 선택자로 이동

## testing.md

### 위반: 구현 세부 테스트

- **탐지**: `container\.querySelector`, `wrapper\.find`, state 직접 assertion
- **수정**: Testing Library의 사용자 중심 쿼리(`getByRole`, `getByText`)

### 위반: 한국어 describe/it 누락

- **탐지**: 프로젝트 testing.md는 한국어 테스트 설명 규약
- **수정**: 영어 서술을 한국어로 전환

## workflow.md

### 위반: 무단 커밋/푸시

- **탐지**: 사용자 명시 요청 없이 `git commit` 실행한 로그
- **수정**: 재발 방지 — orchestrator의 ESCALATE 조건에 추가

### 위반: setTimeout으로 이슈 우회

- **탐지**: `setTimeout.*\d+` (특히 200ms 미만 임의 지연)
- **수정**: 근본 원인 분석 후 재설계

## mdx-content.md

### 위반: frontmatter 필수 필드 누락

- **탐지**: MDX 파일 파싱 후 title/description/date/tags 중 1개라도 없음
- **수정**: content-engineer에게 보강 요청

### 위반: 언어 태그 없는 코드블록

- **탐지**: ` ``` ` (언어 지정 없음)
- **수정**: 해당 코드 분석해 tsx/ts/bash/json 등 지정

### 위반: heading 계층 건너뛰기

- **탐지**: `##` 다음에 `####` 등장
- **수정**: 계층 복원 또는 `###`으로 강등

## seo.md

### 위반: description 길이 범위 외

- **탐지**: frontmatter.description 길이 < 120 또는 > 160
- **수정**: content-engineer에 재작성 요청

### 위반: slug 패턴 위반

- **탐지**: `[^a-z0-9-]` — 대문자나 한글 포함
- **수정**: 소문자+하이픈으로 변환 + 301 리다이렉트 제안

### 위반: canonical 미설정 시리즈 포스트

- **탐지**: frontmatter.series 있는데 canonical 없음
- **수정**: 1편 URL로 canonical 설정 제안

## autonomy.md

### 위반: 확인 필수 범주 자율 실행

- **탐지**: 히스토리에서 `package.json`·`.claude/rules/*`·`docs/PRD_*` 수정이 AskUserQuestion 없이 발생
- **수정**: 재발 방지 — orchestrator가 해당 범주 진입 전 자동 질의하도록 프롬프트 강화 제안

## 탐지 우선순위

1. **CRITICAL** (빌드·보안 차단): any 타입, 무단 커밋, 하드코딩 시크릿
2. **MAJOR** (기능·품질 영향): frontmatter 누락, a11y 위반, 의존 방향 위반
3. **MINOR** (스타일·개선): 파일명 규약, 테스트 설명 언어

GC 실행 시 CRITICAL은 즉시 수정 시도, MAJOR는 자동 수정 가능 여부 판단, MINOR는 제안만.
