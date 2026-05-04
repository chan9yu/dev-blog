---
title: Product PRD — chan9yu 개발 블로그
version: 0.3.0
lastUpdated: 2026-04-12
owner: chan9yu
status: Draft
---

# Product PRD — chan9yu 개발 블로그

## 1. Executive Summary

**chan9yu 개발 블로그**는 한국어권 소프트웨어 엔지니어를 위한 1인 저자 기술 블로그다. 저자는 React·TypeScript·WebRTC·Next.js를 포함한 프론트엔드 전반의 실무 학습을 문서화하고, 독자는 검색 유입 또는 시리즈 구독 경로로 글을 탐색한다. 본 제품은 세 가지 핵심 가치를 제공한다. (1) **깊이 있는 기술 기록** — 파편적인 팁 대신 완결성 있는 포스트와 연속된 시리즈로 주제를 다룬다. (2) **시리즈 중심 학습 경로** — 관련 포스트가 순서대로 연결되어 독자가 한 주제를 끝까지 따라갈 수 있다. (3) **빠르고 접근성 좋은 독서 경험** — 코드·이미지·수식·표를 포함한 콘텐츠를 어떤 기기에서도 지연 없이 읽을 수 있다.

범위 요약: 콘텐츠 탐색(홈·목록·태그·시리즈), 읽기 경험(포스트 상세·TOC·관련 포스트·라이트박스·테마), 상호작용(검색·댓글·공유·조회수), SEO·메타(sitemap·RSS·OG). 운영은 저자 1인이 GitHub 중심 워크플로우로 수행한다.

**Definition of Done**: 본 섹션을 읽은 사람은 "누구를 위한 제품인지, 무엇을 제공하는지, 무엇을 하지 않는지"를 한 눈에 이해할 수 있다.

## 2. Vision & Goals

### 2.1 Vision

> **"정확한 기술 문서가 독자의 다음 한 걸음을 만든다."**
>
> chan9yu 개발 블로그는 검색으로 도착한 독자가 문제를 해결하고, 시리즈로 머무는 독자가 학습을 완주하도록 돕는 한국어권 프론트엔드 레퍼런스를 지향한다.

### 2.2 시간축 목표

| 범위             | 지표                              | 목표                                                 |
| ---------------- | --------------------------------- | ---------------------------------------------------- |
| 단기 (0~3개월)   | 공개 포스트 수                    | ≥ 20 편                                              |
| 단기             | 핵심 라우트 GA                    | 홈·포스트·태그·시리즈·about·검색·댓글·테마 전부 작동 |
| 중기 (3~12개월)  | 시리즈 수                         | ≥ 5 개                                               |
| 중기             | 월간 UV                           | ≥ 2,000                                              |
| 중기             | 의미 있는 읽기 세션 비율          | 전체 세션의 ≥ 35%                                    |
| 장기 (12~24개월) | 대표 포스트 10편의 검색 유입 비중 | 전체 유입의 ≥ 50%                                    |
| 장기             | 시리즈 완주율                     | ≥ 20%                                                |

각 목표는 §8 Success Metrics의 측정 방법과 매핑된다.

### 2.3 비목표 (상세 §9)

단기·중기 Vision에서 의도적으로 배제되는 항목(다중 저자·뉴스레터·결제·다국어 등)은 §9에 고정한다.

**Definition of Done**: Vision 문장이 한 줄로 암기 가능하고, 목표가 §8 지표와 1:1 매핑된다.

## 3. Target Users & Personas

### 3.1 Persona A — 미드 시니어 프론트엔드 개발자

- **프로필**: 3~7년차 프론트엔드 엔지니어. React·Next.js·TypeScript 실무 중급 이상.
- **유입 경로**: Google 검색 ("React Server Component 캐시", "WebRTC turn 서버 설정" 등)
- **기대 콘텐츠**: 실무 적용 팁, 장애 해결 사례, 성능 최적화 측정치.
- **Top JTBD**
  1. 현재 직면한 문제를 5분 안에 해결 아이디어로 바꾸기.
  2. 익숙한 개념의 최신 패턴·엣지 케이스 확인.
  3. 동료에게 공유할 만한 요약 레퍼런스 찾기.

### 3.2 Persona B — 주니어·취준생

- **프로필**: 1년차 이하 또는 취업 준비 중. React/TS 기본은 알지만 생태계 이해가 얕음.
- **유입 경로**: 시리즈 글 링크, SNS 공유, 태그 허브 탐색.
- **기대 콘텐츠**: 학습 로드맵, 시리즈 완주형 가이드, 에러 메시지 풀이.
- **Top JTBD**
  1. 한 주제를 처음부터 끝까지 순서대로 배우기.
  2. 면접·과제에 나오는 개념을 빠르게 정리하기.
  3. 어려운 내용을 작은 덩어리로 이해하기.

### 3.3 Persona C — 저자 자신

- **프로필**: chan9yu (운영자 겸 저자).
- **사용 시나리오**: 포스트 작성·발행·수정, 과거에 쓴 글 재조회, 포트폴리오 링크 공유, 통계 점검.
- **Top JTBD**
  1. 로컬에서 MDX 파일 하나만 편집해 발행하기.
  2. 6개월 뒤에도 자신의 글을 빠르게 찾기.
  3. 방문 추세·인기 포스트를 한 화면에서 확인하기.

**Definition of Done**: 각 Persona는 한 문단 프로필 + 3개 JTBD를 가지며, §4 User Story가 어떤 Persona를 타겟팅하는지 명시된다.

## 4. User Stories

각 스토리는 다음 형식을 따른다.

- **Story**: `As a <role>, I want <capability>, so that <benefit>.`
- **Persona**: 대상
- **AC (Acceptance Criteria)**: Given / When / Then 3~5개

우선순위: **P0 (M3 GA 전 반드시)**, **P1 (M4 Beta 구간)**, **P2 (M5 이후 또는 Nice-to-have)**.

### 4.1 P0 — Must Have

#### US-001 포스트 목록 탐색 (Persona A·B)

- **Story**: 독자로서, 나는 최신 포스트 목록을 한눈에 훑어보고 원하는 카드를 클릭해 상세로 이동하고 싶다. 그래야 빠르게 관심 주제를 찾을 수 있다.
- **AC**
  - Given 홈(`/`) 또는 `/posts` 진입, When 페이지가 로드되면, Then 최신 포스트 카드가 날짜 내림차순으로 최소 6장(홈) / 전체(`/posts`) 표시된다.
  - Given 카드에 thumbnail이 존재, When 렌더, Then 16:9 비율의 이미지가 지연 없이 노출된다.
  - Given thumbnail이 없는 포스트, When 렌더, Then 텍스트 전용 카드(제목·설명·태그·날짜)로 대체된다.
  - Given 카드 클릭, When 포스트가 private이 아닌 경우, Then `/posts/[slug]`로 이동한다.

