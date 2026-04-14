import type { LucideIcon } from "lucide-react";
import { Briefcase, Code2, Mail, Rss } from "lucide-react";

import { SocialLinks } from "@/shared/components/SocialLinks";
import { siteMetadata, siteSocials } from "@/shared/config/site";

type SocialIconName = (typeof siteSocials)[number]["iconName"];

/**
 * lucide-react에 Github·Linkedin 브랜드 마크가 제거되어 임시 대체 (HomeHero와 동일 패턴).
 * Week 0 GC에서 shared 유틸로 승격 고려 (HomeHero·AboutProfile에 중복 ICON_MAP).
 */
const ICON_MAP: Record<SocialIconName, LucideIcon> = {
	Github: Code2,
	Linkedin: Briefcase,
	Mail,
	Rss
};

const SOCIAL_ITEMS = siteSocials.map(({ label, href, iconName }) => {
	const Icon = ICON_MAP[iconName];
	return { label, href, icon: <Icon className="size-5" aria-hidden /> };
});

export function AboutProfile() {
	return (
		<article className="space-y-10">
			<header className="space-y-3">
				<p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">About</p>
				<h1 className="text-foreground text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
					<span lang="en">{siteMetadata.author}</span>, 프론트엔드 개발자
				</h1>
				<p className="text-muted-foreground text-base leading-relaxed">{siteMetadata.description}</p>
			</header>

			<section aria-labelledby="about-intro-title" className="space-y-3">
				<h2 id="about-intro-title" className="text-foreground text-lg font-semibold">
					소개
				</h2>
				<div className="text-foreground space-y-3 text-sm leading-relaxed">
					<p>
						사용자 경험과 인터페이스 개선에 중점을 두고 끊임없이 배우고 성장하는 프론트엔드 개발자입니다. 디자인과 개발
						사이의 균형을 고민하며, React·TypeScript·Next.js 기반의 웹 애플리케이션을 만듭니다.
					</p>
					<p>
						본 블로그는 실무와 학습 과정에서 배운 것들을 정리하는 공간입니다. M4 진입 시{" "}
						<code className="bg-muted rounded px-1 py-0.5 text-xs">contents/about/index.md</code>의 실제 내용이 이
						자리에 렌더됩니다.
					</p>
				</div>
			</section>

			<section aria-labelledby="about-contact-title" className="space-y-3">
				<h2 id="about-contact-title" className="text-foreground text-lg font-semibold">
					Contact
				</h2>
				<SocialLinks items={SOCIAL_ITEMS} />
			</section>
		</article>
	);
}
