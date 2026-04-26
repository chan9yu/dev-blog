import { describe, expect, it } from "vitest";

import { buildMetadata } from "../build-metadata";

type AnyRecord = Record<string, unknown>;

describe("buildMetadata", () => {
	it("title/description/canonical을 표준 Metadata 형태로 매핑한다", () => {
		const meta = buildMetadata({
			title: "포스트",
			description: "포스트 목록",
			path: "/posts"
		});

		expect(meta.title).toBe("포스트");
		expect(meta.description).toBe("포스트 목록");
		expect(meta.alternates).toEqual({ canonical: "/posts" });
	});

	it("openGraph에 type=website 기본값과 path 기반 url을 설정한다", () => {
		const meta = buildMetadata({
			title: "포스트",
			description: "포스트 목록",
			path: "/posts"
		});

		const og = meta.openGraph as AnyRecord | undefined;
		expect(og?.type).toBe("website");
		expect(og?.url).toBe("/posts");
		expect(og?.title).toBe("포스트");
		expect(og?.description).toBe("포스트 목록");
	});

	it("twitter card는 summary_large_image로 고정한다", () => {
		const meta = buildMetadata({
			title: "포스트",
			description: "포스트 목록",
			path: "/posts"
		});

		const tw = meta.twitter as AnyRecord | undefined;
		expect(tw?.card).toBe("summary_large_image");
		expect(tw?.title).toBe("포스트");
		expect(tw?.description).toBe("포스트 목록");
	});

	it("image 미지정 시 /og?title=...로 기본 OG 이미지 URL을 생성한다", () => {
		const meta = buildMetadata({
			title: "React 19 use 훅",
			description: "...",
			path: "/posts/react-19-use"
		});

		const ogImage = Array.isArray(meta.openGraph?.images) ? meta.openGraph.images[0] : meta.openGraph?.images;
		const ogUrl = typeof ogImage === "string" ? ogImage : ogImage && "url" in ogImage ? ogImage.url : undefined;

		expect(ogUrl).toBe("/og?title=React%2019%20use%20%ED%9B%85");
	});

	it("image를 명시하면 해당 URL을 그대로 OG/Twitter에 사용한다", () => {
		const meta = buildMetadata({
			title: "포스트",
			description: "포스트",
			path: "/posts/x",
			image: "/posts/x/images/thumbnail.png"
		});

		const ogImage = Array.isArray(meta.openGraph?.images) ? meta.openGraph.images[0] : meta.openGraph?.images;
		const ogUrl = typeof ogImage === "string" ? ogImage : ogImage && "url" in ogImage ? ogImage.url : undefined;
		const twImage = Array.isArray(meta.twitter?.images) ? meta.twitter.images[0] : meta.twitter?.images;

		expect(ogUrl).toBe("/posts/x/images/thumbnail.png");
		expect(twImage).toBe("/posts/x/images/thumbnail.png");
	});

	it("type=article + publishedAt이면 article.publishedTime을 설정한다", () => {
		const meta = buildMetadata({
			title: "포스트",
			description: "포스트",
			path: "/posts/x",
			type: "article",
			publishedAt: "2026-04-13"
		});

		const og = meta.openGraph as { type?: string; publishedTime?: string } | undefined;
		expect(og?.type).toBe("article");
		expect(og?.publishedTime).toBe("2026-04-13");
	});

	it("noIndex=true면 robots에 noindex/nofollow를 설정한다", () => {
		const meta = buildMetadata({
			title: "비공개",
			description: "비공개 글",
			path: "/posts/private-x",
			noIndex: true
		});

		expect(meta.robots).toEqual({ index: false, follow: false });
	});

	it("noIndex=false면 robots를 비워둔다 (root에서 기본 허용)", () => {
		const meta = buildMetadata({
			title: "포스트",
			description: "포스트",
			path: "/posts/x"
		});

		expect(meta.robots).toBeUndefined();
	});
});
