---
description: TDD 워크플로우 및 테스트 컨벤션
paths: ["src/**/*.test.ts", "src/**/*.test.tsx"]
---

# 테스트 규칙

## 테스팅 트로피 전략

> "Write tests. Not too many. Mostly integration." — Kent C. Dodds

- **통합 테스트 중심**: 컴포넌트·훅·유틸리티를 함께 렌더링하여 사용자 시나리오 테스트 (가장 많이)
- **단위 테스트는 선별적**: 순수 유틸리티 함수, 복잡한 비즈니스 로직의 엣지 케이스만
- **정적 테스트는 자동**: TypeScript strict + ESLint가 담당
- **100% 커버리지 지양**: Use Case 커버리지를 우선

## TDD 워크플로우

1. **Red**: 실패하는 테스트 작성
2. **Green**: 테스트를 통과하는 최소 코드 작성
3. **Refactor**: 코드 정리, 테스트는 계속 통과해야 함

## 파일 위치

- 테스트 파일은 대상 디렉토리 내 `__tests__/[파일명].test.ts(x)` 에 배치
- 예: `services/authService.ts` → `services/__tests__/authService.test.ts`

## 컨벤션

- `describe`/`it` 설명은 한국어
- `userEvent`를 `fireEvent`보다 우선 사용
- RTL 쿼리 우선순위: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`
- 외부 의존성만 모킹, 내부 모듈은 실제 구현 사용