#### US-002 포스트 상세 읽기 (Persona A·B)

- **Story**: 독자로서, 나는 포스트 본문을 읽고 목차로 섹션을 이동하며, 코드를 복사하고, 이미지를 확대해 보고 싶다.
- **AC**
  - Given 포스트 상세 진입, When 본문 렌더, Then 메타 헤더(제목·설명·날짜·태그·조회수)가 먼저 보이고 본문이 스트리밍된다.
  - Given 본문 내 `<h2>`·`<h3>` 제목, When TOC 클릭, Then 해당 섹션으로 앵커 스크롤 + URL hash 반영.
  - Given 코드 블록, When 우상단 복사 아이콘 클릭, Then 클립보드 복사 + 2초간 "Copied!" 피드백.
  - Given 본문 이미지 클릭, When 라이트박스 오픈, Then ESC·← → 키로 닫기·이동 가능.
  - Given 포스트 하단, When 스크롤 도달, Then 이전/다음 포스트 + 태그 기반 관련 포스트 3장이 노출된다.

#### US-003 검색 (Persona A·B·C)

- **Story**: 독자·저자로서, 나는 키보드 단축키로 검색창을 열고 실시간으로 결과를 좁혀가며 원하는 포스트에 도달하고 싶다.
- **AC**
  - Given 어떤 페이지, When `⌘K` 또는 `Ctrl+K`, Then 검색 모달이 오픈되고 입력창에 포커스가 맞춰진다.
  - Given 입력창 타이핑, When 200ms 디바운스 후, Then 매칭 포스트 최대 10개가 스코어 순으로 즉시 갱신된다.
  - Given 검색 결과 클릭 또는 Enter, When, Then 해당 포스트로 이동하며 모달이 닫힌다.
  - Given 결과 0건, When 렌더, Then "검색 결과 없음" 안내 + 관련 태그 추천 3개 노출.
  - Given `Esc`, When 모달 열림, Then 모달이 닫히고 포커스가 트리거로 복귀한다.

#### US-004 테마 전환 (Persona A·B·C)

- **Story**: 독자로서, 나는 라이트·다크 테마를 내 선호에 맞게 즉시 전환하고 싶다.
- **AC**
  - Given 첫 방문, When 시스템 테마가 다크, Then 다크 테마로 초기 렌더 (FOUC 없음).
  - Given 테마 토글 클릭, When View Transitions API 사용 가능, Then 부드러운 전환 애니메이션.
  - Given 재방문, When 페이지 로드, Then 마지막 선택이 쿠키·localStorage에서 즉시 복원.

#### US-005 댓글 작성 (Persona A·B)

- **Story**: 독자로서, 나는 포스트 하단에서 GitHub 계정으로 댓글을 남기고 토론하고 싶다.
- **AC**
  - Given 포스트 상세 최하단, When 스크롤 도달, Then Giscus 위젯이 lazy 로드된다.
  - Given 댓글 영역 진입, When 로그인 안됨, Then GitHub 로그인 프롬프트 노출.
  - Given 테마 전환, When 테마 변경, Then Giscus 위젯도 해당 테마로 즉시 갱신.

#### US-006 저자 발행 워크플로우 (Persona C)

- **Story**: 저자로서, 나는 로컬에서 MDX 파일과 이미지를 작성·커밋·푸시하면 자동으로 글이 발행되기를 원한다.
- **AC**
  - Given `contents/posts/{slug}/index.mdx` 추가 또는 수정, When `contents` submodule 머지, Then 배포 파이프라인이 자동 실행.
  - Given frontmatter 스키마 위반, When 빌드, Then 배포가 실패하고 어떤 슬러그·어떤 필드가 문제인지 표준 에러로 출력.
  - Given 이미지 추가 (`contents/posts/{slug}/images/`), When 빌드, Then `public/posts/{slug}/images/`로 자동 복사.

#### US-007 공유 (Persona A·B)

- **Story**: 독자로서, 나는 좋은 포스트를 발견했을 때 링크·텍스트를 빠르게 복사하거나 SNS로 공유하고 싶다.
- **AC**
  - Given 포스트 상세, When "공유" 버튼 클릭, Then 메뉴에서 링크 복사 / X(Twitter) / LinkedIn 선택 가능.
  - Given 네이티브 Web Share API 지원 기기, When 클릭, Then OS 공유 시트 오픈.

#### US-008 포스트 예상 읽기 시간 (Persona A·B)

- **Story**: 독자로서, 나는 포스트 상단의 "예상 읽기 시간"을 보고 지금 읽어볼지 나중으로 미룰지 판단하고 싶다. 그래야 시간 제약이 있을 때 합리적인 선택이 가능하다.
- **AC**
  - Given 포스트 상세 진입, When 본문 렌더, Then 헤더 메타에 `N분` 단위의 예상 읽기 시간이 표시된다.
  - Given 본문 길이, When 계산, Then 공백 포함 일반 텍스트 문자 수를 한국어 500자/분으로 환산하고 올림(ceil)한다.
  - Given 본문에 코드 블록·이미지·수식, When 계산, Then 해당 블록의 문자는 분자에서 제외된다.
  - Given 계산 결과 < 1, When 렌더, Then 최소 `1분`으로 표시된다.
  - Given 서로 다른 길이의 포스트 3편, When 비교, Then 각 포스트별로 서로 다른 값(length-proportional)이 나타난다.

### 4.2 P1 — Should Have

#### US-011 태그 허브 탐색 (Persona A·B)

- **Story**: 독자로서, 나는 태그별로 포스트를 모아 보고 관심 주제를 깊이 파고 싶다.
- **AC**
  - Given `/tags` 진입, When 렌더, Then 모든 태그 카드가 포스트 수 기준 정렬로 표시.
  - Given 태그 카드 클릭, When, Then `/tags/[tag]` 상세에서 해당 태그를 가진 포스트 목록이 날짜 내림차순 표시.

#### US-012 시리즈 허브·상세 (Persona B)

