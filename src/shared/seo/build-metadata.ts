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

/**
 * 모든 라우트의 generateMetadata에서 호출하는 표준 Metadata 빌더.
 *
 * - title/description/canonical/og/twitter 일관 적용
 * - image 미지정 시 동적 OG 라우트(/og?title=...)로 fallback
 * - type='article' 분기를 처음부터 union으로 빌드 (`OpenGraphArticle` 직렬화 안전)
 * - noIndex=true면 robots noindex/nofollow (Private 포스트 정책)
 *
 * metadataBase는 layout.tsx 루트에서 1회 설정. 여기 path는 루트 기준 상대 경로.
 *
 * **OpenGraph union 안전성**: Next.js 16의 `Metadata["openGraph"]`는 type별 union이라
 * 객체 mutation(`og.publishedTime = ...`) 방식은 serializer가 type 분기를 잃을 수 있다.
 * 처음부터 article/website 두 갈래로 객체를 build해야 `<meta property="article:published_time">`
 * 출력이 보장된다.
 */
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
