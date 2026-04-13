import { ImageResponse } from "next/og";

import { siteMetadata } from "@/shared/config/site";

const MAX_TITLE = 100;
const MAX_SUBTITLE = 160;

// Next.js 16 `cacheComponents` 활성 시 `runtime = "edge"`와 충돌 →
// 기본 runtime 사용 (ImageResponse는 node runtime에서도 정상 동작).
// TODO(M5): seo.md 규약("OG 이미지 텍스트는 폰트 내장 필수")에 따라 Pretendard subset woff2 내장.
// 현재는 satori 기본 폰트로 한글 렌더링 품질 저하 가능 — M5 전 OG 품질 polish 시 교체.

export function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const title = (searchParams.get("title") ?? siteMetadata.name).slice(0, MAX_TITLE);
	const subtitle = (searchParams.get("subtitle") ?? siteMetadata.description).slice(0, MAX_SUBTITLE);

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-start",
				justifyContent: "center",
				backgroundColor: "#0a0a0a",
				color: "#f8fafc",
				fontFamily: "sans-serif",
				padding: "96px"
			}}
		>
			<div
				style={{
					fontSize: 72,
					fontWeight: 700,
					lineHeight: 1.1,
					letterSpacing: "-0.02em",
					maxWidth: "100%"
				}}
			>
				{title}
			</div>
			<div style={{ fontSize: 28, color: "#94a3b8", marginTop: 32, maxWidth: "90%" }}>{subtitle}</div>
			<div style={{ fontSize: 20, color: "#64748b", marginTop: "auto" }}>{siteMetadata.url}</div>
		</div>,
		{ width: 1200, height: 630 }
	);
}