- **Story**: 주니어 독자로서, 나는 한 시리즈를 순서대로 읽고 진행 상황을 확인하고 싶다.
- **AC**
  - Given `/series` 진입, When 렌더, Then 시리즈 카드 + 각 시리즈의 첫 3개 포스트 미리보기 노출.
  - Given `/series/[slug]`, When 렌더, Then `seriesOrder` 오름차순 전체 포스트 + 순서 네비게이션(1/5, 2/5 ...) 표시.
  - Given 포스트 상세가 시리즈 소속, When 렌더, Then 본문 상단 또는 사이드에 시리즈 배지 + 이전/다음 시리즈 포스트 링크 노출.

#### US-013 조회수 표시 (Persona A·C)

- **Story**: 독자·저자로서, 나는 포스트의 대략적 인기를 한 숫자로 확인하고 싶다.
- **AC**
  - Given 포스트 상세 렌더, When 뷰 서비스 응답, Then 조회수가 Suspense fallback → 실제 숫자로 교체.
  - Given 포스트 접속, When 페이지 mount, Then 조회수 +1 POST 호출 (동일 세션 중복 증가 방지는 v1에서 best-effort).
  - Given 뷰 서비스 장애, When 응답 실패, Then `—` 또는 마지막 캐시 값을 표시하고 에러를 사용자에게 노출하지 않는다.

#### US-014 이미지 라이트박스 (Persona A·B)

- **Story**: 독자로서, 나는 본문 이미지를 전체 화면으로 확대해 디테일을 확인하고 싶다.
- **AC**
  - Given 본문 이미지 클릭, When, Then 라이트박스 fade 300ms로 오픈.
  - Given 라이트박스 오픈, When `Esc`·백드롭 클릭, Then 닫기.
  - Given 포스트 내 이미지 N개, When 열림, Then 화살표로 carousel 네비게이션.

#### US-015 관련 포스트 (Persona A·B)

- **Story**: 독자로서, 나는 한 포스트를 다 읽고 자연스럽게 관련 주제의 다음 글로 이어 가고 싶다.
- **AC**
  - Given 포스트 상세, When 렌더, Then 같은 태그 수가 많은 포스트 3장이 "관련 포스트" 섹션에 노출.
  - Given 관련 포스트가 2장 미만, When, Then 섹션 자체를 숨긴다.

#### US-016 홈 Popular 위젯 (Persona A·B·C)

- **Story**: 독자·저자로서, 나는 홈 사이드바에서 가장 많이 읽힌 포스트·풍부한 시리즈·자주 쓰인 태그를 한눈에 확인해 탐색의 진입점을 얻고 싶다.
- **AC**
  - Given 홈(`/`) 진입, When 렌더, Then **Popular Posts** 5건이 누적 조회수 내림차순으로 표시된다.
  - Given 홈 진입, When 렌더, Then **Trending Series** 3건이 (1) 소속 public 포스트 수 내림차순, (2) 동률 시 최근 편 발행일 우선 기준으로 표시된다.
  - Given 홈 진입, When 렌더, Then **Trending Tags** 10건이 public 포스트 수 내림차순으로 표시된다.
  - Given 포스트가 `private: true`, When 집계, Then 그 포스트·소속 태그/시리즈 기여분은 전 집계에서 제외된다.
  - Given 조회수·포스트 수 동률, When 정렬, Then 최근 발행 포스트를 우선한다.
  - Given 대상 항목 수가 기준 개수 미만, When 렌더, Then 존재하는 만큼만 노출한다.
  - Given KV 조회 실패(빌드 시점), When 빌드, Then Popular Posts는 최근 발행순 fallback으로 대체되고 빌드는 성공한다.

### 4.3 P2 — Nice to Have / Future

#### US-021 OG 이미지 동적 생성 — thumbnail 없는 포스트 폴백

- **Story**: 저자로서, 나는 썸네일을 만들지 않은 글이라도 공유 시 깔끔한 OG 이미지가 자동 생성되기를 원한다.
- **AC**
  - Given 썸네일 없는 포스트 URL이 SNS에 공유, When 크롤러 요청, Then `/og?title=...&tag=...`가 1200×630 이미지를 반환.

#### US-022 RSS 구독 UI

- **Story**: 독자로서, 나는 블로그에 RSS 피드가 있다는 것을 쉽게 발견하고 내 리더에 추가하고 싶다.
- **AC**
  - Given 푸터 또는 헤더, When 렌더, Then RSS 아이콘이 `/rss`를 새 탭으로 연다.

#### US-023 검색 추천 키워드

- **Story**: 독자로서, 나는 빈 검색창에서 인기 검색어 / 최근 포스트 추천을 받고 싶다.
- **AC**
  - Given 검색 모달 오픈 직후 입력 비어 있음, When, Then 인기 태그 상위 5개 + 최근 포스트 3개를 추천으로 노출.

**Definition of Done**: 모든 P0 스토리는 §5 Feature와 §4 AC가 1:1 매핑되고, P1·P2는 릴리즈 마일스톤(§10)과 연결된다.

## 5. Feature Specification

각 기능은 다음 형식을 따른다.

- **Purpose**: 사용자가 얻는 가치
- **Primary Actions**: 주요 상호작용
- **UI Requirements**: 노출 요소·반응형·상태
- **Edge Cases**: 빈 상태, 실패, 경계
- **Module Mapping**: 구현 모듈(`MOD-*` / `RT-*`)은 Engineering PRD 참조

### FEAT-HOME (Home Page)

- **Purpose**: 방문자가 진입 1초 내에 이 블로그의 성격과 최근 활동을 파악한다.
- **Primary Actions**: Hero 클릭 → about 이동, 최근 포스트 카드 클릭 → 상세, 사이드바 태그/시리즈 클릭 → 허브 이동.
- **UI Requirements**
  - Hero: 저자 소개 1~2줄 + 프로필 이미지 + CTA (예: "최신 글 보기").
  - 최근 포스트 섹션: 카드 6장, 썸네일 있으면 이미지·없으면 텍스트 카드. 각 카드에 제목·설명·태그·날짜.
  - 사이드바 3 블록 (모두 **빌드 타임 스냅샷** · `ADR-007`)
    - **Popular Posts (5건)**: 빌드 시점 `views:post:{slug}` 누적 조회수 내림차순. 동률 시 최근 발행일 우선.
    - **Trending Series (3건)**: 소속 public 포스트 수 내림차순. 동률 시 최근 편 발행일 우선.
    - **Trending Tags (10건)**: public 포스트 수 내림차순.
    - 모든 블록에서 `private: true` 포스트·해당 포스트의 태그/시리즈 기여분은 집계에서 제외.
