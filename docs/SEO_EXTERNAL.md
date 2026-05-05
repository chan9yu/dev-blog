# 외부 SEO 인프라 체크리스트

이 문서는 **코드 변경으로는 해결할 수 없는** SEO 작업을 정리합니다. 사용자가 직접 수행해야 합니다. 모든 기술 SEO(메타데이터·OG·sitemap·RSS·JSON-LD·llms.txt·robots)는 이미 코드에 구현되어 있으므로, 여기서는 **검색 엔진 등록·외부 권위·모니터링**에 집중합니다.

> 목표: chan9yu.dev의 모든 아티클이 Google 첫 페이지에 노출되는 도메인으로 성장

---

## 1. 검색 엔진 등록 (한 번만, 즉시)

### Google Search Console (필수)

1. https://search.google.com/search-console 접속
2. 속성 추가 → **도메인 속성** (`chan9yu.dev`) 선택
3. DNS TXT 레코드로 소유권 확인
4. **Sitemap 제출**: `Sitemaps` 메뉴 → `https://chan9yu.dev/sitemap.xml` 등록
5. **Indexing API** (선택): 신규 포스트 발행 시 즉시 색인 요청

**검증**: 24~48h 후 `색인 생성됨` 카운트가 0보다 큰지 확인.

### Bing Webmaster Tools (필수 — Copilot/Perplexity 일부 source)

1. https://www.bing.com/webmasters 접속
2. GSC에서 자동 import 또는 수동 추가
3. Sitemap 제출: `https://chan9yu.dev/sitemap.xml`

### Naver Search Advisor (한국 트래픽 필수)

1. https://searchadvisor.naver.com 접속
2. 사이트 등록 → HTML 파일/태그 인증
3. 자동 수집 요청 + sitemap 제출
4. **수집 요청 → RSS** 등록도 별도 진행 (`https://chan9yu.dev/rss`)

### Daum Webmaster Tools (선택)

다음 검색 점유율은 낮지만 등록 비용 0. 한국 백링크 source 다양화에 도움.

---

## 2. AI 검색 가시성 (인용 후보 진입)

> 코드 측 인프라(llms.txt·AI 크롤러 명시 robots) 도입은 효과 검증 부족으로 보류. 자세한 회고는 `.claude/rules/seo.md` 하단 참조. AI 가시성은 현재 wildcard `User-Agent: *` 정책(전체 허용)으로 충분히 확보됨 — 인용 자체는 콘텐츠 품질·외부 권위 source가 결정.

### AI 답변 엔진 직접 테스트 (월 1회)

다음 쿼리를 ChatGPT(검색 ON)·Perplexity·Claude(검색 ON)·Google AI Overviews에 입력:

```
- WebRTC PeerConnection 동작 원리
- React 19 use 훅
- Next.js App Router metadata 베스트 프랙티스
- MQTT QoS 레벨 설명
- 항해플러스 프론트엔드 후기
```

답변에 chan9yu.dev가 source로 인용되는지 기록.

### AI Visibility 모니터링 도구 (선택)

| 도구       | URL                 | 비고                                                      |
| ---------- | ------------------- | --------------------------------------------------------- |
| Otterly AI | https://otterly.ai  | ChatGPT, Perplexity, Google AI Overviews — 무료 tier 있음 |
| Peec AI    | https://peec.ai     | 5개 플랫폼 전수 — 유료                                    |
| ZipTie     | https://ziptie.dev  | Brand mention 추적                                        |
| LLMrefs    | https://llmrefs.com | SEO 키워드 → AI 가시성 매핑                               |

**최소 권장**: 무료 tier로 월 1회 핵심 키워드 10개 모니터링.

---

## 3. 백링크 / 도메인 권위 빌드 (지속)

velog는 도메인 권위(DA 70+)가 압도적이라 같은 키워드를 두고 단일 포스트 vs 단일 포스트 경쟁 시 우리가 불리합니다. 이를 상쇄하려면 **외부 권위 source의 인용**이 필요합니다.

### 크로스 포스팅 (canonical 유지)

**중요**: `<link rel="canonical">`을 항상 chan9yu.dev로 유지 — 그래야 SEO 권위가 우리 도메인에 누적됩니다.

