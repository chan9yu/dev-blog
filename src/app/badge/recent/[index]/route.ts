import { getPublicPosts } from "@/features/posts";
import { BADGE_RECENT_COUNT, parseBadgeIndex } from "@/shared/config/badge";
import { getSiteUrl } from "@/shared/config/site";

// SSG-first(PRD G-1) — 빌드 타임 prerender → runtime contents/ 의존 0 (v1.1.2 incident 회귀 차단).
export const dynamic = "force-static";

export function generateStaticParams() {
	const count = Math.min(BADGE_RECENT_COUNT, getPublicPosts().length);
	return Array.from({ length: count }, (_, index) => ({ index: String(index) }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ index: string }> }) {
	const { index: raw } = await params;
	const index = parseBadgeIndex(raw);
	if (index === null) return new Response("Not Found", { status: 404 });

	const post = getPublicPosts()[index];
	if (!post) return new Response("Not Found", { status: 404 });

	return new Response(null, {
		status: 302,
		headers: {
			Location: `${getSiteUrl()}/posts/${post.slug}`,
			"Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
		}
	});
}
