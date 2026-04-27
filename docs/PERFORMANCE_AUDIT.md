# Performance Audit Guide

> M6-13 검증 절차. Lighthouse Performance >= 95 목표 (NFR-004).
> CI/CD 자동화는 M7-10 영역. 본 문서는 **수동 측정 절차**와 **결과 기록 템플릿**을 제공한다.

## 측정 환경

- 브라우저: Chrome (최신 안정 버전)
- 모드: Incognito (확장 프로그램 영향 차단)
- 디바이스: Mobile Moto G Power (Lighthouse 기본 emulation)
- 네트워크: Slow 4G throttling
- CPU throttling: 4x slowdown
- 측정 대상 환경: **production 빌드** (`pnpm build && pnpm start`)

## 측정 절차

```bash
pnpm build
pnpm start
```

1. Chrome에서 `http://localhost:3000` 접속
2. DevTools → Lighthouse 탭
3. **Categories**: Performance, Accessibility, Best Practices, SEO 체크
4. **Mode**: Navigation (Default)
5. **Device**: Mobile
6. "Analyze page load" 실행
7. 동일 페이지를 **3회 측정**, 중앙값 채택 (단일 측정은 분산 큼)

## 측정 라우트 (필수)

| 경로                 | 카테고리            | 비고                       |
| -------------------- | ------------------- | -------------------------- |
| `/`                  | 홈 (LCP·CLS 핵심)   | 첫 PostCard priority 검증  |
| `/posts`             | 목록                | 무한스크롤·필터 INP        |
| `/posts/{샘플 slug}` | 상세 (CLS·LCP 핵심) | thumbnail priority 적용 면 |
| `/tags`, `/series`   | 허브                |                            |
| `/about`             | 정적                |                            |

## 합격 기준

| Metric                    | 목표         | 출처     |
| ------------------------- | ------------ | -------- |
| Performance Score         | >= 95        | NFR-004  |
| LCP (Largest Contentful)  | < 2.5s       | NFR-001  |
| CLS (Cumulative Layout)   | < 0.1        | NFR-002  |
| INP (Interaction to Next) | < 200ms      | NFR-003  |
| FOUT (Font swap delay)    | < 100ms      | NFR-006  |
| First Load JS (홈)        | < 120KB gzip | NFR-005  |
| Accessibility Score       | >= 95        | M6-02~07 |
| Best Practices Score      | >= 95        |          |
| SEO Score                 | 100          | M5 완료  |

## 결과 기록 템플릿

CHANGELOG의 M6 섹션에 다음 표를 채워 기록한다.

```markdown
**Lighthouse 측정 결과 (mobile, Slow 4G, 중앙값 of 3)**:

| 라우트        | Perf | A11y | Best | SEO | LCP  | CLS  | INP   |
| ------------- | ---- | ---- | ---- | --- | ---- | ---- | ----- |
| /             | 96   | 98   | 100  | 100 | 1.8s | 0.02 | 145ms |
| /posts        | -    | -    | -    | -   | -    | -    | -     |
| /posts/{slug} | -    | -    | -    | -   | -    | -    | -     |
```

## 자주 보이는 회귀 신호

- **LCP > 2.5s**: 첫 화면 이미지에 `priority` 누락 또는 `next/image` 미사용. PostCard·posts/[slug] thumbnail 점검.
- **CLS > 0.1**: 이미지 width/height 누락, 폰트 swap 시 metric 변화. MdxImage가 dimension 미지정 (M4 후속).
- **INP > 200ms**: 무거운 클라이언트 컴포넌트가 초기 hydrate. SearchModal·CommentsSection·ImageLightbox lazy 확인.
- **First Load JS > 120KB gzip**: framer-motion·fuse.js 직접 import. dynamic 분리 검토.

## Production 검증 (M7 시점)

배포 후 24시간 동안 **Vercel Speed Insights** 대시보드에서 p75 mobile 메트릭 관찰. 로컬 Lighthouse는 단일 디바이스 시뮬레이션이라 실제 사용자 분포와 차이 가능.

- M6-14 도입 시 Speed Insights 자동 수집 시작
- 첫 deploy 후 24h CWV 확인은 M7-11

## 도구 도입 결정 (보류)

- **`@lhci/cli` (Lighthouse CI)**: PR마다 자동 측정. M6에서는 도입 보류 (M7-10 CI/CD 파이프라인 영역)
- **`web-vitals` 라이브러리**: 클라이언트 RUM. `@vercel/speed-insights`로 갈음
