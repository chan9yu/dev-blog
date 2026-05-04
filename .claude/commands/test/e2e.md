---
description: Playwright MCP를 이용한 E2E 테스트 진행 및 테스트 코드 검증
arguments:
  - name: target
    description: "테스트 대상 마일스톤 또는 feature (예: M1, M2, M3, auth, video). 미지정 시 현재 완료된 마일스톤 전체"
    required: false
---

# E2E 테스트 — Playwright MCP

ultrathink

## 테스트 대상 결정

$ARGUMENTS가 주어지면:

- 마일스톤 번호(M1~M7)이면: 해당 마일스톤의 구현 범위
- feature 이름이면: 해당 feature의 구현 범위

$ARGUMENTS가 없으면:

- `docs/ROADMAP.md`를 읽어 현재 **완료** 상태인 마일스톤을 파악
- 완료된 마일스톤의 구현사항을 E2E 테스트 대상으로 선정

## 사전 준비

1. `docs/ROADMAP.md`를 읽어 대상 마일스톤의 구현 범위를 파악한다
2. `docs/PRD_PRODUCT.md`·`docs/PRD_TECHNICAL.md`를 읽어 FEAT-\*·RT-\* 요구사항을 파악한다
3. 개발 서버가 실행 중인지 확인하고, 실행 중이 아니면 사용자에게 `pnpm dev` (port 3100)를 실행하라고 안내한다

## E2E 테스트 시나리오 작성 및 실행

Playwright MCP 도구를 사용하여 실제 브라우저에서 테스트합니다.

### 마일스톤별 테스트 시나리오 (chan9yu 개발 블로그)

#### M0: Foundation (라우팅 쉘)

- RT-\* 14종 라우트가 404 없이 렌더: `/`, `/posts`, `/posts/[slug]`, `/tags`, `/tags/[tag]`, `/series`, `/series/[slug]`, `/about`, `/rss`, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/og?title=test`, `/api/views`
- Header/Footer/Container 레이아웃 정상 렌더
- 테마 토글이 light/dark 전환 (View Transitions 동작)

#### M1: UI Skeleton (더미 데이터)

- **홈 → 포스트 목록**: `/` → Featured/Recent 섹션 → 포스트 카드 클릭 → `/posts/[slug]` 이동
- **포스트 목록 → 상세**: `/posts` → 카드 목록 → 상세 페이지 TOC·reading time 표시
- **태그 네비게이션**: `/tags` 허브 → 트렌딩 태그 클릭 → `/tags/[tag]` 태그별 포스트 목록
- **시리즈 네비**: `/series/[slug]` → 시리즈 포스트 목록 → 이전/다음 편 네비게이션
- **검색 모달**: 헤더 검색 버튼 or ⌘K → 모달 오픈 → 쿼리 입력 → 결과 렌더 → ESC로 닫기
- **About 페이지**: `/about` → 저자 소개 MDX 렌더

#### M2: 콘텐츠 파이프라인 (실데이터 MDX)

- **MDX 렌더**: `/posts/[slug]` → 실제 MDX 본문 → 코드블록 shiki 하이라이팅 → heading에 anchor
- **TOC 동기화**: 스크롤 시 현재 heading 하이라이트
- **Related posts**: 포스트 하단에 같은 태그 포스트 3건 노출

#### M3: 검색 (Fuse.js)

- **인덱스 빌드**: 빌드 후 `public/search-index.json` 존재 확인
- **퍼지 매칭**: 오타 허용 검색 (예: "reactt" → React 포스트 매칭)
- **키보드 네비**: ↑↓ 화살표로 결과 선택, Enter로 이동

#### M4: 조회수 (Vercel KV)

- **카운팅**: 포스트 진입 시 `/api/views` POST → 카운트 +1
- **Rate limit**: 동일 IP의 1분 내 반복 호출 차단
- **표시**: 포스트 카드·상세 페이지에 조회수 렌더

#### M5: 라이트박스·코드블록

- **이미지 확대**: MDX 이미지 클릭 → 라이트박스 오픈 → ESC/배경 클릭으로 닫기
- **코드블록 복사**: 복사 버튼 → 클립보드 → "복사됨" 토스트

#### M6: 댓글 (Giscus)

- **지연 로드**: 스크롤이 댓글 영역에 도달 시에만 iframe 마운트
- **테마 동기화**: 다크모드 전환 시 Giscus 테마도 전환

#### M7: 폴리시·성능·SEO

- **Lighthouse**: 주요 페이지 점수 > 90 (Performance, Accessibility, Best Practices, SEO)
- **메타데이터**: 각 페이지 OG 이미지 1200×630, title·description 존재
- **Sitemap/RSS**: XML 파싱 성공, 최신 포스트 포함

## 테스트 실행 방법

Playwright MCP 도구를 활용합니다:

1. `mcp__playwright__browser_navigate`로 페이지 이동
2. `mcp__playwright__browser_snapshot`으로 현재 페이지 상태 캡처
3. `mcp__playwright__browser_click`으로 요소 클릭
4. `mcp__playwright__browser_fill_form`으로 폼 입력
5. `mcp__playwright__browser_press_key`로 키보드 입력
6. `mcp__playwright__browser_wait_for`로 비동기 요소 대기
7. `mcp__playwright__browser_take_screenshot`으로 스크린샷 촬영

## 테스트 코드 검증

E2E 테스트 후, 기존 유닛/통합 테스트 코드도 검증합니다:

1. `pnpm exec vitest run` 전체 테스트 실행
2. 실패하는 테스트가 있으면 원인 분석
3. 테스트가 실제 요구사항을 올바르게 검증하는지 확인:
   - 테스트가 구현이 아닌 **동작**을 검증하는가
   - 엣지 케이스가 커버되어 있는가
   - 모킹이 과도하지 않은가
   - 테스트 설명이 명확한가

## 결과 보고 형식

```
## E2E 테스트 결과

### 테스트 환경
- URL: http://localhost:3100
- 대상 마일스톤: [M0~M7]

### 시나리오별 결과

| 시나리오 | 상태 | 비고 |
|----------|------|------|
| 회원가입 플로우 | PASS/FAIL | |
| 로그인 플로우 | PASS/FAIL | |
| ... | | |

### 발견된 이슈
- [심각도: Critical/High/Medium/Low] 설명
  - 재현 경로: ...
  - 스크린샷: (있으면 첨부)

### 테스트 코드 검증 결과
- 전체 테스트: X개 통과 / Y개 실패
- 커버리지 부족 영역: ...
- 테스트 품질 이슈: ...

### 권장사항
- ...
```

## 주의사항

- 개발 서버가 반드시 실행 중이어야 한다 (http://localhost:3100)
- `milestone-gate` 스킬이 Playwright로 마일스톤 Exit 기준을 자동 검증하므로, 이 커맨드는 **사용자가 수동으로 특정 시나리오만 확인**할 때 사용
- localStorage 상태에 의존하는 테스트는 각 시나리오 시작 전 초기화를 고려한다
- 네트워크 요청이 포함된 테스트는 적절한 대기 시간을 설정한다
- 스크린샷은 실패한 시나리오에서만 촬영한다
