---
description: 새 브랜치를 생성하고 전환해주세요.
---

새 브랜치를 생성하고 전환해주세요:

## 절차

1. `git status`로 현재 작업 상태 확인 (uncommitted 변경사항 체크)
2. `git branch -a`로 기존 브랜치 목록 확인 (중복 방지)
3. 변경사항이 있으면 사용자에게 커밋/스태시 여부 확인
4. **`develop` 브랜치로 전환 및 리모트 동기화** (마일스톤 브랜치의 경우 필수):
   ```bash
   git checkout develop
   git fetch origin
   git pull origin develop
   ```
5. 사용자가 지정한 이름으로 브랜치 생성, 미지정 시 아래 규칙으로 제안
6. `git checkout -b <브랜치명>` 실행

## 브랜치 네이밍 규칙

- 형식: `<타입>/<간단한-설명>`
- 소문자 영어, 하이픈(`-`)으로 단어 구분
- 50자 이내 권장

### 타입

| 타입        | 설명                          | 예시                                              |
| ----------- | ----------------------------- | ------------------------------------------------- |
| **feature** | **마일스톤 단위 개발 (권장)** | `feature/M0-foundation`, `feature/M1-ui-skeleton` |
| feat        | 기능 단위 작업 (긴급·독립)    | `feat/reading-detail-page`                        |
| fix         | 버그 수정                     | `fix/card-image-fallback`                         |
| refactor    | 코드 리팩토링                 | `refactor/notion-client-cache`                    |
| style       | UI/스타일링 변경              | `style/dark-mode-redesign`                        |
| chore       | 설정/의존성 변경              | `chore/eslint-config-update`                      |
| docs        | 문서 작업                     | `docs/prd-v2`                                     |
| test        | 테스트 추가/수정              | `test/e2e-filter-flow`                            |

### 마일스톤 브랜치 (권장 워크플로우)

블로그 프로젝트의 **기본 개발 단위는 마일스톤**이다. 새 마일스톤의 첫 태스크 진입 시 반드시:

```bash
# 1. develop 최신화
git checkout develop
git fetch origin
git pull origin develop

# 2. 마일스톤 브랜치 생성
git checkout -b feature/M{n}-{슬러그}

# 예시:
# feature/M0-foundation
# feature/M1-ui-skeleton
# feature/M2-content-pipeline
# feature/M3-search
```

**1 마일스톤 = 1 feature 브랜치** 원칙. 해당 마일스톤의 모든 태스크를 이 브랜치 위에서 순차 커밋한다. 마일스톤 완료 시 `develop`으로 PR.

## 주의사항

- **기본 base 브랜치는 `develop`** (프로덕션 릴리스 제외). `main`은 보호된 릴리스 브랜치.
- 브랜치 생성 전 반드시 `git fetch origin && git pull origin develop`으로 **리모트 최신 develop 기반** 보장
- 이미 존재하는 브랜치명은 사용하지 않는다
- 마일스톤이 이미 진행 중이라면 새 브랜치를 만들지 말고 기존 `feature/M{n}-*`에 이어서 작업한다
