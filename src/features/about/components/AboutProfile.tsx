import { SocialLinks } from "@/shared/components/common/SocialLinks";
import { CustomMDX } from "@/shared/components/mdx/CustomMDX";

import { getAboutContent } from "../services";
import { socialItems } from "../utils/socialItems";

/**
 * About 페이지 — 프로필 블록 + contents/about/index.md 렌더 (M4-20).
 *
 * - 빌드 타임에 `getAboutContent()`로 마크다운 원본을 읽어 `<CustomMDX>`로 렌더.
 * - 프로필 메타(이름/직함/소셜)는 컴포넌트 props로 분리 가능하나, 1인 블로그라 inline 유지.
 */
export function AboutProfile() {
	const aboutMdx = getAboutContent();

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

			<section className="prose prose-neutral dark:prose-invert max-w-none" aria-label="소개">
				<CustomMDX source={aboutMdx} />
			</section>
		</article>
	);
}