- **Responsive**: md 이상 2-column (본문 + 사이드바), md 미만 1-column (사이드바가 본문 아래로 이동).
- **Edge Cases**
  - 포스트 수 < 6: 존재하는 만큼만 표시.
  - 조회수 집계 불가: "Popular Posts" 대신 "Recently Updated" 대체.

### FEAT-POSTS-LIST (`RT-/posts`)

- **Purpose**: 블로그 전체 포스트를 체계적으로 훑어본다.
- **Primary Actions**: 태그 필터 클릭, 그리드/리스트 뷰 토글, 카드 클릭.
- **UI Requirements**
  - 좌측(또는 상단) 태그 필터 패널: 활성 태그 하이라이트, "전체" 리셋 버튼.
  - 뷰 토글: 그리드 아이콘 / 리스트 아이콘, 선택 상태는 localStorage에 저장.
  - 페이지네이션 또는 무한 스크롤 중 **무한 스크롤**: 초기 12장, 스크롤 도달 시 12장 추가.
- **Responsive**: md 이상 좌측 필터, 미만 상단 chip 스타일.
- **Edge Cases**
  - 활성 필터에 해당 포스트 0건: "이 태그로 작성된 포스트가 아직 없어요" 메시지 + 모든 태그로 돌아가기 링크.
  - Suspense fallback: 카드 스켈레톤 6장.

### FEAT-POST-DETAIL (`RT-/posts/[slug]`)

- **Purpose**: 본문을 방해 없이 읽고, 보조 도구(TOC·진행바·공유)로 긴 글의 읽기 부담을 줄인다.
- **Primary Actions**: 스크롤, TOC 클릭, 코드 복사, 이미지 확대, 공유, 댓글 작성, 이전/다음 이동.
- **UI Requirements**
  - 헤더: 제목 (h1) · 설명 · 발행일 · 읽기 시간 · 태그 chip · 조회수 (Suspense).
  - 좌측(lg 이상) sticky TOC. 그 미만은 상단 접힘 TOC.
  - 상단 Reading Progress bar (2px, accent 컬러, GPU scaleX).
  - 우하단 ScrollToTop 버튼 (스크롤 > 400px 시 노출).
  - 본문 아래: 시리즈 네비 (시리즈 소속일 경우) → 이전/다음 포스트 카드 → 관련 포스트 → 공유 버튼 → 댓글.
- **읽기 시간 계산 규칙** (`ADR-008`)
  - 한국어 500자/분(공백 포함) 기준. 본문 내 코드 블록·이미지·수식은 분자에서 제외.
  - 결과는 `Math.ceil(chars / 500)` 후 최소 1분 floor.
  - 계산은 빌드 타임에 1회 수행하고 `PostSummary.readingTimeMinutes` 필드로 고정.
- **Responsive**: lg 미만 TOC는 상단 접힘 Accordion, 본문 패딩 축소.
- **Edge Cases**
  - `private: true` 포스트 직접 URL: 200 렌더하되 `noindex` + 관련·인접 네비에서 제외.
  - TOC 항목이 0개: TOC 섹션 자체 숨김.
  - 코드 블록 언어 미지정: plain text로 렌더.
  - 본문 이미지 404: alt 텍스트 + 깨진 이미지 아이콘.

### FEAT-TAGS-HUB / FEAT-TAG-DETAIL (`RT-/tags`, `RT-/tags/[tag]`)

- **Purpose**: 관심 주제를 1~2 클릭 만에 좁혀서 본다.
- **Primary Actions**: 태그 카드 클릭, 태그 칩 클릭.
- **UI Requirements**: 태그 카드 그리드(3~4 column), 각 카드에 태그명 + 포스트 수. 상세는 필터된 포스트 목록 + 태그 헤더.
- **Edge Cases**: 한글 태그는 URL encoding, 상세 페이지 제목에 decoding 처리.

### FEAT-SERIES-HUB / FEAT-SERIES-DETAIL (`RT-/series`, `RT-/series/[slug]`)

- **Purpose**: 학습 경로를 선택하고 순서대로 완주한다.
- **UI Requirements**
  - 허브: 시리즈 카드에 아이콘, 이름, 총 포스트 수, 첫 3개 포스트 미리보기, "전체 보기" 링크.
  - 상세: 시리즈 헤더(이름·설명·총 편수) + 순서 네비(현재 편/총 편수) + 포스트 목록(`seriesOrder` 오름차순).
- **Edge Cases**: 포스트 1편짜리 시리즈는 허브 카드에서 미리보기 생략하고 즉시 상세 링크로.

### FEAT-ABOUT (`RT-/about`)

- **Purpose**: 저자를 간략히 소개하고 연락/팔로우 경로를 제공한다.
- **UI Requirements**: 프로필 사진 + 이름 + 직무 타이틀 + 소셜 링크(GitHub·LinkedIn·X·이메일) + 마크다운 본문(`contents/about/index.md`).

### FEAT-SEARCH (`MOD-search`)

- **Purpose**: 모든 포스트를 즉시·퍼지(fuzzy) 검색한다.
- **Primary Actions**: 단축키 오픈, 타이핑, 결과 클릭, 닫기.
- **UI Requirements**: 상단 중앙 모달, 상단 입력창, 아래 결과 리스트(제목·설명 하이라이트·태그·날짜), 키보드 화살표로 결과 포커스, Enter 이동.
- **Edge Cases**
  - 결과 0건: "관련 태그" 추천 3개 (`getTrendingTags(3)` 결과).
  - 인덱스 로드 실패: 에러 토스트 + 재시도 버튼 + 검색창은 disabled.

### FEAT-VIEW-COUNTER (`MOD-views`, `RT-/api/views`)

- **Purpose**: 포스트의 대략적 인기를 한 숫자로 제공한다.
- **UI Requirements**: 아이콘 + 숫자. Suspense fallback은 동일 크기의 placeholder.
- **Edge Cases**: KV 실패 시 `—` 표시, 콘솔 경고만 기록(사용자 무영향).

### FEAT-LIGHTBOX (`MOD-lightbox`)

- **Purpose**: 본문 이미지의 세부를 읽을 수 있게 한다.
- **Primary Actions**: 이미지 클릭 → 확대, ESC·백드롭 → 닫기, ←→ → carousel.
- **UI Requirements**: 검은 반투명 오버레이 + 이미지 중앙, 하단 캡션(있는 경우).
- **Edge Cases**: 포스트 내 이미지 1장이면 carousel 버튼 숨김.

### FEAT-THEME (`MOD-theme`)

