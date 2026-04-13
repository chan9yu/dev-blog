---
name: content-writing
description: "MDX 포스트 작성 전용 워크플로우. 사용자가 '`{주제} 포스트 작성`', '`React 19 use 훅 글 초안`', '`시리즈 다음 편`', '`이 포스트 교정`' 같이 기술 블로그 글쓰기를 요청하면 반드시 이 스킬이 활성화. OUTLINE→DRAFT→REVIEW(SEO·a11y·코드)→VALIDATE(빌드)→DOCUMENT 5단계로 진행. content-engineer 에이전트가 주도."
---

# Content Writing

MDX 블로그 포스트 작성의 표준 워크플로우. `blog-dev` 오케스트레이터가 Content 트랙으로 분류 후 호출.

## 5단계

```
OUTLINE → DRAFT → REVIEW(3-way) → VALIDATE → DOCUMENT
```

### 1. OUTLINE (5~10분)

content-engineer가 사용자와 함께 다음 3요소 합의:

- **주제**: 1문장 핵심 메시지
- **대상 독자**: 3 Personas 중 하나 또는 조합 (미드 시니어 / 주니어 / 저자 자신)
- **분량·구성**: short(~1500자), medium(~3000자), long(~5000자+)

정보가 부족하면 `AskUserQuestion`:

- Q1. 대상 독자는? → 3 Personas 옵션
- Q2. 핵심 메시지를 1문장으로 표현하면?
- Q3. 참조 자료가 있는가? (URL/파일)

산출물: `_workspace/content_{slug}_outline.md`

```markdown
# Outline: {title}

- 주제: ...
- 대상: 미드 시니어 개발자
- 분량: medium (~3000자)
- 핵심 메시지: ...
- 구성:
  1. 도입 (문제·배경)
  2. 핵심 개념 (3요소)
  3. 실전 예시 (코드)
  4. 흔한 오해·함정
  5. 마무리·Reference
- 참조 자료: [URL 목록]
```

### 2. DRAFT

content-engineer가 OUTLINE을 기반으로 MDX 초안 작성:

- 경로: `_workspace/content_{slug}_draft.md` (아직 contents/ 이동 금지)
- `.claude/rules/mdx-content.md` 규약 엄수
- frontmatter.draft: true 고정
- 코드 예시는 실제 프로젝트 스택(Next.js 16, React 19, TS 6, Tailwind 4)으로 검증 가능한 형태만

### 3. REVIEW (3-way 병렬)

세 리뷰어가 병렬로 검수, 모두 PASS해야 다음 단계:

| 리뷰어                         | 범위                                                           | 판정 기준                      |
| ------------------------------ | -------------------------------------------------------------- | ------------------------------ |
| **seo-auditor**                | frontmatter·description·slug·OG·canonical                      | seo.md 규약                    |
| **a11y-auditor**               | heading 계층·이미지 alt·링크 컨텍스트·코드블록 스크린리더 호환 | a11y.md + WCAG 2.1 AA          |
| **react-nextjs-code-reviewer** | 코드블록의 기술 정확성·버전 호환성·실행 가능성                 | 최신 공식 문서 (context7 조회) |

각 리뷰어의 판정:

- PASS → 다음 검수 대기
- FIX(items) → content-engineer에 `SendMessage`, 수정 후 해당 리뷰어에게만 재검수
- 최대 3회 반복, 초과 시 ESCALATE

### 4. VALIDATE

- `_workspace/content_{slug}_draft.md` → 임시로 `contents/posts/{slug}/index.mdx`에 복사 (draft: true 유지)
- `pnpm build` 실행 → MDX 컴파일 성공 확인
- (선택) Lighthouse 스크립트로 OG 이미지 미리보기 확인

실패 시 EXECUTE 복귀 (1회 한정).

### 5. DOCUMENT

- frontmatter.draft: false 로 전환
- `_workspace/` → `contents/posts/{slug}/index.mdx` 최종 이동
- 첨부 이미지는 `contents/posts/{slug}/images/`에 이동
- `docs/CHANGELOG.md`에 항목 추가:

  ```markdown
  ### Added

  - [POST] {제목} — {tags}
  ```

- 시리즈 포스트면 이전 편 CHANGELOG 항목에도 "다음 편 링크" 추가 여부 질의

## 교정 모드 (기존 포스트 수정)

사용자가 "이 포스트 교정해줘" 요청 시:

1. 기존 파일 Read → `_workspace/content_{slug}_edit.md`로 복사
2. 수정 사항 반영 (content-engineer)
3. diff 제시하고 사용자 승인 요청 (`AskUserQuestion`)
4. 승인 시 `contents/posts/{slug}/index.mdx` 덮어쓰기 + frontmatter.updated 갱신
5. CHANGELOG에 `### Changed` 항목 추가

## 에러 처리

| 상황                         | 대응                                                    |
| ---------------------------- | ------------------------------------------------------- |
| 주제가 너무 모호             | OUTLINE 단계에서 AskUserQuestion으로 3요소 확정 후 진행 |
| 기술 주장의 출처 확인 불가   | 해당 단락을 "확인 필요" 주석과 함께 보류, 사용자 질의   |
| SEO·a11y·코드 리뷰가 3회 FIX | ESCALATE — 해당 섹션을 사용자에게 직접 수정 요청        |
| MDX 빌드 실패                | 에러 메시지 파싱 → content-engineer에 FIX 전달          |
| 포스트 slug 중복             | 새 slug 제안 + 승인 요청 (URL 중복 금지)                |

## 트리거 예시

- "React 19 use() 훅 포스트 작성해줘" → OUTLINE 자동 시작
- "Next.js 15 → 16 마이그레이션 글 중간 분량" → OUTLINE에서 medium 자동 선택
- "시리즈 'React 19 Deep Dive'의 2편 작성" → 1편 frontmatter 읽어 order=2 자동
- "published-post/abc의 예시 코드가 잘못됐어, 교정" → 교정 모드로 분기

## 참고

- Frontmatter 스키마: `references/frontmatter-schema.md`
- MDX 규약: `.claude/rules/mdx-content.md`
- SEO 규약: `.claude/rules/seo.md`
- 접근성: `.claude/rules/a11y.md`
