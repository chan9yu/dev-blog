declare namespace NodeJS {
	interface ProcessEnv {
		// Giscus Configuration
		readonly NEXT_PUBLIC_GISCUS_REPO: string;
		readonly NEXT_PUBLIC_GISCUS_REPO_ID: string;
		readonly NEXT_PUBLIC_GISCUS_CATEGORY: string;
		readonly NEXT_PUBLIC_GISCUS_CATEGORY_ID: string;

		// Vercel Build Configuration (Server-side only)
		readonly GITHUB_REPO_CLONE_TOKEN?: string;

		// Vercel KV (Redis) Configuration
		readonly KV_URL?: string;
		readonly KV_REST_API_URL?: string;
		readonly KV_REST_API_TOKEN?: string;
		readonly KV_REST_API_READ_ONLY_TOKEN?: string;
		readonly REDIS_URL?: string;
	}
}
