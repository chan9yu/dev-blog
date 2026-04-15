import type { LucideIcon } from "lucide-react";
import { Briefcase, Code2, Mail, Rss } from "lucide-react";

import { SocialLinks } from "@/shared/components/SocialLinks";
import { siteSocials } from "@/shared/config/site";

type SocialIconName = (typeof siteSocials)[number]["iconName"];

const ICON_MAP: Record<SocialIconName, LucideIcon> = {
	Github: Code2,
	Linkedin: Briefcase,
	Mail,
	Rss
};

const SOCIAL_ITEMS = siteSocials.map(({ label, href, iconName }) => {
	const Icon = ICON_MAP[iconName];
	return { label, href, icon: <Icon className="size-4" aria-hidden /> };
});

/**
 * 레거시 /about 디자인 참조:
 * - h1 "About" + hr border
 * - 프로필 블록 (sm:flex-row): 128×128 rounded-xl 이미지 + 이름·직함·SocialLinks
 * - prose MDX 본문 (M4에서 contents/about/index.md 파싱 결과 주입)
 */
export function AboutProfile() {
	return (
		<article>
			<header className="mb-12">
				<h1 className="text-foreground mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">About</h1>
				<hr className="border-border" />
			</header>

			<div className="mb-12 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
				<div className="bg-muted relative size-32 shrink-0 overflow-hidden rounded-xl" aria-hidden>
					<div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-pink-500" />
				</div>
				<div className="flex-1 text-center sm:text-left">
					<h2 className="text-foreground mb-2 text-2xl font-bold">여찬규 (Chan9yu)</h2>
					<p className="text-muted-foreground mb-4 text-lg">Frontend Engineer</p>
					<SocialLinks items={SOCIAL_ITEMS} className="justify-center sm:justify-start" />
				</div>
			</div>

			<section className="prose prose-neutral dark:prose-invert max-w-none" aria-label="소개">
				<p>
					사용자 경험과 인터페이스 개선에 중점을 두고 끊임없이 배우고 성장하는 프론트엔드 개발자입니다. 디자인과 개발
					사이의 균형을 고민하며, React·TypeScript·Next.js 기반의 웹 애플리케이션을 만듭니다.
				</p>
				<p>
					본 블로그는 실무와 학습 과정에서 배운 것들을 정리하는 공간입니다. M4 진입 시{" "}
					<code>contents/about/index.md</code>의 실제 내용이 이 자리에 렌더됩니다.
				</p>
			</section>
		</article>
	);
}
