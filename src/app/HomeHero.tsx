import type { LucideIcon } from "lucide-react";
import { ArrowRight, Briefcase, Code2, Mail, Rss } from "lucide-react";
import Link from "next/link";

import { SocialLinks } from "@/shared/components/SocialLinks";
import { siteSocials } from "@/shared/config/site";

type SocialIconName = (typeof siteSocials)[number]["iconName"];

/**
 * lucide-react 최신 버전에서 Github·Linkedin 브랜드 마크가 제거되었으므로 임시 대체 아이콘 사용.
 * 향후 `@svgr/webpack` 도입(`.claude/rules/icons.md`) 시 `src/shared/assets/icons/`의 공식 브랜드 SVG로 교체.
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

export function HomeHero() {
	return (
		<section className="space-y-6" aria-labelledby="home-hero-title">
			<div className="space-y-4">
				<h1
					id="home-hero-title"
					className="text-foreground text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl md:text-5xl"
				>
					안녕하세요 <span aria-hidden>👋</span>
					<br />
					<span className="text-accent">프론트엔드 개발자</span> <span lang="en">chan9yu</span>입니다.
				</h1>
				<div className="text-muted-foreground max-w-2xl space-y-3 text-sm leading-relaxed text-pretty sm:text-base md:text-lg">
					<p>
						사용자 경험과 인터페이스 개선에 중점을 두고 끊임없이 배우고 성장하는 개발자입니다. 디자인과 개발 사이의
						균형을 고민합니다.
					</p>
					<p>React·TypeScript·웹 성능 최적화 등 실무에서 마주하는 주제를 이 블로그에 기록합니다.</p>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-4">
				<Link
					href="/posts"
					className="bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-ring inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
				>
					최신 글 보기
					<ArrowRight className="size-4" aria-hidden />
				</Link>
				<SocialLinks items={SOCIAL_ITEMS} />
			</div>
		</section>
	);
}