- **Purpose**: 독자의 선호 환경에 맞춰 읽기 경험을 조정한다.
- **Primary Actions**: 테마 토글 클릭.
- **UI Requirements**: 헤더 우측 아이콘(Sun/Moon). `prefers-reduced-motion`이면 트랜지션 비활성.
- **Edge Cases**: JS 비활성 환경 — SSR에서 쿠키 기반 초기 클래스로 FOUC 방지.

### FEAT-COMMENTS (`MOD-comments`)

- **Purpose**: 독자 상호작용(질문·의견·감사)을 포스트 하단에서 받는다.
- **Primary Actions**: Giscus 위젯을 통한 댓글·답글.
- **Edge Cases**
  - Giscus 스크립트 로드 실패: placeholder 텍스트 "댓글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요." + 재시도 버튼.
  - 포스트가 `private: true`: 댓글 영역 자체 비활성.

### FEAT-NAVIGATION

- **Purpose**: 어디에 있든 주요 섹션으로 1 클릭 내 이동.
- **UI Requirements**
  - 데스크톱: sticky 헤더 — 로고(홈) / Posts / Tags / Series / About / Search icon / Theme toggle.
  - 모바일: 로고 · 햄버거 · 검색 아이콘. 햄버거 → Drawer 슬라이드 인 (같은 메뉴).
- **Edge Cases**: 스크롤 시 헤더가 축소(compact). Drawer 열림 중 body 스크롤 잠금.

### FEAT-READING-AIDS

- **Purpose**: 긴 글을 효율적으로 읽는 보조 도구 묶음.
- **구성 요소**: ReadingProgress(상단 진행바), ScrollToTop(우하단 버튼), TOC (FEAT-POST-DETAIL 내), ScrollReset(페이지 전환 시 스크롤 상단).
- **Edge Cases**: 본문 길이 < 800자일 때 ReadingProgress는 숨김.

### FEAT-METADATA-OG

- **Purpose**: 검색 엔진·SNS 공유 시 최적의 카드 렌더.
- **요건**: 모든 페이지에 title/description/canonical/og/twitter 메타. 포스트 상세는 JSON-LD BlogPosting.
- **Edge Cases**: title 120자 초과 시 `/og` 엔드포인트에서 truncate + ellipsis.

### FEAT-RSS (`RT-/rss`)

- **Purpose**: RSS 리더 구독자에게 전체 포스트를 XML로 제공.
- **요건**: 최신 50편, private 제외, title·link·guid·description·pubDate·author·category(tags).

### FEAT-SITEMAP (`RT-/sitemap.xml`)

- **Purpose**: 검색 엔진 인덱싱 보장.
- **요건**: 정적 페이지 + 모든 public 포스트·시리즈·태그. priority·changefreq는 Engineering §10.4 표 준수.

**Definition of Done**: 각 기능이 사용자 관점의 "가치→상호작용→UI→엣지" 순으로 기록되고, 구현 세부(모듈·API)는 Engineering PRD를 참조한다.

## 6. Information Architecture

### 6.1 사이트맵

```
/
├─ /posts
│  └─ /posts/[slug]
├─ /tags
│  └─ /tags/[tag]
├─ /series
│  └─ /series/[slug]
├─ /about
│
├─ /rss                 (Utility)
├─ /sitemap.xml         (Utility)
├─ /robots.txt          (Utility)
├─ /manifest.webmanifest (Utility)
├─ /og                  (Utility · Edge)
└─ /api/views           (Utility · Runtime)
```

### 6.2 Top Navigation

| 영역            | 항목                            | 대상 경로                              |
| --------------- | ------------------------------- | -------------------------------------- |
| 좌측            | Logo                            | `/`                                    |
| 중앙 (데스크톱) | Posts / Tags / Series / About   | 각 허브                                |
| 우측            | Search icon (⌘K) · Theme toggle | 모달 / 테마 전환                       |
| 모바일          | 햄버거 → Drawer                 | 중앙 메뉴 항목 + 소셜 링크 + 테마 토글 |

### 6.3 푸터

- 저작권 · RSS 아이콘 · 소셜 링크(GitHub·LinkedIn·X·Email) · "맨 위로" 앵커.

**Definition of Done**: 모든 라우트가 Top-nav 또는 1-step deep (카드 클릭) 이내로 도달 가능하다.

## 7. Content Model & Editorial Guidelines

### 7.1 Frontmatter 규칙 (저자 관점)

| 필드          | 타입              | 필수 | 허용값                                 | 예시                                          | 위반 시 빌드                        |
| ------------- | ----------------- | ---- | -------------------------------------- | --------------------------------------------- | ----------------------------------- |
| `title`       | string            | ✓    | 1자 이상                               | `"React Server Component 완전 정복"`          | 실패                                |
| `description` | string            | ✓    | 1자 이상, 권장 40~140자                | `"RSC의 렌더 모델과 실무 엣지케이스"`         | 실패                                |
| `slug`        | string            | ✓    | `^[a-z0-9-]+$`, 디렉토리명과 동일      | `"rsc-deep-dive"`                             | 실패                                |
| `date`        | string (ISO 8601) | ✓    | `YYYY-MM-DD`                           | `"2026-04-12"`                                | 실패                                |
| `private`     | boolean           | —    | true/false (기본 false)                | `false`                                       | —                                   |
| `tags`        | string[]          | —    | 소문자 권장, 공백 허용                 | `["react", "next.js"]`                        | —                                   |
| `thumbnail`   | string \| null    | —    | `/posts/{slug}/images/*` 또는 원격 URL | `"/posts/rsc-deep-dive/images/thumbnail.png"` | —                                   |
| `series`      | string \| null    | —    | 시리즈 이름. `seriesOrder`와 쌍        | `"Next.js 정복기"`                            | `seriesOrder`와 짝 맞지 않으면 실패 |
| `seriesOrder` | integer \| null   | —    | 1 이상 양의 정수                       | `3`                                           | —                                   |

### 7.2 파일 배치

```
contents/
└─ posts/
   └─ {slug}/
      ├─ index.mdx            ← 이 파일 하나만 본문
      └─ images/              ← 본문에서 참조할 이미지
         ├─ thumbnail.png
         └─ diagram-1.png
```

- 디렉토리명과 `frontmatter.slug` 불일치 시 빌드 실패.
- `@template/` prefix 디렉토리는 무시.

### 7.3 본문 작성 가이드

- **코드 블록**: 언어 힌트 필수 (` `ts `, ` `bash `). 없으면 plain text.
- **이미지**: 모든 `<img>` 또는 MDX Image에 `alt` 필수. 캡션은 `*figure: ...*` 이탤릭.
- **제목 체계**: 본문은 `##`(h2) 부터 시작 (h1은 포스트 제목 전용). 깊이는 h3까지만 TOC 대상.
- **링크**: 외부 링크는 자동으로 새 탭. 내부 링크는 `@/` alias 대신 `/posts/xxx` 형태 경로.
- **수식**: v1에서는 KaTeX 미지원. 이미지로 대체.

