import { describe, expect, it } from "vitest";

import { buildBlogPostingJsonLd, buildBreadcrumbJsonLd, buildPersonJsonLd, buildWebSiteJsonLd } from "../json-ld";

const BASE = "https://chan9yu.dev";

describe("buildWebSiteJsonLd", () => {
	it("WebSite + Person author를 절대 URL로 직렬화한다", () => {
		const ld = buildWebSiteJsonLd({
			siteUrl: BASE,
			siteName: "chan9yu",
			description: "개발 블로그",
			authorName: "chan9yu"
		});

		expect(ld["@context"]).toBe("https://schema.org");
		expect(ld["@type"]).toBe("WebSite");
		expect(ld.url).toBe("https://chan9yu.dev");
		expect(ld.name).toBe("chan9yu");
		expect(ld.description).toBe("개발 블로그");
		expect(ld.author).toEqual({ "@type": "Person", name: "chan9yu" });
	});
});

describe("buildBlogPostingJsonLd", () => {
	it("필수 필드 + 절대 URL이미지/url을 채운다", () => {
		const ld = buildBlogPostingJsonLd({
			siteUrl: BASE,
			authorName: "chan9yu",
			slug: "react-19-use",
			title: "React 19 use 훅",
			description: "use() 동작 원리",
			date: "2026-04-13",
			tags: ["react", "react-19"],
			image: "/posts/react-19-use/images/thumbnail.png"
		});

		expect(ld["@type"]).toBe("BlogPosting");
		expect(ld.headline).toBe("React 19 use 훅");
		expect(ld.description).toBe("use() 동작 원리");
		expect(ld.datePublished).toBe("2026-04-13");
		expect(ld.url).toBe("https://chan9yu.dev/posts/react-19-use");
		expect(ld.mainEntityOfPage).toEqual({
			"@type": "WebPage",
			"@id": "https://chan9yu.dev/posts/react-19-use"
		});
		expect(ld.author).toEqual({ "@type": "Person", name: "chan9yu" });
		expect(ld.keywords).toBe("react, react-19");
		expect(ld.image).toBe("https://chan9yu.dev/posts/react-19-use/images/thumbnail.png");
	});

	it("image 미지정 시 /og?title=...의 절대 URL을 만든다", () => {
		const ld = buildBlogPostingJsonLd({
			siteUrl: BASE,
			authorName: "chan9yu",
			slug: "x",
			title: "테스트",
			description: "...",
			date: "2026-04-13",
			tags: []
		});

		expect(ld.image).toBe(`${BASE}/og?title=${encodeURIComponent("테스트")}`);
	});

	it("modified 지정 시 dateModified를 부착한다", () => {
		const ld = buildBlogPostingJsonLd({
			siteUrl: BASE,
			authorName: "chan9yu",
			slug: "x",
			title: "t",
			description: "d",
			date: "2026-04-13",
			modified: "2026-04-15",
			tags: []
		});

		expect(ld.dateModified).toBe("2026-04-15");
	});
});

describe("buildBreadcrumbJsonLd", () => {
	it("3-tier breadcrumb을 ListItem 배열로 직렬화한다", () => {
		const ld = buildBreadcrumbJsonLd({
			siteUrl: BASE,
			items: [
				{ name: "홈", path: "/" },
				{ name: "포스트", path: "/posts" },
				{ name: "React 19 use 훅", path: "/posts/react-19-use" }
			]
		});

		expect(ld["@type"]).toBe("BreadcrumbList");
		expect(ld.itemListElement).toHaveLength(3);
		expect(ld.itemListElement[0]).toEqual({
			"@type": "ListItem",
			position: 1,
			name: "홈",
			item: "https://chan9yu.dev/"
		});
		const last = ld.itemListElement[2];
		expect(last?.position).toBe(3);
		expect(last?.item).toBe("https://chan9yu.dev/posts/react-19-use");
	});
});

describe("buildPersonJsonLd", () => {
	it("Person 단일 객체를 생성한다", () => {
		const ld = buildPersonJsonLd({
			name: "chan9yu",
			url: BASE,
			sameAs: ["https://github.com/chan9yu"]
		});

		expect(ld["@type"]).toBe("Person");
		expect(ld.name).toBe("chan9yu");
		expect(ld.url).toBe(BASE);
		expect(ld.sameAs).toEqual(["https://github.com/chan9yu"]);
	});
});
