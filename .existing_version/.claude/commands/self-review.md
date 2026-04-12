# Self Review

현재 변경사항을 다각도로 리뷰한다.

## 절차

1. `git diff`로 변경사항 확인
2. 아래 관점별로 리뷰 수행
3. 발견된 이슈를 심각도별로 분류하여 보고

## 리뷰 관점

### Frontend Architecture

- Server/Client Component 경계가 적절한가
- feature 간 순환 의존이 없는가
- `app/`에 비즈니스 로직이 들어가지 않았는가
- import 경로가 `@/*` 절대 경로를 사용하는가 (상대 경로 `../`, `./` 사용 금지, barrel file `index.ts` 내부 re-export 제외)
- barrel file(`index.ts`)을 경유하여 import하는가 (내부 파일 직접 접근 금지)

### UX/UI

- 로딩/빈/에러 상태가 모두 처리되었는가
- 모바일 반응형이 적용되었는가
- 시맨틱 HTML을 사용했는가
- 접근성 속성이 적절한가

### Code Quality

- TypeScript strict mode 에러가 없는가
- 미사용 변수/import가 없는가
- `import type`이 적절히 사용되었는가
- 불필요한 주석이 없는가

### Security

- 사용자 입력을 적절히 검증하는가
- XSS 취약점이 없는가
- 민감 정보가 클라이언트에 노출되지 않는가

## 보고 형식

```
## 리뷰 결과

### 심각 (즉시 수정)
- ...

### 권장 (개선 사항)
- ...

### 참고
- ...
```
