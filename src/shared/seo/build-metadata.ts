import type { Metadata } from "next";

type BuildMetadataInput = {
	title: string;
	description: string;
	path: string;
	image?: string;
	type?: "website" | "article";
	publishedAt?: string;
	modifiedAt?: string;
	authors?: string[];
	tags?: string[];
	noIndex?: boolean;
};

function resolveOgImage(input: BuildMetadataInput): string {
	if (input.image) return input.image;
	return `/og?title=${encodeURIComponent(input.title)}`;
}

// Next.js 16 `Metadata["openGraph"]`는 type별 union — 객체 mutation으로 publishedTime을 추가하면
// serializer가 article 분기를 잃어 `<meta property="article:published_time">`가 누락된다.
// 처음부터 article/website 두 갈래로 build해야 안전.
export function buildMetadata(input: BuildMetadataInput): Metadata {
	const ogImage = resolveOgImage(input);
	const ogCommon = {
		url: input.path,
		title: input.title,
		description: input.description,
		images: [{ url: ogImage, width: 1200, height: 630, alt: input.title }]
	};

	const openGraph: Metadata["openGraph"] =
		input.type === "article"
			? {
					...ogCommon,
					type: "article",
					publishedTime: input.publishedAt,
					modifiedTime: input.modifiedAt,
					authors: input.authors && input.authors.length > 0 ? input.authors : undefined,
					tags: input.tags && input.tags.length > 0 ? input.tags : undefined
				}
			: {
					...ogCommon,
					type: "website"
				};

	const meta: Metadata = {
		title: input.title,
		description: input.description,
		alternates: { canonical: input.path },
		openGraph,
		twitter: {
			card: "summary_large_image",
			title: input.title,
			description: input.description,
			images: [ogImage]
		}
	};

	if (input.noIndex) {
		meta.robots = { index: false, follow: false };
	}

	return meta;
}

// 동적 라우트의 잘못된 slug fallback. canonical/og 의도적 생략 — 존재하지 않는 페이지에 정규 URL 부여 금지.
export const NOT_FOUND_METADATA: Metadata = {
	title: "404 Not Found",
	description: "요청하신 페이지를 찾을 수 없습니다.",
	robots: { index: false, follow: false }
};