| 플랫폼   | URL                       | canonical 설정 방법                                                                                                         |
| -------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| dev.to   | https://dev.to/new        | 글 발행 시 `Canonical URL` 필드에 `https://chan9yu.dev/posts/{slug}` 입력                                                   |
| Medium   | https://medium.com        | `Story settings → SEO settings → Custom canonical link`                                                                     |
| Hashnode | https://hashnode.com      | 글 작성 시 `Original article URL` 필드                                                                                      |
| velog    | https://velog.io/@chan9yu | velog는 canonical 미지원 → 새 포스트는 cross-post하지 않거나, **본문 상단에 "원문: https://chan9yu.dev/posts/{slug}" 명시** |

**전략**: 모든 신규 포스트는 chan9yu.dev에 먼저 발행 → 1주 후 dev.to/Medium에 canonical 유지 cross-post (Google이 원문 인덱싱 후 중복 처리).

### 한국 개발자 커뮤니티 공유

| 채널                                 | 적합 콘텐츠                      |
| ------------------------------------ | -------------------------------- |
| https://news.hada.io                 | 기술 deep-dive, 회고, AI 관련 글 |
| Disquiet (https://disquiet.io)       | 1인 개발 회고, 사이드 프로젝트   |
| 페이스북 그룹 "프론트엔드 개발 그룹" | 주요 프론트엔드 글               |
| OKKY (https://okky.kr)               | 커리어/회고 글                   |
| Reddit r/koreanlanguage, r/WebDev    | 영문 글 발행 시                  |

### 영문 커뮤니티

WebRTC/React deep-dive 글을 영문으로 작성하면:

| 채널                                       | 적합 콘텐츠                        |
| ------------------------------------------ | ---------------------------------- |
| Hacker News (https://news.ycombinator.com) | "Show HN" 또는 deep technical post |
| Reddit r/webdev, r/reactjs, r/typescript   | 카테고리별                         |
| Lobste.rs                                  | 기술 깊이 있는 글                  |
| Frontend Weekly newsletter                 | 기고 (구독자 50k+)                 |

### 위키피디아 / 한국어 위키

해당 영역(WebRTC, React 등)에 정확한 정보 기여 + 본인 글 외부 링크 인용 (단, **공정한 third-party reference**일 때만 — self-promotion 금지). 위키 백링크는 가장 강력한 권위 source.

---

## 4. 정기 모니터링 (월 1회 권장)

### Core Web Vitals 측정

- **PageSpeed Insights**: https://pagespeed.web.dev (모바일 LCP < 2.5s, INP < 200ms, CLS < 0.1)
- **Vercel Analytics + Speed Insights**: 이미 활성화됨 (`src/app/layout.tsx`)
- **GSC Core Web Vitals 리포트**: 실제 사용자 데이터 (Field Data)

### GSC 모니터링 항목

- **Performance** → 평균 위치, 클릭 수, 노출 수 (월별 추세)
- **Coverage** → 색인 생성됨 vs 제외됨 비율
- **Enhancements** → BlogPosting / FAQPage / HowTo / BreadcrumbList valid 카운트
- **Sitemaps** → `submitted` vs `indexed` 일치 여부

### 키워드 추적

GSC `Performance → Queries`에서 다음을 확인:

- 우리 포스트에 타깃 키워드(WebRTC, React 19 등)로 노출되는가?
- 평균 위치(avg position)가 30위 이하면 → 콘텐츠 보강 필요
- 평균 위치가 11~20위면 → CTR 개선(메타 description, OG 이미지) + 내부 링크 강화

---

## 5. 콘텐츠 클러스터 전략 (지속)

### 시리즈화 강화

이미 구축된 패턴 (예: "WebRTC 박살내기" 4부작 + 단독 1편). 새 주제도 시리즈로 묶어 발행:

- "React 19 시리즈" — use 훅, Actions, Compiler, Server Components
- "Next.js App Router 시리즈" — Routing, Server Actions, Caching, Metadata
- "TypeScript 6 시리즈" — strict 패턴, type narrowing, generics

**Why**: 시리즈는 내부 링크 자산을 형성 → topic authority 신호 → 같은 도메인 내 multiple 포스트가 1페이지 동시 노출 가능 (sitelinks).

### Featured Snippet 대상화

본문 내에서 다음 패턴을 의식적으로 사용 (frontmatter schema 통한 자동 JSON-LD 주입은 효과 검증 부족으로 도입 보류):

- **명확한 정의 단락** — "WebRTC란 무엇인가?" 같은 질문에 대한 답을 첫 단락에 한 문장으로 직답
- **번호 매기기 step-by-step** — "How to" 검색 의도에 부합
- **비교 표** — "X vs Y" 검색 의도에 직접 매칭
- **`##` heading을 자연어 질문 형태로** (예: "WebRTC는 어떻게 NAT를 우회할까?")

→ Google이 본문에서 직접 추출. schema markup 없이도 Featured Snippet 자격.

### 내부 링크 강화

본문에서 다음 3가지를 의식적으로 사용:

1. **연관 시리즈 링크**: "WebRTC #2"에서 "WebRTC #1"·"#3"을 본문 첫/마지막 단락에 자연스럽게 인용
2. **태그 페이지 링크**: 핵심 개념을 처음 언급할 때 `/tags/webrtc` 등으로 wikipedia처럼 연결
3. **카테고리 hub 링크**: "더 많은 React 글 보기" 같은 fold-down link

---

## 6. 기술 SEO 정합성 (자동 — 변경 시 점검)

이미 빌드 게이트로 강제되는 항목들 (`scripts/validate-frontmatter-seo.mjs`):

- title ≤ 60자
- description 80~160자 (검색 스니펫 잘림 방지 + 본문 자동 추출 방지)
- slug 영문 소문자·숫자·하이픈만
- slug ↔ 디렉토리명 일치

위반 시 `pnpm build` 자동 실패. 새 포스트 발행 시 별도 점검 불요.

---

## 7. 가까운 미래 작업 (다음 사이클 권장)

이번 사이클에서 인프라(코드)는 완성됐지만 **콘텐츠 보강**은 별도 사이클이 필요합니다:

- **D1**: WebRTC 시리즈 5편에 `faq`/`howTo` frontmatter 필드 추가 → 자동으로 FAQPage/HowTo JSON-LD 적용
- **D2**: 본문 첫 단락에 핵심 키워드(예: "WebRTC", "RTCPeerConnection") 자연스럽게 명시 (Google 첫 단락 키워드 가중치)
- **D3**: 시리즈 내부 상호 링크 강화 — 각 편 시작/끝에 다른 편 1~2개 링크 자연 삽입

→ 다음 대화에서 `content-engineer 에이전트로 WebRTC 시리즈 D1~D3 진행해줘`라고 요청.

---

## 8. 회고 — 도메인 권위 어떻게 따라잡을 것인가

velog 같은 platform 도메인을 단일 1인 도메인으로 100% 따라잡는 것은 비현실적입니다. 그러나 다음 3가지를 충실히 누적하면 **특정 키워드(특히 long-tail)에서는 충분히 우위 가능**합니다:

1. **콘텐츠 깊이** — velog의 일반 글보다 더 정합한 deep-dive (이미 WebRTC 시리즈가 좋은 예)
2. **기술 SEO 우위** — JSON-LD(WebSite/Organization/Person/BlogPosting/Breadcrumb/CreativeWorkSeries/FAQ/HowTo) 8종 vs velog 0종
3. **외부 권위 source 활용** — Wikipedia, dev.to(canonical), Hacker News, 한국 개발자 newsletter 인용 누적

**6개월 목표**: long-tail 키워드(예: "WebRTC RTCPeerConnection 이벤트 흐름") 1페이지 진입 → 12개월 목표: 일반 키워드(예: "WebRTC") 1페이지 진입.

---

## 관련 문서

- `.claude/rules/seo.md` — 기술 SEO 룰 (코드 작성 기준)
- `docs/PRD_TECHNICAL.md` §10 — SEO 기술 계약
- `src/shared/seo/` — 메타데이터·JSON-LD 빌더 구현
- `scripts/validate-frontmatter-seo.mjs` — 빌드 타임 검증