### 7.4 썸네일 가이드

- 권장 비율 16:9, 해상도 1600×900, 용량 < 300KB (webp/avif 권장).
- 경로: `/posts/{slug}/images/thumbnail.{ext}`.
- 미설정 시 공유·목록에서 텍스트 카드로 자동 대체.

### 7.5 Private 포스트 정책

- `private: true`로 설정한 포스트는 다음 모든 노출 면에서 제외된다.
  - 사이트맵 (`/sitemap.xml`)
  - RSS (`/rss`)
  - 검색 인덱스 (`MOD-search`)
  - 관련 포스트 · 이전/다음 포스트
  - 태그 · 시리즈 집계 카운트
  - 홈 / `/posts` 목록
- 직접 URL 접근 시 200 렌더하되, `<meta name="robots" content="noindex, nofollow" />` 및 JSON-LD 생략.
- 댓글(Giscus) 영역 비활성.

### 7.6 발행 체크리스트 (저자용)

- [ ] `frontmatter` 모든 필수 필드 채움
- [ ] `slug` = 디렉토리명
- [ ] 코드 블록 언어 힌트
- [ ] 이미지 alt 모두 존재
- [ ] 썸네일(선택) 및 OG 확인
- [ ] 시리즈 소속이면 `seriesOrder` 확인
- [ ] `contents` submodule에 커밋·푸시
- [ ] Preview URL에서 TOC·이미지·코드 블록 렌더 확인

**Definition of Done**: 저자는 본 §7만 읽고도 포스트 한 편을 빌드 실패 없이 발행할 수 있다.

## 8. Success Metrics

### 8.1 북극성 지표

> **MRR (Meaningful Read Sessions / Month)** — 한 방문에서 체류 ≥ 60초 **그리고** 스크롤 깊이 ≥ 50%인 세션 수.

- 측정: Vercel Analytics의 Session 데이터 + 스크롤 이벤트 커스텀 집계 (향후).

### 8.2 서브 지표

| 카테고리 | 지표                         | 목표 (12개월)      | 측정                            |
| -------- | ---------------------------- | ------------------ | ------------------------------- |
| 트래픽   | 월간 UV                      | ≥ 2,000            | Vercel Analytics                |
| 트래픽   | 재방문율                     | ≥ 15%              | Vercel Analytics                |
| 콘텐츠   | 공개 포스트 수               | ≥ 40편             | 내부 집계                       |
| 참여     | 평균 체류 시간               | ≥ 3분              | Vercel Analytics                |
| 참여     | 포스트별 평균 조회수         | ≥ 200              | `MOD-views`                     |
| 참여     | 시리즈 완주율                | ≥ 20%              | Vercel Analytics funnel (옵션)  |
| 탐색     | 검색 사용률 (세션 중)        | ≥ 10%              | `MOD-search` 이벤트 로깅 (옵션) |
| 성능     | Core Web Vitals green 비율   | 100%               | Speed Insights (NFR-001~003)    |
| 성능     | Lighthouse Performance       | ≥ 95               | 수동 + CI (NFR-004)             |
| SEO      | Google Search Console 인덱싱 | 모든 public 포스트 | GSC                             |

### 8.3 측정 도구 스택

- **Vercel Analytics** — 페이지뷰·세션·경로 랭킹
- **Vercel Speed Insights** — LCP/CLS/INP 실측
- **Google Search Console** — 인덱싱·쿼리·CTR
- **내부 `/api/views`** — 포스트별 조회수 단순 집계

**Definition of Done**: MRR이 월 단위로 집계 가능하고, 서브 지표 각각이 단일 대시보드 또는 쿼리로 확인 가능하다.

## 9. Non-Goals

본 블로그는 아래 범위를 **의도적으로 제외**한다. 새로운 요구가 들어오면 먼저 본 섹션에 부합하는지 검토한다.

| #     | 비목표                      | 사유                                           |
| ----- | --------------------------- | ---------------------------------------------- |
| NG-01 | 다중 저자 / 승인 워크플로우 | 1인 운영, 편집 권한 관리 불필요                |
| NG-02 | 회원가입·로그인             | 댓글은 Giscus(GitHub OAuth)로 위임             |
| NG-03 | 결제·유료 구독              | 블로그 자체로 수익화 계획 없음                 |
| NG-04 | 이메일 뉴스레터 (v1)        | 운영 비용 대비 1인 기준 불필요. P2 이후 재검토 |
| NG-05 | 실시간 기능 (알림·채팅)     | 제품 성격과 불일치                             |
| NG-06 | 서버 사이드 풀텍스트 검색   | 클라이언트 Fuse.js로 충분 (`ADR-002`)          |
| NG-07 | 다국어 (i18n)               | 한국어 단일 locale                             |
| NG-08 | 관리자 UI / Headless CMS    | MDX 파일 기반 Git 워크플로우                   |
| NG-09 | 오프라인 (Service Worker)   | 콘텐츠 무결성 위험, 복잡도 ↑                   |
| NG-10 | 네이티브 앱                 | 모바일 웹으로 충분                             |

**Definition of Done**: 비목표 10개가 명시되어 있고, 신규 기능 제안 시 NG-\*와의 충돌을 1차 검토 단계로 삼는다.

## 10. Release Milestones

### 10.1 개발 철학 — Page-First Skeleton

본 블로그는 "**모든 페이지의 껍데기를 먼저 만든다**" 원칙을 따른다. 콘텐츠 파이프라인·검색 인덱스·KV 조회수·Giscus 같은 외부 의존을 붙이기 전에, **더미 데이터(in-memory fixtures)** 와 고정 placeholder만으로 홈부터 about까지 전 화면을 완성한다. 이후 콘텐츠·기능·집계를 단계적으로 실데이터로 교체한다. 이 순서는 (a) 디자인 시스템과 레이아웃 리듬을 조기에 검증하고, (b) 외부 의존을 붙이기 전에 사용자 흐름을 고정하며, (c) "사이트 전체가 보인다"는 진척감을 빠르게 얻게 한다. 더미 데이터는 `src/shared/fixtures/` 에 격리하고 실데이터 교체 시 한 번에 제거한다.

### 10.2 마일스톤 맵

