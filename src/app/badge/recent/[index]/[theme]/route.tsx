import { ImageResponse } from "next/og";

import { getPublicPosts } from "@/features/posts";
import {
	BADGE_CACHE_CONTROL,
	BADGE_CARD,
	BADGE_PALETTE,
	BADGE_RECENT_COUNT,
	BADGE_THEMES,
	isBadgeTheme,
	loadBadgeFonts,
	parseBadgeIndex
} from "@/shared/config/badge";
import { siteMetadata } from "@/shared/config/site";
import { formatDate } from "@/shared/utils/formatDate";
import { resolveCardImageDataUri } from "@/shared/utils/resolveCardImageDataUri";

const BRAND_LABEL = siteMetadata.url.replace(/^https?:\/\//, "");

// SSG-first(PRD G-1) — 빌드 타임 prerender → runtime contents/ 의존 0 (v1.1.2 incident 회귀 차단).
export const dynamic = "force-static";
// generateStaticParams 밖 경로는 핸들러 실행 없이 즉시 404 → 런타임 getPublicPosts() 호출 0 (v1.1.2 incident 회귀 차단 완결).
export const dynamicParams = false;

export function generateStaticParams() {
	const count = Math.min(BADGE_RECENT_COUNT, getPublicPosts().length);
	return BADGE_THEMES.flatMap((theme) =>
		Array.from({ length: count }, (_, index) => ({ index: String(index), theme }))
	);
}

export async function GET(_req: Request, { params }: { params: Promise<{ index: string; theme: string }> }) {
	const { index: rawIndex, theme } = await params;
	const index = parseBadgeIndex(rawIndex);
	if (index === null || !isBadgeTheme(theme)) {
		return new Response("Not Found", { status: 404 });
	}

	const post = getPublicPosts()[index];
	if (!post) return new Response("Not Found", { status: 404 });

	const palette = BADGE_PALETTE[theme];
	const imageDataUri = resolveCardImageDataUri(post);

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				backgroundColor: palette.bg,
				fontFamily: "Pretendard"
			}}
		>
			<div style={{ display: "flex", width: "100%", height: BADGE_CARD.thumbHeight, backgroundColor: palette.border }}>
				{imageDataUri ? (
					<img
						src={imageDataUri}
						alt=""
						width={BADGE_CARD.width}
						height={BADGE_CARD.thumbHeight}
						style={{ objectFit: "cover" }}
					/>
				) : (
					<div
						style={{
							display: "flex",
							width: "100%",
							height: "100%",
							alignItems: "center",
							justifyContent: "center",
							backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #4f46e5 100%)",
							color: "#c7d2fe",
							fontSize: 34,
							fontWeight: 700,
							letterSpacing: "0.04em"
						}}
					>
						{BRAND_LABEL}
					</div>
				)}
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					flex: 1,
					padding: "20px 28px",
					justifyContent: "center",
					gap: 12
				}}
			>
				<div
					style={{
						display: "flex",
						fontSize: 26,
						fontWeight: 700,
						lineHeight: 1.3,
						color: palette.title,
						maxHeight: 70,
						overflow: "hidden"
					}}
				>
					{post.title}
				</div>
				<div style={{ display: "flex", fontSize: 20, color: palette.muted }}>{formatDate(post.date)}</div>
			</div>
		</div>,
		{
			width: BADGE_CARD.width,
			height: BADGE_CARD.height,
			fonts: loadBadgeFonts(),
			headers: { "Cache-Control": BADGE_CACHE_CONTROL }
		}
	);
}
