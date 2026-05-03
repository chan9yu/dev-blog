type WebSiteInput = {
	siteUrl: string;
	siteName: string;
	description: string;
	authorName: string;
};

type BlogPostingInput = {
	siteUrl: string;
	authorName: string;
	slug: string;
	title: string;
	description: string;
	date: string;
	modified?: string;
	tags: string[];
	image?: string | null;
};

type BlogPostingJsonLd = {
	"@context": "https://schema.org";
	"@type": "BlogPosting";
	headline: string;
	description: string;
	datePublished: string;
	dateModified?: string;
	author: { "@type": "Person"; name: string };
	keywords: string;
	url: string;
	image: string;
	mainEntityOfPage: { "@type": "WebPage"; "@id": string };
};

type BreadcrumbItem = {
	name: string;
	path: string;
};

type BreadcrumbInput = {
	siteUrl: string;
	items: BreadcrumbItem[];
};

type PersonInput = {
	name: string;
	url?: string;
	sameAs?: string[];
};

type PersonJsonLd = {
	"@context": "https://schema.org";
	"@type": "Person";
	name: string;
	url?: string;
	sameAs?: string[];
};

function toAbsolute(siteUrl: string, path: string) {
	if (path.startsWith("http://") || path.startsWith("https://")) return path;
	if (path.startsWith("/")) return `${siteUrl}${path}`;
	return `${siteUrl}/${path}`;
}

export function buildWebSiteJsonLd(input: WebSiteInput) {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		url: input.siteUrl,
		name: input.siteName,
		description: input.description,
		inLanguage: "ko-KR",
		author: { "@type": "Person", name: input.authorName }
	};
}

export function buildBlogPostingJsonLd(input: BlogPostingInput) {
	const url = `${input.siteUrl}/posts/${input.slug}`;
	const image = input.image
		? toAbsolute(input.siteUrl, input.image)
		: `${input.siteUrl}/og?title=${encodeURIComponent(input.title)}`;

	const ld: BlogPostingJsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: input.title,
		description: input.description,
		datePublished: input.date,
		author: { "@type": "Person", name: input.authorName },
		keywords: input.tags.join(", "),
		url,
		image,
		mainEntityOfPage: { "@type": "WebPage", "@id": url }
	};

	if (input.modified) ld.dateModified = input.modified;

	return ld;
}

export function buildBreadcrumbJsonLd(input: BreadcrumbInput) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: input.items.map((item, idx) => ({
			"@type": "ListItem",
			position: idx + 1,
			name: item.name,
			item: toAbsolute(input.siteUrl, item.path)
		}))
	};
}

export function buildPersonJsonLd(input: PersonInput) {
	const ld: PersonJsonLd = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: input.name
	};
	if (input.url) ld.url = input.url;
	if (input.sameAs && input.sameAs.length > 0) ld.sameAs = input.sameAs;
	return ld;
}