| Milestone                      | 기간  | Entry   | 핵심 산출물                                                                                                                                                                                                                               | Exit                                                                                     |
| ------------------------------ | ----- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **M0 Foundation**              | 1주   | 빈 레포 | 빌드 쉘·디자인 토큰(light/dark)·공통 컴포넌트(Header·Footer·Drawer·Container·Sidebar)·라우팅 스켈레톤(모든 `RT-*`)                                                                                                                        | `pnpm dev`에서 모든 `RT-*`가 404 없이 빈 페이지로 렌더                                   |
| **M1 UI Skeleton (All Pages)** | 2~3주 | M0      | 전 페이지 UI를 **더미 데이터**로 완성 — 홈·포스트 목록·포스트 상세(TOC·ReadingProgress·공유)·태그 허브/상세·시리즈 허브/상세·about · SearchModal · ViewCounter placeholder · Lightbox · Theme 토글 · MobileMenu · 모든 상태(빈·로딩·에러) | 더미 데이터 기준 모든 `FEAT-*`의 **UI 요구사항**이 통과, UX 흐름이 네비게이션만으로 완결 |
| **M2 Content Pipeline**        | 1~2주 | M1      | `contents/` 서브모듈 · `parseFrontmatter` · `calculateReadingTime` · `copy-content-images` · Zod 스키마 · `PostSummary`/`PostDetail` 파생 · 더미 → 실 MDX 교체                                                                            | 샘플 10편이 실데이터로 렌더, `readingTimeMinutes`가 포스트별로 다른 값                   |
| **M3 Feature Wiring**          | 2주   | M2      | `FEAT-SEARCH` Fuse 인덱싱 · `FEAT-VIEW-COUNTER` KV · `FEAT-COMMENTS` Giscus · `FEAT-THEME` persistence · `FEAT-LIGHTBOX` 실이미지 · 읽기 시간 실수치                                                                                      | 모든 P0 스토리 AC 충족 (US-001~US-008)                                                   |
| **M4 Hubs & Aggregations**     | 1~2주 | M3      | 태그·시리즈 집계 · `getTrendingPosts/Series/Tags` **빌드 타임 스냅샷** (`ADR-007`) · 관련 포스트 · 인접 포스트 · 홈 Popular 위젯 실데이터                                                                                                 | 모든 P1 스토리 AC 충족 (US-011~US-016)                                                   |
| **M5 SEO & Syndication**       | 1주   | M4      | `generateMetadata` · JSON-LD · `/og` Edge · `/sitemap.xml` · `/rss` · `/robots.txt` · Private 정책 5군데 일관                                                                                                                             | Lighthouse SEO 100, Rich Results Test 통과                                               |
| **M6 A11y & Perf**             | 1주   | M5      | 키보드 맵·포커스 트랩·skip-link · CWV 튜닝 · 폰트 서브셋 · 모션 토글                                                                                                                                                                      | NFR-001~006 전부 green, axe 0 critical                                                   |
| **M7 Polish**                  | 지속  | M6      | E2E 스모크 · P2 스토리(US-021~023) 검토 · Production 배포                                                                                                                                                                                 | Production 배포 + Change Log 고정                                                        |

### 10.3 Entry·Exit 상세

- **M0 → M1**: CI 통과 + ESLint/Prettier/Lefthook 작동 + 디자인 토큰 light/dark 둘 다 렌더 + `RT-*` 14종 전부 빈 페이지 렌더.
- **M1 → M2**: 더미 데이터 기준 모든 `FEAT-*` UI 완성 — 홈 사이드바 3블록·포스트 상세 TOC·검색 모달 결과 표·테마 전환·라이트박스·모바일 드로어 모두 조작 가능. `src/shared/fixtures/` 에 fixture 배열이 모여 있음.
- **M2 → M3**: 샘플 포스트 10편 실데이터 렌더 + `readingTimeMinutes`가 포스트별로 다른 값 + `@/shared/fixtures` 의존 제거.
- **M3 → M4**: P0 US-001~US-008 AC 전부 통과.
- **M4 → M5**: Popular 3블록이 빌드 타임 스냅샷 실데이터로 렌더, US-011~US-016 통과.
- **M5 → M6**: Lighthouse SEO 100, Rich Results/Facebook Debugger 통과.
- **M6 → Production**: NFR-001~006 전부 통과 + §7.5 Private 정책 단위 테스트 green + Giscus·KV·Submodule 환경변수 설정.

**Definition of Done**: 각 마일스톤의 Entry·Exit 기준이 체크리스트로 존재하며, 다음 단계 진입 전 필수 리뷰를 수행한다. M1 완료 시점에 **더미 데이터 기반으로라도 전 페이지가 렌더**된다.

## 11. Open Questions & Risks

### 11.1 Open Questions

| #     | 질문                                                                                                | 결정 시점              |
| ----- | --------------------------------------------------------------------------------------------------- | ---------------------- |
| OQ-01 | 중복 조회 방지 전략 (동일 세션 N회) — v1은 best-effort, v2에서 localStorage 기반 throttle 도입 여부 | M2 중                  |
| OQ-02 | 포스트 하단 "도움이 되었나요? 👍 👎" 피드백 도입 여부                                               | M4                     |
| OQ-03 | 검색 결과에 설명 본문 스니펫 하이라이트 포함 여부                                                   | M2                     |
| OQ-04 | 시리즈 완주율을 실제 이벤트로 측정할지, 경로 분석으로 대체할지                                      | M3 이후                |
| OQ-05 | 포스트 수 100편 돌파 시 Fuse 인덱스 청킹 전환 시점                                                  | 포스트 수 ≥ 80 관찰 시 |

### 11.2 Risks

| Risk                                  | 확률      | 영향             | 완화                                                            |
| ------------------------------------- | --------- | ---------------- | --------------------------------------------------------------- |
| 서브모듈 토큰 만료·권한 오설정        | 중        | 배포 차단        | 복구 런북 (Engineering §15.4), PAT 만료 90일 전 캘린더 리마인더 |
| KV 비가용                             | 낮음      | 조회수 표시 불가 | Suspense + silent fallback, 사용자 영향 없음                    |
| Giscus 스팸 / 악용                    | 낮음      | 품질 저하        | GitHub Discussions 모더레이션 사용, 문제 사용자 차단            |
| 콘텐츠 발행 지속성 (1인)              | 중        | 블로그 정체      | 시리즈 로드맵을 저자 스스로 관리 (Notion/Backlog 별도)          |
| Private 포스트 유출                   | 낮음      | 신뢰도 훼손      | §7.5 5군데 일관 제외 + 단위 테스트 증명                         |
| Fuse 인덱스 크기 임계 초과            | 중 (장기) | 초기 로드 지연   | `ADR-002` 청킹 전략, OQ-05 시점 전환                            |
| Core Web Vitals 저하 (이미지 유입 시) | 중        | SEO·UX 하락      | `next/image` + sharp + 썸네일 용량 가이드                       |

