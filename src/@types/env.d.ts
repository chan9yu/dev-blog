declare namespace NodeJS {
	interface ProcessEnv {
		// Giscus Configuration
		readonly NEXT_PUBLIC_GISCUS_REPO: string;
		readonly NEXT_PUBLIC_GISCUS_REPO_ID: string;
		readonly NEXT_PUBLIC_GISCUS_CATEGORY: string;
		readonly NEXT_PUBLIC_GISCUS_CATEGORY_ID: string;

		// Vercel Build Configuration (Server-side only)
		readonly GITHUB_REPO_CLONE_TOKEN?: string;
	}
}
