import { Mail, Rss } from "lucide-react";

import GithubIcon from "@/shared/assets/icons/github.svg";
import LinkedinIcon from "@/shared/assets/icons/linkedin.svg";
import { siteSocials } from "@/shared/config/site";

type SocialIconName = (typeof siteSocials)[number]["iconName"];

/**
 * Github·Linkedin은 lucide-react에서 공식 브랜드 마크가 제거되어 SVG 직접 사용.
 * SVG 파일: src/shared/assets/svgs/ (@svgr/webpack → React 컴포넌트로 변환).
 * 나머지(Mail·Rss)는 lucide-react 유지.
 */
const ICON_MAP = {
	Github: GithubIcon,
	Linkedin: LinkedinIcon,
	Mail,
	Rss
} satisfies Record<SocialIconName, unknown>;

export const socialItems = siteSocials.map(({ label, href, iconName }) => {
	const Icon = ICON_MAP[iconName];
	return { label, href, icon: <Icon className="size-4" aria-hidden /> };
});