**Definition of Done**: Open Question은 결정 시점이 명시되어 있고, 각 Risk는 `확률·영향·완화` 3요소를 채운다.

---

## 부록 A. 참조 ID 인덱스

### Features (FEAT-\*)

| ID                 | 이름                                             | 대응 모듈                                           |
| ------------------ | ------------------------------------------------ | --------------------------------------------------- |
| FEAT-HOME          | 홈 페이지                                        | MOD-posts · MOD-tags · MOD-series                   |
| FEAT-POSTS-LIST    | 포스트 목록                                      | MOD-posts · MOD-tags                                |
| FEAT-POST-DETAIL   | 포스트 상세                                      | MOD-posts · MOD-views · MOD-comments · MOD-lightbox |
| FEAT-TAGS-HUB      | 태그 허브                                        | MOD-tags                                            |
| FEAT-TAG-DETAIL    | 태그 상세                                        | MOD-tags · MOD-posts                                |
| FEAT-SERIES-HUB    | 시리즈 허브                                      | MOD-series                                          |
| FEAT-SERIES-DETAIL | 시리즈 상세                                      | MOD-series · MOD-posts                              |
| FEAT-ABOUT         | About 페이지                                     | MOD-about                                           |
| FEAT-SEARCH        | 검색                                             | MOD-search                                          |
| FEAT-VIEW-COUNTER  | 조회수                                           | MOD-views                                           |
| FEAT-LIGHTBOX      | 이미지 라이트박스                                | MOD-lightbox                                        |
| FEAT-THEME         | 테마 전환                                        | MOD-theme                                           |
| FEAT-COMMENTS      | 댓글                                             | MOD-comments                                        |
| FEAT-NAVIGATION    | 내비게이션                                       | shared/layout                                       |
| FEAT-READING-AIDS  | 읽기 보조 (Progress·ScrollToTop·TOC·ScrollReset) | shared · MOD-posts                                  |
| FEAT-METADATA-OG   | 메타데이터·OG                                    | shared/seo · RT-/og                                 |
| FEAT-RSS           | RSS 피드                                         | RT-/rss                                             |
| FEAT-SITEMAP       | 사이트맵                                         | RT-/sitemap.xml                                     |

### User Stories (US-\*)

| ID     | 제목              | 우선순위 | 대응 FEAT                                            |
| ------ | ----------------- | -------- | ---------------------------------------------------- |
| US-001 | 포스트 목록 탐색  | P0       | FEAT-HOME · FEAT-POSTS-LIST                          |
| US-002 | 포스트 상세 읽기  | P0       | FEAT-POST-DETAIL · FEAT-LIGHTBOX · FEAT-READING-AIDS |
| US-003 | 검색              | P0       | FEAT-SEARCH                                          |
| US-004 | 테마 전환         | P0       | FEAT-THEME                                           |
| US-005 | 댓글 작성         | P0       | FEAT-COMMENTS                                        |
| US-006 | 저자 발행         | P0       | (Content Pipeline, Engineering §9)                   |
| US-007 | 공유              | P0       | FEAT-POST-DETAIL                                     |
| US-008 | 예상 읽기 시간    | P0       | FEAT-POST-DETAIL                                     |
| US-011 | 태그 허브 탐색    | P1       | FEAT-TAGS-HUB · FEAT-TAG-DETAIL                      |
| US-012 | 시리즈 허브·상세  | P1       | FEAT-SERIES-HUB · FEAT-SERIES-DETAIL                 |
| US-013 | 조회수 표시       | P1       | FEAT-VIEW-COUNTER                                    |
| US-014 | 이미지 라이트박스 | P1       | FEAT-LIGHTBOX                                        |
| US-015 | 관련 포스트       | P1       | FEAT-POST-DETAIL                                     |
| US-016 | 홈 Popular 위젯   | P1       | FEAT-HOME · MOD-posts · MOD-tags · MOD-series        |
| US-021 | OG 동적 생성      | P2       | FEAT-METADATA-OG                                     |
| US-022 | RSS 구독 UI       | P2       | FEAT-RSS                                             |
| US-023 | 검색 추천 키워드  | P2       | FEAT-SEARCH                                          |

## 부록 B. Glossary

본 문서는 Engineering PRD 부록 A Glossary를 공유한다. 핵심 용어는 아래를 참조.

| 용어           | 정의                                                      |
| -------------- | --------------------------------------------------------- |
| SSoT           | Single Source of Truth, 본 PRD 쌍을 가리킨다              |
| JTBD           | Jobs-to-be-Done, 사용자가 제품을 쓰는 진짜 이유           |
| AC             | Acceptance Criteria, 기능 수용 조건                       |
| NFR            | Non-Functional Requirement, 성능·접근성 등 비기능 요구    |
| MRR            | Meaningful Read Session / Month, 본 블로그의 북극성 지표  |
| Private 포스트 | `frontmatter.private = true`로 표시된 비공개 포스트       |
| 시리즈         | `frontmatter.series` + `seriesOrder`로 연결된 포스트 묶음 |

전체 Glossary는 `PRD_TECHNICAL.md` 부록 A를 참조한다.

## 부록 C. Change Log

| Version | Date       | Author  | Changes                                                                                                                                                                                                                        |
| ------- | ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0.3.0   | 2026-04-12 | chan9yu | Engineering PRD와의 일관성 정비: 기술 계약·디렉토리·테마 구현이 `.claude/rules/*`와 정렬되도록 Engineering 측에 shadcn/ui·next-themes·3 Laws·shared/modules 규약·ADR-010~012 편입. Product PRD 본문 변경 없음(기능 스펙 불변). |
| 0.2.0   | 2026-04-12 | chan9yu | US-008(예상 읽기 시간)·US-016(홈 Popular 위젯) 추가. FEAT-HOME 사이드바 상세화, FEAT-POST-DETAIL 읽기 시간 계산 규칙 명시. §10 Release Milestones를 Page-First Skeleton 순서로 재편(M1에 전 페이지 더미 UI 완성 단계 신설).    |
| 0.1.0   | 2026-04-12 | chan9yu | 초안 수립 (11 섹션 + 18 FEAT + 15 US + 10 NG + 5 OQ + 7 Risk)                                                                                                                                                                  |
