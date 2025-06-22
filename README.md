# chan9yu's dev blog

> A personal blog built with Next.js, TypeScript, and TailwindCSS.

[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10%2B-orange?logo=pnpm&logoColor=white)](https://pnpm.io)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Next.js로 구축된 개발 블로그입니다.

<br />

## Quick Start

### Prerequisites

- Node.js 22+
- PNPM 10+

### Installation

```bash
# 저장소 클론
git clone https://github.com/chan9yu/chan9yu-blog.git
cd chan9yu-blog

# 의존성 설치
pnpm install

# 개발 서버 시작 (localhost:3035)
pnpm dev

# 코드 품질 검사
pnpm lint
pnpm type-check

# 프로덕션 빌드
pnpm build
```

### Environment Setup

루트 디렉토리에 `.env` 파일을 생성하세요:

```env
NOTION_TOKEN=your-notion-api-token
NOTION_DATABASE_ID=your-notion-database-id
```

<br />

## Project Structure

이 프로젝트는 **페이지별 폴더구조**를 통해 유지보수성과 확장성을 극대화합니다.
<br />
각 페이지의 독립성을 보장하면서도 공통 기능은 효율적으로 재사용할 수 있도록 설계되었습니다.

```
chan9yu-blog
├── app/                   # Next.js App Router
│   ├── page.tsx           #   └ 메인 페이지
│   └── blog/              #   └ 블로그 페이지
├── features/              # 페이지별 전용 코드
│   ├── home/              #   ├ 메인 페이지 모듈
│   └── blog/              #   └ 블로그 페이지 모듈
│       ├── components/    #       ├ 전용 컴포넌트
│       ├── hooks.ts       #       ├ 전용 훅
│       └── utils.ts       #       └ 전용 유틸리티
└── shared/                # 전역 공유 코드
    ├── ui/                #   ├ 디자인 시스템
    ├── hooks/             #   ├ 공통 훅
    ├── lib/               #   ├ 유틸리티 함수
    ├── types/             #   ├ 타입 정의
    ├── api/               #   ├ API 모듈
    └── constants/         #   └ 상수 정의
```

### `app/` - 라우팅 레이어

Next.js App Router의 진입점입니다. 실제 URL 경로와 페이지 컴포넌트를 연결하는 역할만 담당합니다.

### `features/` - 페이지별 비즈니스 로직

각 페이지에서만 사용되는 모든 코드를 캡슐화합니다.

- **독립성**: 페이지 간 의존성을 최소화
- **응집성**: 관련 기능을 한 곳에 모아 관리
- **재사용성**: 페이지 내에서의 컴포넌트 재사용

### `shared/` - 공통 리소스

프로젝트 전반에서 재사용되는 코드를 체계적으로 관리합니다.

- **일관성**: 전역적으로 일관된 UI/UX 제공
- **효율성**: 코드 중복을 방지하고 개발 생산성 향상
- **확장성**: 새로운 기능 추가 시 기존 자산 활용

<br />

## License

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
