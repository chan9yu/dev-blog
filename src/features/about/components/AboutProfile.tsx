import { SocialLinks } from "@/shared/components/common/SocialLinks";

import { socialItems } from "../utils/socialItems";

/**
 * 레거시 /about 디자인 참조:
 * - h1 "About" + hr border
 * - 프로필 블록 (sm:flex-row): 128×128 rounded-xl 이미지 + 이름·직함·SocialLinks
 * - prose MDX 본문 (M4에서 contents/about/index.md 파싱 결과 주입)
 *
 * M1 단계: 레퍼런스 섹션 구조(인사·기술스택·블로그·연락)를 플레이스홀더로 구현.
 * M4 진입 시 <section> 본문을 CustomMDX 렌더로 교체.
 */
export function AboutProfile() {
	return (
		<article>
			<header className="mb-12">
				<h1 className="text-foreground mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">About</h1>
				<hr className="border-border" />
			</header>

			{/* 프로필 블록 */}
			<div className="mb-12 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
				<div className="bg-muted relative size-32 shrink-0 overflow-hidden rounded-xl" aria-hidden>
					<div className="absolute inset-0 bg-linear-to-br from-indigo-500 via-fuchsia-500 to-pink-500" />
				</div>
				<div className="flex-1 text-center sm:text-left">
					<h2 className="text-foreground mb-2 text-2xl font-bold">여찬규 (Chan9yu)</h2>
					<p className="text-muted-foreground mb-4 text-lg">Frontend Engineer</p>
					<SocialLinks items={socialItems} className="justify-center sm:justify-start" />
				</div>
			</div>

			{/* 본문 — M4에서 CustomMDX로 교체 */}
			<section className="prose prose-neutral dark:prose-invert max-w-none" aria-label="소개">
				<h2>👋 인사하세요</h2>
				<p>
					사용자 경험과 인터페이스 개선에 중점을 두고 끊임없이 배우고 성장하는 프론트엔드 개발자입니다. 디자인과 개발
					사이의 균형을 고민하며, React·TypeScript·Next.js 기반의 웹 애플리케이션을 만듭니다.
				</p>
				<p>
					실무와 사이드 프로젝트를 통해 쌓은 경험을 이 블로그에 기록합니다. 코드와 디자인, 사용자 경험을 아우르는
					인사이트를 담겠습니다.
				</p>

				<h2>🛠 기술 스택 &amp; 전문성</h2>
				<h3>주로 사용하는 도구</h3>
				<ul>
					<li>React 19 · Next.js 16 (App Router) · TypeScript strict</li>
					<li>Tailwind CSS 4 · shadcn/ui · Framer Motion</li>
					<li>Vercel · GitHub Actions · Vitest · Playwright</li>
					<li>WebRTC · Mediasoup — 실시간 통신 서비스 경험</li>
				</ul>
				<h3>관련 활동</h3>
				<ul>
					<li>오픈소스 기여 및 사이드 프로젝트 운영</li>
					<li>웹 표준·접근성(WCAG 2.1) 준수에 관심</li>
					<li>성능 최적화 — Core Web Vitals 지표 개선</li>
				</ul>

				<h2>📝 블로그에 대하여</h2>
				<p>
					본 블로그는 실무와 학습 과정에서 배운 것들을 정리하는 공간입니다. 단순한 튜토리얼보다는 실제 문제를 해결하며
					얻은 인사이트와 트레이드오프를 중심으로 글을 씁니다.
				</p>
				<p>
					M4 진입 시 <code>contents/about/index.md</code>의 실제 내용이 이 자리에 렌더됩니다.
				</p>

				<h2>📩 연락하기</h2>
				<p>피드백, 협업 제안, 질문 등 무엇이든 환영합니다.</p>
				<ul>
					<li>
						<strong>Email</strong>: dev.cgyeo@gmail.com
					</li>
					<li>
						<strong>GitHub</strong>: github.com/chan9yu
					</li>
					<li>
						<strong>LinkedIn</strong>: linkedin.com/in/chan9yu
					</li>
				</ul>
			</section>
		</article>
	);
}
