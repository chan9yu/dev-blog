import { ImageResponse } from "next/og";

import { siteMetadata } from "@/shared/config/site";

const MAX_TITLE = 120;
const MAX_TAG = 40;

// Next.js 16 `cacheComponents` 활성 시 `runtime = "edge"`와 충돌 → 기본 node runtime.
// ImageResponse는 node runtime에서도 정상 동작.
//
// TODO(M7-06 Polish): Pretendard subset .otf 임베딩으로 한글 렌더 품질 향상.
// satori는 woff2 미지원 → 정적 weight .otf/.ttf 자산 추가 필요. 현재는 satori 기본 폰트 사용.

export function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const title = (searchParams.get("title") ?? siteMetadata.name).slice(0, MAX_TITLE);
	const tag = searchParams.get("tag")?.slice(0, MAX_TAG);
	const thumbnail = searchParams.get("thumbnail");

	// 1) thumbnail이 절대 URL이면 그대로 redirect (프록시 비용 회피)
	if (thumbnail && /^https?:\/\//i.test(thumbnail)) {
		return Response.redirect(thumbnail, 302);
	}

	// 2) thumbnail이 사이트 내부 경로면 절대 URL로 redirect
	if (thumbnail && thumbnail.startsWith("/")) {
		const origin = new URL(req.url).origin;
		return Response.redirect(`${origin}${thumbnail}`, 302);
	}

	// 3) ImageResponse 동적 렌더 — 1200×630, 다크 그라디언트, 사이트 로고
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-start",
				justifyContent: "space-between",
				backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #4f46e5 100%)",
				color: "#f8fafc",
				fontFamily: "sans-serif",
				padding: "80px 96px"
			}}
		>
			{tag ? (
				<div
					style={{
						display: "flex",
						fontSize: 24,
						fontWeight: 600,
						letterSpacing: "0.04em",
						color: "#c7d2fe",
						textTransform: "uppercase"
					}}
				>
					#{tag}
				</div>
			) : (
				<div
					style={{
						display: "flex",
						fontSize: 24,
						fontWeight: 600,
						letterSpacing: "0.04em",
						color: "#c7d2fe",
						textTransform: "uppercase"
					}}
				>
					{siteMetadata.name}.dev
				</div>
			)}

			<div
				style={{
					display: "flex",
					fontSize: 72,
					fontWeight: 800,
					lineHeight: 1.1,
					letterSpacing: "-0.025em",
					maxWidth: "100%",
					color: "#f8fafc"
				}}
			>
				{title}
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					width: "100%",
					fontSize: 22,
					color: "#a5b4fc"
				}}
			>
				<span>{siteMetadata.url.replace(/^https?:\/\//, "")}</span>
				<span style={{ fontWeight: 700, color: "#f8fafc" }}>{siteMetadata.name}</span>
			</div>
		</div>,
		{ width: 1200, height: 630 }
	);
}
