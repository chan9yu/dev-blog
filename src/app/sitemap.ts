import { siteMetadata } from "@/shared/config/site";

export default function sitemap() {
	// M5에서 모든 포스트/태그/시리즈 경로 동적 생성 예정. 현재는 정적 상위 경로만.
	const now = new Date();

	return [
		{ url: siteMetadata.url, lastModified: now, changeFrequency: "daily", priority: 1.0 },
		{ url: `${siteMetadata.url}/posts`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
		{ url: `${siteMetadata.url}/tags`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
		{ url: `${siteMetadata.url}/series`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
		{ url: `${siteMetadata.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 }
	];
}
